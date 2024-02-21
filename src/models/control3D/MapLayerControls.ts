import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import CompInterface from "../interface/CompInterface";
import CompInterfaceAopFactory from "../interface/CompInterfaceAopFactory";
import { AnimationLayerManager } from "./AnimationLayer";
import MapLayerDebuggerControls from "./MapLayerDebuggerControls";
import ComMap = CZMAP.ComMap;
import FeatureLayer = CZMAP.FeatureLayer;
import Layer = CZMAP.Layer;
import GeoPoint = CZMAP.GeoPoint;
import VectorLayer = CZMAP.VectorLayer;
import Folder = CZMAP.Folder;

/**
 * 图层控制工具参数
 */
type MapLayerControlsOptions = {

}
interface ModelDefine
{
  uri: string;
  position: [number,number,number];
  headingPitchRoll?: [number, number, number],
  scale?: [number, number, number]
}
/**
 * @see 地图环境的配置文件
 */
type MapLayerConfig = MapConfigRoot;

type TableCell = {
    name?: string,
    content: string,
    cols?: number,
}

type TableRow = Array<TableCell>;
type Table = Array<TableRow>;
enum defType {
    table = 'table',
}
type RichTable = {
    name: string,
    render: defType,
    fieldMap: any,
    rows: Table
}

interface LayerOptions {
  /** 图层的名称 */
  name?: string;
  /** 图层是否可见 */
  visible?: boolean;
  define?: any;
}

class FakeLayer extends Layer {
    private tiles: Cesium.Cesium3DTileset;
    private viewer: Cesium.Viewer;
    private _visible: boolean;

    constructor(parent: Folder, tiles:Cesium.Cesium3DTileset, viewer: Cesium.Viewer, options?: LayerOptions) {
      super(parent, options);
      this.tiles = tiles;
      this.viewer = viewer;
      this.visible = true;
    }

    set visible(visible) {
        this.tiles.show = visible;
        this._visible = visible;
    }

    get visible () {
        return this._visible
    }

    zoomTo(option?: CZMAP.ZoomToOption) {
      this.viewer.zoomTo(this.tiles);
    }

    flyTo(option?: CZMAP.ZoomToOption) {
      this.zoomTo(option);
    }

}
/**
 * 各类资源的实例
 */
export type CompInterfaceInstance = {
  type: MapLayerMenuEnum,
  instance: CompInterface;
  config: MapConfigChildren_2,
  layer: CZMAP.Layer,
}

type CircleInfo = {
    center: Cesium.Cartesian3,
    radius: number,
}

/** 包裹后的文件夹类型， */
interface WrapFolder {
    name: string,
    config: any,
    folder: CZMAP.Folder
}

class MapLayerQuery {
    constructor() {
    }

    static circleQuery (circle:CircleInfo, layers: Array<WrapFolder>, type?: MapLayerMenuEnum) {
        const center = circle.center;
        const radius = circle.radius;
        const result = [];
        layers.forEach(wrapFolder => {
            this.filterFeatureLayers(wrapFolder.folder.children, type).forEach(layer => {
                const features = layer.children.filter(featureLayer => {
                    const feature = featureLayer as FeatureLayer;
                    const geo = feature.geometry as GeoPoint;
                    if(!geo.x || !geo.y) return false;
                    return Cesium.Cartesian3.distance(center, Cesium.Cartesian3.fromDegrees(Number(geo.x), Number(geo.y), Number(geo.z) || 0)) < radius;
                })
                if (features.length > 0) {
                    result.push({
                        layer,
                        features,
                    })
                }
            });
        });

        return result;
    }

    static filterFeatureLayers (features: Array<Layer>, type: MapLayerMenuEnum) {
        if(!type) return features

        return features.filter(feature => {
            const fea = feature as FeatureLayer;
            const prop = fea.define as any;
            const bind = prop?.ui?.bind || [];
            return bind.some(item => item === type);
        })
    }
}

// 事件处理
class EventHandler {

