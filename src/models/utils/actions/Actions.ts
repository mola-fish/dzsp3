import {Action, ActionOption} from "./Action";
import {fetchJSON, sleep} from "./misc";
import EventBus from "../../../utils/EventBus";

interface ViewInfoActionOption extends ActionOption
{
    type: "viewinfo";
    target:CZMAP.Point;
    hpr:CZMAP.Point;
    duration:number;
}

class ViewInfoAction extends Action
{
    _option: ViewInfoActionOption;

    constructor(view3d:CZMAP.MapView3D, option:ViewInfoActionOption)
    {
        super(view3d, option);

        this._option = option;
    }

    override init(): Promise<void>
    {
        return Promise.resolve();
    }

    start(): void
    {
        const option = this._option;
        this.view3d.setViewInfo({
            position: option.target,
            heading: option.hpr[0],
            pitch: option.hpr[1],
            roll: option.hpr[2]
        }, {
            duration: option.duration
        })
    }

    finish(): void
    {
        //throw new Error("Method not implemented.");
    }

}
interface EventOption extends ActionOption
{
    type: 'event',
    eventType: string,
    args: Array<any>
}

class EventAction extends Action
{
    _option: EventOption;

    constructor(view3d:CZMAP.MapView3D, option:EventOption)
    {
        super(view3d, option);

        this._option = option;
    }

    override init(): Promise<void>
    {
        return Promise.resolve();
    }

    start(): void
    {
        const op = this._option
        EventBus.$emit(op.eventType, op.args);
    }

    finish(): void
    {
        this.finished = true;
        //throw new Error("Method not implemented.");
    }

}

interface FlyActionOption extends ActionOption
{
    type: "flyto";
    target:CZMAP.Point;
    heading:number;
    pitch: number;
    distance: number;
    duration:number;
}

class FlytoAction extends Action
{
    _option: FlyActionOption;

    constructor(view3d:CZMAP.MapView3D, option:FlyActionOption)
    {
        super(view3d, option);

        this._option = option;
    }

    override init(): Promise<void>
    {
        return Promise.resolve();
    }

    start(): void
    {
        const option = this._option;
        const ps = Cesium.Cartesian3.fromDegrees(... option.target);
        const sp = new Cesium.BoundingSphere(ps, option.distance);
        this.view3d.flyToSphere(sp, {
            heading: option.heading,
            pitch: option.pitch,
            duration: option.duration
        })
    }

    finish(): void
    {
        //throw new Error("Method not implemented.");
    }

}

interface RotateActionOption extends ActionOption
{
    type: "rotate";
    target:CZMAP.Point;
    pitch:number;
    distance:number;
    speed: number;
    flyDuration: number;
    duration: number;
}

class RotateAction extends Action
{
    protected _option:RotateActionOption;
    protected _loop: Loop;
    protected _canceled:boolean = false;

    constructor(view3d:CZMAP.MapView3D, option:RotateActionOption)
    {
        super(view3d, option);

        this._option = option;
    }

    override init(): Promise<void>
    {
        return Promise.resolve();
    }

    async start()
    {
        this._canceled = false;
        const option = this._option;
        const tar = Cesium.Cartesian3.fromDegrees(... option.target);
        const sp = new Cesium.BoundingSphere(tar, option.distance);
        const vinfo = this.view3d.getViewInfo();

        const flyOption : CZMAP.FlyToOption = {
            heading: vinfo.heading,
            pitch: option.pitch,
            distance: option.distance,
            duration: option.flyDuration || 2,
        }

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

    finish(): void
    {
        if (this._loop)
        {
            this._loop.stop();
            console.info('stop rotate:' + this._loop.id);
        }

        ///
        this._canceled = true;
    }

}

abstract class EntityAction extends Action
{
    protected _entities: Cesium.Entity[] = [];
    protected _loop: Loop;

    constructor(view3d:CZMAP.MapView3D, option: ActionOption)
    {
        super(view3d, option);
    }

    start(): void
    {
        if (!this._entities) return;

        ///
        this._entities.forEach(e => { e.show = true; })
        this._loop = loop(1000, (percent) => {
            this._entities.forEach(e => showEntity(e, percent))
        });
    }

    finish(): void
    {
        if (!this._entities) return;

        if (this._loop)
            this._loop.stop();

        loop(1000, (percent) => {
            this._entities.forEach(e => showEntity(e, 1-percent))
        }, () => {
            this._entities.forEach(e => e.show = false);
        });
    }

