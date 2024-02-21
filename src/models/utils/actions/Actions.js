import { Action } from "./Action";
import { fetchJSON, sleep } from "./misc";
import EventBus from "../../../utils/EventBus";
class ViewInfoAction extends Action {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    init() {
        return Promise.resolve();
    }
    start() {
        const option = this._option;
        this.view3d.setViewInfo({
            position: option.target,
            heading: option.hpr[0],
            pitch: option.hpr[1],
            roll: option.hpr[2]
        }, {
            duration: option.duration
        });
    }
    finish() {
        //throw new Error("Method not implemented.");
    }
}
class EventAction extends Action {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    init() {
        return Promise.resolve();
    }
    start() {
        const op = this._option;
        EventBus.$emit(op.eventType, op.args);
    }
    finish() {
        this.finished = true;
        //throw new Error("Method not implemented.");
    }
}
class FlytoAction extends Action {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    init() {
        return Promise.resolve();
    }
    start() {
        const option = this._option;
        const ps = Cesium.Cartesian3.fromDegrees(...option.target);
        const sp = new Cesium.BoundingSphere(ps, option.distance);
        this.view3d.flyToSphere(sp, {
            heading: option.heading,
            pitch: option.pitch,
            duration: option.duration
        });
    }
    finish() {
        //throw new Error("Method not implemented.");
    }
}
class RotateAction extends Action {
    constructor(view3d, option) {
        super(view3d, option);
        this._canceled = false;
        this._option = option;
    }
    init() {
        return Promise.resolve();
    }
    async start() {
        this._canceled = false;
        const option = this._option;
        const tar = Cesium.Cartesian3.fromDegrees(...option.target);
        const sp = new Cesium.BoundingSphere(tar, option.distance);
        const vinfo = this.view3d.getViewInfo();
        const flyOption = {
            heading: vinfo.heading,
            pitch: option.pitch,
            distance: option.distance,
            duration: option.flyDuration || 2,
        };
        this.view3d.flyToSphere(sp, flyOption);
        await sleep(flyOption.duration * 1000);
        ///
        if (this._canceled)
            return;
        ///
        flyOption.duration = 0;
        const speed = option.speed || 0.1;
        let ff = false;
        this._loop = loop(option.duration * 1000, (percent) => {
            flyOption.heading += speed;
            ff = !ff;
            if (ff)
                this.view3d.flyToSphere(sp, flyOption);
        });
        console.info('start rotate:' + this._loop.id);
    }
    finish() {
        if (this._loop) {
            this._loop.stop();
            console.info('stop rotate:' + this._loop.id);
        }
        ///
        this._canceled = true;
    }
}
class EntityAction extends Action {
    constructor(view3d, option) {
        super(view3d, option);
        this._entities = [];
    }
    start() {
        if (!this._entities)
            return;
        ///
        this._entities.forEach(e => { e.show = true; });
        this._loop = loop(1000, (percent) => {
            this._entities.forEach(e => showEntity(e, percent));
        });
    }
    finish() {
        if (!this._entities)
            return;
        if (this._loop)
            this._loop.stop();
        loop(1000, (percent) => {
            this._entities.forEach(e => showEntity(e, 1 - percent));
        }, () => {
            this._entities.forEach(e => e.show = false);
        });
    }
    destroy() {
        if (this._entities) {
            this._entities.forEach(e => this.czviewer.entities.remove(e));
            this._entities.length = 0;
        }
    }
}
function showEntityPoly(entity, show) {
    const { billboard, label, polygon, polyline } = entity;
    if (polyline) {
        polyline.show = show;
    }
    if (polygon) {
        polygon.show = show;
    }
}
function showEntity(entity, percent) {
    const { billboard, label, polygon, polyline } = entity;
    if (billboard)
        billboard.scale = percent;
    if (label)
        label.scale = percent;
}
class PinActive extends EntityAction {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    init() {
        return this._init();
    }
    async _init() {
        const option = this._option;
        const img = await fetchImage(option.icon);
        const entity = this.czviewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(...option.target),
            show: false,
            billboard: {
                scale: 0,
                image: option.icon,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
            label: {
                scale: 0,
                text: option.text,
                font: option.textFont,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: CZMAP.CesiumAttrib.getColor(option.textColor),
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -img.height - 10)
            }
        });
        this._entities.push(entity);
    }
}
function asPolylineMaterial(material) {
    if (typeof material === 'string')
        return CZMAP.CesiumAttrib.getColor(material);
    material = Object.assign({}, material);
    material.color = CZMAP.CesiumAttrib.getColor(material.color);
    material.outlineColor = CZMAP.CesiumAttrib.getColor(material.outlineColor);
    switch (material.type) {
        case 'arrow':
            return new Cesium.PolylineArrowMaterialProperty(material.color);
        case 'dash':
            return new Cesium.PolylineDashMaterialProperty(material);
        case 'outline':
            return new Cesium.PolylineOutlineMaterialProperty(material);
        case 'glow':
            return new Cesium.PolylineGlowMaterialProperty(material);
    }
}
function setColorPropertyAlpha(material, name, alpha) {
    if (!material)
        return;
    const prop = material[name];
    if (!prop)
        return;
    ///
    const color = prop.getValue(undefined);
    if (!color)
        return;
    ///
    const acolor = color.withAlpha(alpha);
    material[name] = acolor;
}
class PolylineAction extends EntityAction {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    async init() {
        let lines = await loadPolyline(this._option.points);
        this.createEntity(lines);
    }
    createEntity(line) {
        const entity = this.czviewer.entities.add({
            show: false,
            polyline: {
                positions: line.map(p => Cesium.Cartesian3.fromDegrees(...p)),
                width: this._option.width,
                material: asPolylineMaterial(this._option.material)
            }
        });
        this._entities.push(entity);
    }
}
class PolygoneAction extends EntityAction {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    async init() {
        let polygon = await loadPolygon(this._option.points);
        this.createEntity(polygon[0]);
    }
    createEntity(points) {
        const option = this._option;
        const box = Cesium.AxisAlignedBoundingBox.fromPoints(points.map(p => new Cesium.Cartesian3(...p)));
        const center = Cesium.Cartesian3.midpoint(box.minimum, box.maximum, new Cesium.Cartesian3());
        const position = Cesium.Cartesian3.fromDegrees(center.x, center.y, center.z);
        const entOption = {
            show: false,
        };
        const positions = points.map(p => Cesium.Cartesian3.fromDegrees(...p));
        if (option.color) {
            entOption.polygon = {
                hierarchy: positions,
                fill: true,
                material: asPolylineMaterial(option.color),
                outlineColor: CZMAP.CesiumAttrib.getColor(option.outlineColor)
            };
        }
        if (option.outlineColor && option.outlineWidth) {
            entOption.polyline = {
                positions: positions,
                width: option.outlineWidth,
                material: asPolylineMaterial(option.outlineColor)
            };
        }
        if (this._option.text) {
            entOption.position = position;
            entOption.label = {
                scale: 0,
                text: option.text,
                font: option.textFont,
                fillColor: CZMAP.CesiumAttrib.getColor(option.textColor),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -10)
            };
        }
        ///
        this._entities.push(this.czviewer.entities.add(entOption));
    }
}
class CircleAction extends PolygoneAction {
    constructor(view3d, option) {
        super(view3d, option);
    }
    async init() {
    }
}
async function loadPolyline(data) {
    if (typeof data === "string") {
        const json = await fetchJSON(data);
        const type = json.geometry.type;
        if (type === 'LineString')
            return json.geometry.coordinates;
        else if (type === 'Polygon')
            return json.geometry.coordinates[0];
        else {
            console.warn('错误的文件格式');
            return [];
        }
    }
    else {
        return data;
    }
}
async function loadPolygon(points) {
    if (typeof points === "string") {
        const json = await fetchJSON(points);
        const type = json.geometry.type;
        if (type === 'LineString')
            return [json.geometry.coordinates];
        else if (type === 'Polygon')
            return json.geometry.coordinates;
        else {
            console.warn('错误的文件格式');
            return [];
        }
    }
    else {
        return points;
    }
}
class DistanceAction extends EntityAction {
    constructor(view3d, option) {
        super(view3d, option);
        const p0 = Cesium.Cartesian3.fromDegrees(...option.points[0]);
        const p1 = Cesium.Cartesian3.fromDegrees(...option.points[1]);
        option.points.map(p => Cesium.Cartesian3.fromDegrees(...p));
        const entity = this.czviewer.entities.add({
            show: false,
            position: Cesium.Cartesian3.midpoint(p0, p1, new Cesium.Cartesian3()),
            label: {
                scale: 0,
                text: option.text,
                font: option.textFont,
                fillColor: CZMAP.CesiumAttrib.getColor(option.textColor),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20)
            },
            polyline: {
                positions: [p0, p1],
                width: option.lineWidth,
                material: new Cesium.PolylineArrowMaterialProperty(CZMAP.CesiumAttrib.getColor(option.lineColor))
            }
        });
        this._entities.push(entity);
    }
}
class BuildAction extends Action {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    start() {
        // FIXME
        // app901.mainTopControl.toggle(this._option.target);
    }
    finish() {
    }
}
class BuildInnerAction extends Action {
    constructor(view3d, option) {
        super(view3d, option);
        this._option = option;
    }
    start() {
        // FIXME
        // switch(this._option.target)
        // {
        //     case 'inner':
        //         modelsControl.hideRoof(); break;
        //     case 'outer':
        //         modelsControl.revert(); break;
        //     default:
        //         modelsControl.dealActionByName(this._option.target);
        // }
    }
    finish() {
    }
}
function fetchImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.crossOrigin = 'anonymous';
        img.src = src;
    });
}
let nextLoopID = 0;
class Loop {
    constructor(option) {
        this.id = nextLoopID++;
        this.handle = 0;
        this.stopped = false;
        this.duration = option.duration;
        this.callback = option.callback;
        this.finish = option.finish;
    }
    start() {
        this.next();
    }
    stop() {
        this.stopped = true;
        if (this.finish)
            this.finish();
        ///
        if (this.handle) {
            cancelAnimationFrame(this.handle);
            this.handle = 0;
        }
    }
    loop(now) {
        if (this.stopped)
            return;
        now = new Date().getTime();
        if (this.startTime === undefined) {
            this.startTime = now;
        }
        if (now > this.startTime + this.duration) {
            //const finishTime = new Date().getTime();
            //console.info(`cost1:${finishTime - this.startTime2}, const2:${now - this.startTime}`)
            this.callback(1);
            if (this.finish)
                this.finish();
            return;
        }
        ///
        const percent = (now - this.startTime) / this.duration;
        this.callback(percent);
        ///
        this.next();
    }
    next() {
        this.handle = requestAnimationFrame((now) => this.loop(now));
    }
}
function loop(duration, callback, finish) {
    const loop = new Loop({
        duration, callback, finish
    });
    loop.start();
    return loop;
}
const ActionTypes = {
    flyto: FlytoAction,
    viewinfo: ViewInfoAction,
    pin: PinActive,
    polyline: PolylineAction,
    polygon: PolygoneAction,
    distance: DistanceAction,
    build: BuildAction,
    buildinner: BuildInnerAction,
    rotate: RotateAction,
    event: EventAction
};
export function createAction(view3d, option) {
    const creator = ActionTypes[option.type];
    if (!creator)
        return;
    return new creator(view3d, option);
}