    private handle: any;
    private eventType: any;
    constructor(eventType) {
        this.handle = {} as any;
        this.eventType = eventType
    }
    on(type, call){
        if(!(type in this.handle)){
            this.handle[type] = []
        }
        this.handle[type].push(call)
    }
    off(type, func){
        let handle = this.handle;
        if(!handle[type]) return false;
        if(!func){
            handle[type] = []
            return true;
        } else {
            let index = handle[type].indexOf(item => item === func)
            if(index !== -1)
                handle[type].splice(index, 1)
            return true
        }
    }
    offAll(){
        this.handle = {};
    }
    trigger(type, args=[]){
        if(this.handle[type]){
            return this.handle[type].map(func => typeof func === 'function' && func(...args));
        }
    }
}

/**
 * 图层分发器
 */
class MapLayerDispatch extends EventHandler {
    // 计算量匹配 #[....] 的内容，
    static computeRegx = /#\[.*?\]/g;

    static DEFAULT_LAYER = "DEFAULT_LAYER";
    static CUSTOM_LAYER = "CUSTOM_LAYER";

    /** 包裹下面的瓦片 模型 业务图层 */
    protected layers: Array<Array<WrapFolder>> = [];
    protected models: Array<WrapFolder>;
    protected recordLayers: Array<WrapFolder>;
    protected tileMaps: Array<WrapFolder>;

    private menuConfigMode: boolean = false;

    ///
    protected flatLayers: Array<any> = [];
    /// 各个业务实例的包裹对象
    protected instances: Array<CompInterfaceInstance> = [];
    /** config.json 文件等同的js对象 */
    protected mapConfig: MapLayerConfig;
    public map: ComMap;

    /** tip框的容器 */
    protected tipContainer: HTMLElement;
    private current: {
      vectorLayer: VectorLayer,
      featureLayer: FeatureLayer
    };

    constructor (map: ComMap) {
        super()
        this.map = map;
    }

    /**
     * 通过配置文件地址加载图层<br>
     * 对应public / static文件夹下的文件
     * @returns {Promise}
     */
    async loadConfigByLocalUrl (url) {
      const e = await fetch(url);
      const text = await e.text();
      const data = Function(`return ${text}`)(); //JSON.parse(text);
      this.init(data);
      return data;
    }

    clone<T> (obj:T) {
        return JSON.parse(JSON.stringify(obj)) as T;
    }

    /**
     * TODO 尚未实现
     */
    async loadConfigByRemoteUrl () {

    }

    /**  */
    init(data: MapLayerConfig) {
        this.mapConfig = this.clone(data);
        if(this.mapConfig.menuConfig) {
            this.menuConfigMode = true;

        } else {
            this
                ._initTipContainer()
                ._initTileMap(data)
                ._initModelLayers(data)
                ._initRecordLayers(data)
                .initEventBind();

            this.layers.push(this.tileMaps);
            this.layers.push(this.models);
            this.layers.push(this.recordLayers);
        }
    }

