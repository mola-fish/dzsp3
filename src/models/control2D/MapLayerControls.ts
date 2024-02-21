import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import CompInterface from "../interface/CompInterface";

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
        // layers.forEach(wrapFolder => {
        //     this.filterFeatureLayers(wrapFolder.folder.children, type).forEach(layer => {
        //         const features = layer.children.filter(featureLayer => {
        //             const feature = featureLayer as FeatureLayer;
        //             const geo = feature.geometry as GeoPoint;
        //             if(!geo.x || !geo.y) return false;
        //             return Cesium.Cartesian3.distance(center, Cesium.Cartesian3.fromDegrees(Number(geo.x), Number(geo.y), Number(geo.z) || 0)) < radius;
        //         })
        //         if (features.length > 0) {
        //             result.push({
        //                 layer,
        //                 features,
        //             })
        //         }
        //     });
        // });

        return result;
    }

    // static filterFeatureLayers (features: Array<Layer>, type: MapLayerMenuEnum) {
    //     if(!type) return features
    //
    //     return features.filter(feature => {
    //         const fea = feature as FeatureLayer;
    //         const prop = fea.define as any;
    //         const bind = prop?.ui?.bind || [];
    //         return bind.some(item => item === type);
    //     })
    // }
}
/**
 * 图层分发器
 */
class MapLayerDispatch {
    // 计算量匹配 #[....] 的内容，
    static computeRegx = /#\[.*?\]/g;

    static DEFAULT_LAYER = "DEFAULT_LAYER";
    static CUSTOM_LAYER = "CUSTOM_LAYER";

    /** 包裹下面的瓦片 模型 业务图层 */
    protected layers: Array<Array<WrapFolder>> = [];
    protected models: Array<WrapFolder>;
    protected recordLayers: Array<WrapFolder>;
    protected tileMaps: Array<WrapFolder>;

    static regexPlacer = /(\{[a-zA-z]+\})/;
    static regexYears = /(\{yyyy\})/;
    static regexMonths = /(\{M+\})/;
    static regexDate = /(\{d+\})/;
    static regexHours = /(\{[Hh]+\})/;
    static regexMinutes = /(\{m+\})/;
    static regexSeconds = /(\{s+\})/;
    static regexMilliseconds = /(\{S+\})/;

    static uRegexYears = /(\{uyyyy\})/;
    static uRegexMonths = /(\{uM+\})/;
    static uRegexDate = /(\{ud+\})/;
    static uRegexHours = /(\{u[Hh]+\})/;
    static uRegexMinutes = /(\{um+\})/;
    static uRegexSeconds = /(\{us+\})/;
    static uRegexMilliseconds = /(\{uS+\})/;

    static fmtDate(time:Date, fmt:string) : string {
        const regex = CompResource.regexPlacer;
        if (!regex.test(fmt)) return fmt;
        const diff = 8 * 3600 * 1000;
        let utime = new Date(time.getTime() - diff);

        ///
        const fields = [
            {regex: CompResource.regexYears, value: time.getFullYear() },
            {regex: CompResource.regexMonths, value: time.getMonth()+1 },
            {regex: CompResource.regexDate, value: time.getDate() },
            {regex: CompResource.regexHours, value: time.getHours() },
            {regex: CompResource.regexMinutes, value: time.getMinutes() },
            {regex: CompResource.regexSeconds, value: time.getSeconds() },
            {regex: CompResource.regexMilliseconds, value: time.getMilliseconds() },

            {regex: CompResource.uRegexYears, value: utime.getFullYear() },
            {regex: CompResource.uRegexMonths, value: utime.getMonth()+1 },
            {regex: CompResource.uRegexDate, value: utime.getDate() },
            {regex: CompResource.uRegexHours, value: utime.getHours() },
            {regex: CompResource.uRegexMinutes, value: utime.getMinutes() },
            {regex: CompResource.uRegexSeconds, value: utime.getSeconds() },
            {regex: CompResource.uRegexMilliseconds, value: utime.getMilliseconds() },
        ]

        ////
        fields.forEach(m => {
            while (m.regex.test(fmt))
            {
                const mt = RegExp.$1;
                let vt = m.value.toString();
                if (vt.length < mt.length - 2)
                {
                    const isUTC = mt.startsWith("{u");
                    vt = "000000".substr(0, mt.length - (isUTC ? 3 : 2) - vt.length) + vt;
                }

                fmt = fmt.replace(mt, vt);
            }
        });

        ///
        return fmt;
    }

    ///
    protected flatLayers: Array<CompMapLayer> = [];
    /// 各个业务实例的包裹对象
    protected instances: Array<CompInterfaceInstance> = [];
    /** config.json 文件等同的js对象 */
    protected mapConfig: MapLayerConfig;
    public map: CompMapView;

    /** tip框的容器 */
    protected tipContainer: HTMLElement;
    private current: {
      // vectorLayer: VectorLayer,
      // featureLayer: FeatureLayer
    };

    constructor (map: CompMapView) {
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
        this
          ._initTipContainer()
          ._initLayers(data)
    }

    /** 初始化tip容器 */
    private _initTipContainer () {
        // TODO 完成此方法
        // const root = this.map
        // const tipContainer = document.createElement("div");
        // tipContainer.classList.add('zmap-tip-container');
        // root.append(tipContainer);
        // this.tipContainer = tipContainer

        return this;
    }