    destroy()
    {
        if (this._entities)
        {
            this._entities.forEach(e => this.czviewer.entities.remove(e));
            this._entities.length = 0;
        }
    }
}

interface PinActionOption extends ActionOption
{
    type:"pin",
    target:CZMAP.Point;
    icon: string;
    text: string;
    textColor: string;
    textFont: string;
}

function showEntityPoly(entity:Cesium.Entity, show: boolean)
{
    const { billboard, label, polygon, polyline } = entity;
    if (polyline)
    {
        polyline.show = show as any;
    }

    if (polygon)
    {
        polygon.show = show as any;
    }
}

function showEntity(entity:Cesium.Entity, percent:number)
{
    const { billboard, label, polygon, polyline } = entity;
    if (billboard) billboard.scale = percent as any;
    if (label) label.scale = percent as any;
}

class PinActive extends EntityAction
{
    _option:PinActionOption;
    _ready:Promise<void>;


    constructor(view3d:CZMAP.MapView3D, option: PinActionOption)
    {
        super(view3d, option);
        this._option = option;
    }

    init():Promise<void>
    {
        return this._init();
    }

    private async _init()
    {
        const option = this._option;
        const img = await fetchImage(option.icon);

        const entity = this.czviewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(... option.target),
            show : false,
            billboard: {
                scale : 0,
                image: option.icon,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
            label: {
                scale : 0,
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

interface PolylineActionOption extends ActionOption
{
    type:"polyline",
    points:CZMAP.Point[]|string;
    width: number;
    material: string | any;
}

function asPolylineMaterial(material: string | any)
{
    if (typeof material === 'string')
        return CZMAP.CesiumAttrib.getColor(material);

    material = Object.assign({}, material);
    material.color = CZMAP.CesiumAttrib.getColor(material.color);
    material.outlineColor = CZMAP.CesiumAttrib.getColor(material.outlineColor);
    switch (material.type)
    {
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

function setColorPropertyAlpha(material:any, name:string, alpha:number)
{
    if (!material) return;

    const prop = material[name];
    if (!prop) return;

    ///
    const color = prop.getValue(undefined) as Cesium.Color;
    if (!color) return;

    ///
    const acolor = color.withAlpha(alpha);
    material[name] = acolor;
}

class PolylineAction extends EntityAction
{
    _option: PolylineActionOption;

    constructor (view3d:CZMAP.MapView3D, option: PolylineActionOption)
    {
        super(view3d, option);
        this._option = option;
    }

    async init()
    {
        let lines = await loadPolyline(this._option.points);
        this.createEntity(lines);
    }

    private createEntity(line:CZMAP.Point[])
    {
        const entity = this.czviewer.entities.add({
            show : false,
            polyline: {
                positions: line.map(p => Cesium.Cartesian3.fromDegrees(... p)),
                width: this._option.width,
                material: asPolylineMaterial(this._option.material)
            }
        });

        this._entities.push(entity);

    }
}

interface PolygonActionOption extends ActionOption
{
    type:"polygon",
    points:CZMAP.Point[][]|string;
    color: string;
    outlineColor: string|any;
    outlineWidth: number;
    text: string;
    textColor: string;
    textFont: string;
}

class PolygoneAction extends EntityAction
{
    _option: PolygonActionOption;


    constructor (view3d:CZMAP.MapView3D, option: PolygonActionOption)
    {
        super(view3d, option);
        this._option = option;
    }

    async init()
    {
        let polygon = await loadPolygon(this._option.points);
        this.createEntity(polygon[0]);
    }

    private createEntity(points:CZMAP.Point[])
    {
        const option = this._option;
        const box = Cesium.AxisAlignedBoundingBox.fromPoints(points.map(p => new Cesium.Cartesian3(... p)));
        const center = Cesium.Cartesian3.midpoint(box.minimum, box.maximum, new Cesium.Cartesian3());
        const position = Cesium.Cartesian3.fromDegrees(center.x, center.y, center.z);

        const entOption:Cesium.Entity.ConstructorOptions = {
            show: false,
        }

        const positions = points.map(p => Cesium.Cartesian3.fromDegrees(... p));

        if (option.color)
        {
            entOption.polygon = {
                hierarchy: positions as any,
                fill: true,
                material: asPolylineMaterial(option.color),
                outlineColor : CZMAP.CesiumAttrib.getColor(option.outlineColor)
            }
        }

        if (option.outlineColor && option.outlineWidth)
        {
            entOption.polyline = {
                positions: positions,
                width: option.outlineWidth,
                material: asPolylineMaterial(option.outlineColor)
            }
        }

        if (this._option.text)
        {
            entOption.position = position;
            entOption.label = {
                scale : 0,
                text: option.text,
                font: option.textFont,
                fillColor: CZMAP.CesiumAttrib.getColor(option.textColor),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, - 10)
            }
        }

        ///
        this._entities.push(this.czviewer.entities.add(entOption));
    }
}

interface CircleActionOption extends PolygonActionOption
{
    center: CZMAP.Point;
    radius: number;
}

class CircleAction extends PolygoneAction
{
    constructor(view3d:CZMAP.MapView3D, option: PolygonActionOption)
    {
        super(view3d, option);
    }

    async init()
    {

    }
}

async function loadPolyline(data:CZMAP.Point[]|string): Promise<CZMAP.Point[]>
{
    if (typeof data === "string")
    {
        const json = await fetchJSON(data);
        const type = json.geometry.type;
        if (type === 'LineString')
            return json.geometry.coordinates;
        else if (type === 'Polygon')
            return json.geometry.coordinates[0];
        else
        {
            console.warn('错误的文件格式');
            return [];
        }
    }
    else
    {
        return data;
    }
}

async function loadPolygon(points:CZMAP.Point[][]|string): Promise<CZMAP.Point[][]>
{
    if (typeof points === "string")
    {
        const json = await fetchJSON(points);
        const type = json.geometry.type;
        if (type === 'LineString')
            return [json.geometry.coordinates];
        else if (type === 'Polygon')
            return json.geometry.coordinates;
        else
        {
            console.warn('错误的文件格式');
            return [];
        }
    }
    else
    {
        return points;
    }
}

interface DistanceActionOption extends ActionOption
{
    type: 'distance',
    text: string;
    points: CZMAP.Point[],
    textColor: string;
    textFont: string;
    lineColor: string;
    lineWidth: number;
}

class DistanceAction extends EntityAction
{
    constructor (view3d:CZMAP.MapView3D, option: DistanceActionOption)
    {
        super(view3d, option);

        const p0 = Cesium.Cartesian3.fromDegrees(...option.points[0]);
        const p1 = Cesium.Cartesian3.fromDegrees(...option.points[1]);
        option.points.map(p => Cesium.Cartesian3.fromDegrees(... p))
        const entity = this.czviewer.entities.add({
            show : false,
            position : Cesium.Cartesian3.midpoint(p0, p1, new Cesium.Cartesian3()),
            label: {
                scale : 0,
                text: option.text,
                font: option.textFont,
                fillColor: CZMAP.CesiumAttrib.getColor(option.textColor),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, - 20)
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

interface BuildActionOption extends ActionOption
{
    type:"build",
    target: "string";
}

class BuildAction extends Action
{
    _option : BuildActionOption;

    static type: 'build';

    constructor (view3d:CZMAP.MapView3D, option: BuildActionOption)
    {
        super(view3d, option);

        this._option = option;
    }

    start(): void
    {
        // FIXME
        // app901.mainTopControl.toggle(this._option.target);
    }

    finish(): void
    {
    }
}

interface BuildInnerActionOption extends ActionOption
{
    type : "buildinner",
    target: string;
}

class BuildInnerAction extends Action
{
    _option : BuildInnerActionOption;

    static type: 'buildinner';

    constructor (view3d:CZMAP.MapView3D, option: BuildInnerActionOption)
    {
        super(view3d, option);

        this._option = option;
    }

    start(): void
    {
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

    finish(): void
    {

    }
}

function fetchImage(src:string)
{
    return new Promise<HTMLImageElement>((resolve, reject) => {

        const img = new Image();
        img.onload = () => resolve(img);
        img.crossOrigin = 'anonymous';
        img.src = src;
    });
}

let nextLoopID = 0;

class Loop
{
    readonly id: number = nextLoopID++;

    ///
    private duration: number;
    private callback: (percent:number)=> void;
    private finish?:() => void;

    private handle = 0;
    private stopped = false;

    constructor (option:{duration:number, callback:(percent:number)=> void, finish?:() => void})
    {
        this.duration = option.duration;
        this.callback = option.callback;
        this.finish = option.finish;
    }

    start()
    {
        this.next();
    }

    stop()
    {
        this.stopped = true;
        if (this.finish)
            this.finish();

        ///
        if (this.handle)
        {
            cancelAnimationFrame(this.handle);
            this.handle = 0;
        }
    }

    startTime:number;

    loop(now:number){

        if (this.stopped)
            return;

        now = new Date().getTime();
        if (this.startTime === undefined)
        {
            this.startTime = now;
        }

        if (now > this.startTime + this.duration)
        {
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

    next()
    {
        this.handle = requestAnimationFrame((now) => this.loop(now));
    }
}

function loop(duration:number, callback:(percent:number)=> void, finish?:() => void)
{
    const loop = new Loop({
        duration, callback, finish
    });

    loop.start();

    return loop;
}

type ActionCreator = { new (view3d:CZMAP.MapView3D, option: ActionOption):Action };
const ActionTypes: Record<string, ActionCreator > = {
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

export function createAction<T extends ActionOption>(view3d:CZMAP.MapView3D, option:T)
{
    const creator = ActionTypes[option.type];
    if (!creator) return;

    return new creator(view3d, option);
}