    private load3dTiles(foler: Folder, md:ModelDefine, option: any) {
      const om = md;
      const { headingPitchRoll } = md;
      const [x, y, z] = om.position;
      let modelMatrix;

      if(headingPitchRoll){
        const position = Cesium.Cartesian3.fromDegrees(x, y, z);
        const hpr = Cesium.HeadingPitchRoll.fromDegrees(headingPitchRoll[0], headingPitchRoll[1], headingPitchRoll[2]);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        modelMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
          position, orientation, new Cesium.Cartesian3(1,1,1,));
      } else {
        modelMatrix = Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(x, y, z)), new Cesium.Cartesian3(0.0, 0.0, 0.0), new Cesium.Matrix4());
      }

      const tileset = new Cesium.Cesium3DTileset({
        show: true,
        url: om.uri,
        shadows: Cesium.ShadowMode.DISABLED,
        maximumScreenSpaceError : 8,
        modelMatrix: modelMatrix
      });

      const czviewer = this.map.view3d.czviewer
      czviewer.scene.primitives.add(tileset);
      return new FakeLayer(foler, tileset, czviewer, option);
    }

    /** 初始化tip容器 */
    private _initTipContainer () {
        const root = this.map.containerElement
        const tipContainer = document.createElement("div");
        tipContainer.classList.add('zmap-tip-container');
        root.append(tipContainer);
        this.tipContainer = tipContainer

        return this;
    }

    /** 初始化瓦片图层 */
    private _initTileMap (data: MapLayerConfig) {
        const root = this.map.rootLayer;
        this.tileMaps = data.map.map(item => {
            const folder = CZMAPAPP.MapLoader.loadFolder(root, {
                type: "folder",
                name: item.name,
                children: [],
            });
            item.children.map(layer => {
                CZMAPAPP.MapLoader.loadLayer(folder, layer);
            })
            return {
              name: item.name,
              config: this.clone(item),
              folder: folder
            }
        })

        this.flatLayers = this.flatLayers.concat(this.tileMaps);
        return this;
    }

    /** 初始化模型图层 */
    private _initModelLayers (data: MapLayerConfig) {
        const root = this.map.rootLayer;
        this.models = data.models.map(item => {
            const folder = CZMAPAPP.MapLoader.loadFolder(root, {
              type: "folder",
              name: item.name,
              children: [],
            });
            item.children.map(model => {
              if(model.type === 'model') {
                const layer = this.load3dTiles(folder, model['define'], {name: model.name});
                folder['_children'].push(layer)
              } else {
                CZMAPAPP.MapLoader.loadLayer(folder, model);
              }
            })
            return {
              name: item.name,
              config: this.clone(item),
              folder: folder
            }
        })

        this.flatLayers = this.flatLayers.concat(this.models);
        return this;
    }

    /**
     * 初始化业务图层
     * @private
     */
    private _initRecordLayers (data: MapLayerConfig) {
        const root = this.map.rootLayer;
        this.recordLayers = [...data.layers, ...data.menus, ...data.labels].map(item => {
            const folder = CZMAPAPP.MapLoader.loadFolder(root, {
              type: "folder",
              name: item.name,
              children: [],
            });
            item.children.map(record => {
              const layer = CZMAPAPP.MapLoader.loadLayer(folder, record);
              // 初始化各类资源的实例
              const bind = (record?.ui?.bind || []) as Array<MapLayerMenuEnum>;
              bind.forEach(enumm => {
                const Clazz = CompInterfaceAopFactory.find(enumm);
                if(!Clazz) console.warn(`没有找到${enumm}组件的实现类`)
                Clazz && this.instances.push({
                  type: enumm,
                  config: this.clone(record),
                  layer,
                  instance: new Clazz(enumm)
                })
              });
            })
            return {
              name: item.name,
              config: this.clone(item),
              folder: folder
            }
        })

        this.flatLayers = this.flatLayers.concat(this.recordLayers)
        return this;
    }

    public addLineLayer (record) : Layer {
        const root = this.map.rootLayer;
        return CZMAPAPP.MapLoader.loadLayer(root, record);
    }

    public removeLayerByName (name: string) {
        const root = this.map.rootLayer;
        const children = root.children;
        children.filter(item => item.name === name).forEach(layer => root.removeLayer(layer));
    }

    public findByName (name: string) : Array<Layer>{
        const root = this.map.rootLayer;
        const children = root.children;
        return children.filter(item => item.name === name);
    }

    public removeLayerByLayer (layer: Layer) {
        const root = this.map.rootLayer;
        console.log(layer);
        root.removeLayer(layer);
    }

    /** 初始化事件绑定，主要是点击事件和鼠标移入移除事件 */
    private initEventBind () {
      const map = this.map;
      map.setOnClick(this.clickCall, this);
    //   map.enableTip = true;
    //   map.setOnTip(this.tipCall, this);
      return this;
    }

    /** 点击回调 */
    private clickCall (e: CZMAP.MapMouseEvent) {
      if(Object.keys(this._callPickData(e)).length == 0)return
      const {instances, pickedFeature, pickedLayer} = this._callPickData(e);
      instances.forEach((instance) => {
          const compInstance = instance.instance;
          if(compInstance) compInstance.click({e,args: [pickedFeature, pickedLayer, instance]});
      })
      this.trigger('click', [pickedFeature]);
    }

    /** tip回调 */
    private tipCall (e: CZMAP.MapMouseEvent) {
        this._removeAllTip();
        if(e.type === CZMAP.MapEventsType.MOUSE_OVER) { // 鼠标移入
            const {instances, pickedFeature, pickedLayer} = this._callPickData(e);

            // 没有匹配的图层或者自定义的图层
            if( instances.length === 0) {
                const type = MapLayerDispatch.CUSTOM_LAYER;
                const tip = pickedLayer.define?.hover?.tip || pickedLayer.define?.tip || pickedLayer.define?.style?.tip || null;
                this.renderTip(e, tip, type);
            } else {
                // 基于配置文件的图层
                instances.forEach((instance) => {
                    const compInstance = instance.instance;
                    const tip = pickedLayer.define?.hover?.tip || pickedLayer.define?.tip || pickedLayer.define?.style?.tip || null;
                    const hover = pickedLayer.define?.hover;
                    if (hover) {
                        this.current = {
                            vectorLayer: pickedLayer,
                            featureLayer: pickedFeature
                        };
                        pickedFeature.style.update(hover, undefined, undefined);
                    }
                    if ( 'custom' === tip && compInstance ) {
                        compInstance.hover({e : e, args : [pickedFeature, pickedLayer, instance], el: MapLayerDispatch.getTipWrapElement(instance.type)}, );
                    } else {
                        this.renderTip(e, tip, instance.type);
                    }
                })
            }
        }
    }

    // 渲染不同类型的tip
    private renderTip(e: CZMAP.MapMouseEvent, tip, type: String) {
        if (typeof tip === 'string') {
            this.renderTipString(e, tip, {
                recordType: type
            });
        } else if (typeof tip === 'object' && tip.render === 'table') {
            this.renderTipRichTable(e, tip, {
                recordType: type
            });
        } else if (Array.isArray(tip)) {
            this.renderTipArray(e, tip, {
                recordType: type
            });
        }
    }

    /** 渲染类型为string的tip */
    private renderTipString (e: CZMAP.MapMouseEvent, content: string, data: any = {}) {
        const { recordType } = data
        const el = this.getTipWrap(e, recordType);
        const featureLayer = e.object as FeatureLayer;
        const prop = featureLayer.properties;

        el.innerHTML = this.fmtParam(prop, content);
        this.tipContainer.append(el);
    }

    /** 渲染类型为rich table的tip */
    private renderTipRichTable (e: CZMAP.MapMouseEvent, table: RichTable, data: any = {}) {
        const { recordType } = data
        const featureLayer = e.object as FeatureLayer;
        const prop = featureLayer.properties;
        const el = this.getTipWrap(e, recordType, 'rich-table');
        const tableText  = this._renderTable(table.rows, prop, table.fieldMap);
        el.setAttribute('data-title', table.name);
        el.innerHTML = tableText;
        this.tipContainer.append(el);
    }

    /** 渲染类型为Array的tip */
    private renderTipArray (e: CZMAP.MapMouseEvent, table: Table, data: any = {}) {
        const { recordType } = data
        const featureLayer = e.object as FeatureLayer;
        const prop = featureLayer.properties;
        const el = this.getTipWrap(e, recordType, 'table');
        el.innerHTML = this._renderTable(table, prop);
        this.tipContainer.append(el);
    }

    /** 获取tip容器 */
    private getTipWrap (e: CZMAP.MapMouseEvent, recordType:string, renderType: string = 'string') {
        const el = MapLayerDispatch.getTipWrapElement(recordType, renderType);
        // 偏移5px,避免影响鼠标事件
        el.setAttribute("style", `left: ${e.x + 5}px; top: ${e.y + 5}px;`);
        return el;
    }

    private _renderTable (table: Table, prop: any, fieldMap: any = {}):string {
        return `
        <table>
            ${ table.map(tr => this._renderTableRow(tr, prop, fieldMap)).join('') }
        </table>
        `
    }

    private _renderTableRow (tr: TableRow, prop: any, fieldMap: any = {}):string {
        return `
        <tr>
            ${ tr.map(td => this._renderTableCell(td, prop, fieldMap)).join('') }
        </tr>
        `
    }

    private _renderTableCell (td: TableCell, prop: any, fieldMap: any = {}):string {
        return `
            <td colspan="${ td.cols || 1 }">${ this.fmtParam(prop, td.content, fieldMap) }</td>
        `
    }

  /**
   * 根据参数格式化字符串
   * @param params
   * @param fmt
   * @private
   */
    private fmtParam (params:Object, fmt:string, fieldMap: any = {}):string {

        const link = '__';
        const keys = Object.keys(fieldMap).map(key => {
            return key.split(link)[0];
        });

        // 替换属性匹配
        Object.keys(params).forEach(key => {
            const has = !!keys.find(tmp => tmp === key);
            fmt = fmt.replace(new RegExp(`\{${key}\}`, 'g'), (has ? key + link : '') + params[key]);
        });

        // 替换计算量
        const matched = fmt.match(MapLayerDispatch.computeRegx);
        Array.isArray(matched) && matched.forEach(match => {
            const val = match.substring(2,match.length-1);
            fmt = fmt.replace(match, eval(val));
        });

        // 替换映射表
        Object.keys(fieldMap).forEach(( key ) => {
            fmt = fmt.replace(key, fieldMap[key]);
        })
        return fmt;
    }

    /** 清除所有的tip框 */
    private _removeAllTip () {
        this.tipContainer.innerHTML = '';
        if(!this.current) return;
        const { vectorLayer,featureLayer } = this.current;
        if (vectorLayer) {
            const target = vectorLayer.define.style;
            featureLayer.style.update(target, undefined, undefined);
        }
    }

    /** 获取事件对象内有用的对象 */
    private _callPickData (e: CZMAP.MapMouseEvent) {
        const pickedFeature = e.object as CZMAP.FeatureLayer
        if(pickedFeature == undefined) return {}
        const pickedLayer = pickedFeature.parent;
        const instances =  this.instances.filter((instance) => {
          return instance.layer === pickedLayer;
        })
        return {instances, pickedFeature, pickedLayer}
    }

    /** 获取包裹tip内容的的元素 */
    private static getTipWrapElement (type: string, renderType: string = 'string'): HTMLElement {
      const wrap = document.createElement("div");
      wrap.classList.add("zmap-tip-wrap");
      wrap.setAttribute('data-type', type)
      wrap.setAttribute('data-render-type', renderType)
      return wrap;
    }

    protected circleQuery (circleInfo: CircleInfo, type: MapLayerMenuEnum) {
        return MapLayerQuery.circleQuery(circleInfo, this.recordLayers ,type);
    }

    protected addLayer(record) {
        const root = this.map.rootLayer;
        const newLayer = CZMAPAPP.MapLoader.loadLayer(root, record);
        // newLayer.flyTo({ duration: 1 });
        return newLayer;
    }

}