    protected preCreateLayer(ld) {
        ld.url = MapLayerDispatch.fmtDate(new Date(), ld.url);
        return ld;
    }

    private _initLayers(data: MapLayerConfig) {
        const mapView = this.map;
        this.flatLayers = data.layers.map(ld => {
            this.preCreateLayer(ld);
            // @ts-ignore
            const layer = mapView.createLayer(ld);
            layer.setTime(new Date());
            return layer;
        });

        return this;
    }

    /** 点击回调 */
    private clickCall (e: CZMAP.MapMouseEvent) {
      const {instances, pickedFeature, pickedLayer} = this._callPickData(e);
      instances.forEach((instance) => {
          const compInstance = instance.instance;
          if(compInstance) compInstance.click({e,args: [pickedFeature, pickedLayer, instance]});
      })
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
        const featureLayer = e.object;
        const prop = featureLayer.properties;

        el.innerHTML = this.fmtParam(prop, content);
        this.tipContainer.append(el);
    }

    /** 渲染类型为rich table的tip */
    private renderTipRichTable (e: CZMAP.MapMouseEvent, table: RichTable, data: any = {}) {
        const { recordType } = data
        const featureLayer = e.object;
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
        const featureLayer = e.object;
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
        // this.tipContainer.innerHTML = '';
        // if(!this.current) return;
        // const { vectorLayer,featureLayer } = this.current;
        // if (vectorLayer) {
        //     const target = vectorLayer.define.style;
        //     featureLayer.style.update(target, undefined, undefined);
        // }
    }

    /** 获取事件对象内有用的对象 */
    private _callPickData (e: CZMAP.MapMouseEvent) {
        const pickedFeature = e.object as CZMAP.FeatureLayer
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

}

/**
 * 图层控制工具<br>
 * UI和底层的衔接类
 */
class MapLayerControls extends MapLayerDispatch {
    private option: MapLayerControlsOptions;

    constructor (map: CompMapView, option: MapLayerControlsOptions = {}) {
        super(map);
        this.option = option;
    }

    private convertConfig (config: MapLayerConfig) {
        return config;
    }

    /**
     * 获取结构树
     */
    public getTreeData () {
        // TODO 完成此方法
        const data = [];
        return data;
    }

    /**
     * 根据名称显示子图层
     * @param name
     */
    public showSubLayerByName(name: string) {
        this.setSubLayerVisibleByName(name, true);
    }

    /**
     * 根据名称隐藏子图层
     * @param name
     */
    public hideSubLayerByName(name: string) {
        this.setSubLayerVisibleByName(name, false);
    }

    public removeLayer(name) {
        const layer = this.findSubLayerByName(name);
        this.removeFromFlatLayers(layer);
        this.map.removeLayer(layer);
    }

    private removeFromFlatLayers(layer: CompMapLayer) {
        const findIndex = this.flatLayers.findIndex(item => item === layer);
        if(findIndex !== -1) {
            this.flatLayers.splice(findIndex, 1);
        }
    }

    public addLayer(layerDefine) {
        this.preCreateLayer(layerDefine);
        const layer = this.map.createLayer(layerDefine);
        layer.setTime(new Date());
        this.flatLayers.push(layer);
        return layer;
    }

    /**
     * 根据name设置子图层可见性
     * @param name
     * @param visible 图层可见性
     */
    public setSubLayerVisibleByName (name: string, visible: boolean) {
        let target = this.findSubLayerByName(name);
        return MapLayerControls.setLayerVisible(target, !!visible);
    }

    /**
     * 根据名称找到子图层*
     * @param name
     */
    public findSubLayerByName (name:string): CompMapLayer {
        return this.flatLayers.find(layer => layer.name === name);
    }

  /**
   * 根据资源类型和id定位FeatureLayer
   * @param id
   * @param type
   * @param key 键值，默认为id
   */
    public zoomToFeatureLayerByIdAndType (id: PropertyKey, type: string, key: string = 'id') {
        // const vectorLayer = this.findSubLayerByName(type);
        // if (vectorLayer && vectorLayer.children) {
        //     const layers = vectorLayer.children as Array<FeatureLayer>;
        //         layers.forEach(layer => {
        //         const prop = layer.properties as any;
        //         if(prop[key] === id) layer.flyTo({duration: 1});
        //     })
        // }
    }

    /**
     * 根据key设置子图层可见性
     * @param key 从getTreeData方法获取的key
     * @param visible 图层可见性
     */
    public setSubLayerVisibleByKey (key: string, visible: boolean) {
        // const keys = key.split('-');
        // const set = this.layers[keys[0]] as Array<WrapFolder>;
        // const layer = set[keys[1]].folder.children[keys[2]] as CZMAP.Layer;
        // return this.setLayerVisible(layer, !!visible);
    }

    /**
     * 设置父图层可见性
     * @param key parent key
     * @param visible 图层可见性
     */
    public setParentLayerVisibleByKey (key: string, visible: boolean) {
        // const set = this.layers[key] as Array<WrapFolder>;
        // set.forEach(wrapLayer => {
        //     wrapLayer.folder.visible = !!visible;
        // })
        //
        // return true;
    }

    private static setLayerVisible (layer: CompMapLayer, visible: boolean, autoZoom: boolean = true) {
        if(!layer) return;
        layer.setVisible(visible);
        // TODO 实现自动定位
    }
}

export default MapLayerControls;