/**
 * 图层控制工具<br>
 * UI和底层的衔接类
 */
class MapLayerControls extends MapLayerDispatch {
    private option: MapLayerControlsOptions;
    private treeData: Array<any>;
    private animationLayerManager: AnimationLayerManager;

    constructor (map: ComMap, option: MapLayerControlsOptions = {}) {
        super(map);
        this.animationLayerManager  = new AnimationLayerManager(map);
        // 整个地图环境的整体配置文件
        // const clone = JSON.parse(JSON.stringify(config)) as MapLayerConfig;
        // const convertConfig = this.convertConfig(clone);
        // this.originConfig = Object.freeze(convertConfig);
        this.option = option;

        // load debug
        new MapLayerDebuggerControls(map);
    }

    private convertConfig (config: MapLayerConfig) {

        return config;
    }

    private getIconDefault() {
        return [
            {
                icon: 'icon-jiaoyi_biyan',
                title: '显示/隐藏',
                clickIcon: 'icon-zhengyanjing',
                canActive: true,
                key: 0,
                active: true,
                show: true
            },
            {
                icon: 'icon-upon',
                title: '上移',
                clickIcon: '',
                key: 1,
                show: true
            },
            {
                icon: 'icon-shangyi',
                title: '下移',
                clickIcon: '',
                key: 2,
                show: true
            },
            {
                icon: 'icon-suo',
                title: '锁住/解锁',
                clickIcon: 'icon-suo1',
                canActive: true,
                key: 3,
                show: true
            },
            {
                icon: 'icon-chuyidong',
                title: '删除图层',
                clickIcon: '',
                key: 9,
                show: true
            }
        ]
    }

    private initIconStatus(define) {
        if(define.iconList) {
            const find = define.iconList.find(icon => icon.key === 0)
            if(find) {
                find.active = true;
            }
        } else {
            define.iconList = this.getIconDefault();
        }
        define.iconList.forEach(icon => icon.active = !!icon.active);
    }

    findLayerByKey(key: string) {
        const keys = key.split('-');
        const set = this.layers[keys[0]] as Array<WrapFolder>;
        const layer = set[keys[1]].folder.children[keys[2]] as CZMAP.Layer;

        return layer;
    }

    public runAnimationLayer(key: string) {
        const find = this.findLayerByKey(key);
        if(find) {
            const { layerList, interval } = find.define.useAnimate;
            this.animationLayerManager.createAnimationLayer(this.clone(layerList), { interval }, key);
        }
    }

    public stopAnimationLayer(key: string) {
        const find = this.findLayerByKey(key);
        if(find) {
            this.animationLayerManager.destroyAnimationLayer(key);
        }
    }

    /**
     * 获取结构树
     */
    public getTreeData() {
        console.warn('cscs',this.layers);
        
        if (this.treeData) {
            return this.treeData;
        }
        const data = [
            {key: 0, label: "基础地理", icon: "icon-ditu_diqiu", children: []},
            {key: 1, label: "三维模型", icon: "icon-jiankong", children: []},
            {key: 2, label: "业务信息", icon: "icon-yewumoxing", children: []},
        ];

        this.layers.map((folderArray, i) => {
            const child = data[i].children
            folderArray.map((wrapFolder, parentIndex) => {
                wrapFolder.folder.children.forEach((layer, index) => {
                    const define = this.clone(layer.define);
                    this.initIconStatus(define);
                    child.push({
                        key: `${i}-${parentIndex}-${index}`,
                        label: layer.name,
                        name: layer.name,
                        nickname: layer.name,
                        hide: !layer.visible,
                        secondActive: !!layer.visible,
                        lock: false,
                        ...define
                    })
                })
            });
        });

        this.treeData = data;

        return data;
    }

    public getFlatLayerInfo() {
        let target = [];
        const data = this.getTreeData();
        data.forEach(item => {
            target = target.concat(item.children);
        })

        return target
    }

    /**
     * 根据name设置子图层可见性
     * @param key 从getTreeData方法获取的key
     * @param visible 图层可见性
     */
    public setSubLayerVisibleByName (name: string, visible: boolean) {
        let target = this.findSubLayerByName(name);
        return this.setLayerVisible(target, !!visible);
    }

    public findSubLayerByName (name:string) {
        let target;
        this.layers.forEach((wrapFolders) => {
            wrapFolders.forEach(wrapFolder => {
              wrapFolder.folder.children.forEach(layer => {
                if (layer instanceof VectorLayer) {
                  const prop = layer.define as any;
                  const bind = prop?.ui?.bind || [];
                  if(bind.indexOf(name) > -1) target = layer;
                }
              })
            })
        })
        return target;
    }

  /**
   * 根据资源类型和id定位FeatureLayer
   * @param id
   * @param type
   * @param key 键值，默认为id
   */
    public zoomToFeatureLayerByIdAndType (id: PropertyKey, type: string, key: string = 'id') {
        const vectorLayer = this.findSubLayerByName(type);
        if (vectorLayer && vectorLayer.children) {
            const layers = vectorLayer.children as Array<FeatureLayer>;
                layers.forEach(layer => {
                const prop = layer.properties as any;
                if(prop[key] === id) layer.flyTo({duration: 1});
            })
        }
    }

    /**
     * 根据key设置子图层可见性
     * @param key 从getTreeData方法获取的key
     * @param visible 图层可见性
     */
    public setSubLayerVisibleByKey (key: string, visible: boolean) {
        const keys = key.split('-');
        const set = this.layers[keys[0]] as Array<WrapFolder>;
        const layer = set[keys[1]].folder.children[keys[2]] as CZMAP.Layer;
        return this.setLayerVisible(layer, !!visible);
    }

    /**
     * 设置父图层可见性
     * @param key parent key
     * @param visible 图层可见性
     */
    public setParentLayerVisibleByKey (key: string, visible: boolean) {
        const set = this.layers[key] as Array<WrapFolder>;
        set.forEach(wrapLayer => {
            wrapLayer.folder.visible = !!visible;
        })

        return true;
    }

    private setLayerVisible (layer: Layer, visible: boolean, autoZoom: boolean = true) {
        if(!layer) return;
        layer.visible = visible;
        autoZoom && requestAnimationFrame(() => {
            const locate = layer.define.locate
            layer.visible && layer.flyTo(Object.assign({
              "distanceScale": 1,
              "duration": 1,
            }, locate));
        });
    }
}

export default MapLayerControls;
