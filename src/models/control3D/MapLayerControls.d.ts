import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import CompInterface from "../interface/CompInterface";
import ComMap = CZMAP.ComMap;
import Layer = CZMAP.Layer;
/**
 * 图层控制工具参数
 */
type MapLayerControlsOptions = {};
/**
 * @see 地图环境的配置文件
 */
type MapLayerConfig = MapConfigRoot;
/**
 * 各类资源的实例
 */
export type CompInterfaceInstance = {
    type: MapLayerMenuEnum;
    instance: CompInterface;
    config: MapConfigChildren_2;
    layer: CZMAP.Layer;
};
type CircleInfo = {
    center: Cesium.Cartesian3;
    radius: number;
};
/** 包裹后的文件夹类型， */
interface WrapFolder {
    name: string;
    config: any;
    folder: CZMAP.Folder;
}
declare class EventHandler {
    private handle;
    private eventType;
    constructor(eventType: any);
    on(type: any, call: any): void;
    off(type: any, func: any): boolean;
    offAll(): void;
    trigger(type: any, args?: any[]): any;
}
/**
 * 图层分发器
 */
declare class MapLayerDispatch extends EventHandler {
    static computeRegx: RegExp;
    static DEFAULT_LAYER: string;
    static CUSTOM_LAYER: string;
    /** 包裹下面的瓦片 模型 业务图层 */
    protected layers: Array<Array<WrapFolder>>;
    protected models: Array<WrapFolder>;
    protected recordLayers: Array<WrapFolder>;
    protected tileMaps: Array<WrapFolder>;
    private menuConfigMode;
    protected flatLayers: Array<any>;
    protected instances: Array<CompInterfaceInstance>;
    /** config.json 文件等同的js对象 */
    protected mapConfig: MapLayerConfig;
    map: ComMap;
    /** tip框的容器 */
    protected tipContainer: HTMLElement;
    private current;
    constructor(map: ComMap);
    /**
     * 通过配置文件地址加载图层<br>
     * 对应public / static文件夹下的文件
     * @returns {Promise}
     */
    loadConfigByLocalUrl(url: any): Promise<any>;
    clone<T>(obj: T): T;
    /**
     * TODO 尚未实现
     */
    loadConfigByRemoteUrl(): Promise<void>;
    /**  */
    init(data: MapLayerConfig): void;
    private load3dTiles;
    /** 初始化tip容器 */
    private _initTipContainer;
    /** 初始化瓦片图层 */
    private _initTileMap;
    /** 初始化模型图层 */
    private _initModelLayers;
    /**
     * 初始化业务图层
     * @private
     */
    private _initRecordLayers;
    addLineLayer(record: any): Layer;
    removeLayerByName(name: string): void;
    findByName(name: string): Array<Layer>;
    removeLayerByLayer(layer: Layer): void;
    /** 初始化事件绑定，主要是点击事件和鼠标移入移除事件 */
    private initEventBind;
    /** 点击回调 */
    private clickCall;
    /** tip回调 */
    private tipCall;
    private renderTip;
    /** 渲染类型为string的tip */
    private renderTipString;
    /** 渲染类型为rich table的tip */
    private renderTipRichTable;
    /** 渲染类型为Array的tip */
    private renderTipArray;
    /** 获取tip容器 */
    private getTipWrap;
    private _renderTable;
    private _renderTableRow;
    private _renderTableCell;
    /**
     * 根据参数格式化字符串
     * @param params
     * @param fmt
     * @private
     */
    private fmtParam;
    /** 清除所有的tip框 */
    private _removeAllTip;
    /** 获取事件对象内有用的对象 */
    private _callPickData;
    /** 获取包裹tip内容的的元素 */
    private static getTipWrapElement;
    protected circleQuery(circleInfo: CircleInfo, type: MapLayerMenuEnum): any[];
    protected addLayer(record: any): Layer;
}
/**
 * 图层控制工具<br>
 * UI和底层的衔接类
 */
declare class MapLayerControls extends MapLayerDispatch {
    private option;
    private treeData;
    private animationLayerManager;
    constructor(map: ComMap, option?: MapLayerControlsOptions);
    private convertConfig;
    private getIconDefault;
    private initIconStatus;
    findLayerByKey(key: string): Layer;
    runAnimationLayer(key: string): void;
    stopAnimationLayer(key: string): void;
    /**
     * 获取结构树
     */
    getTreeData(): any[];
    getFlatLayerInfo(): any[];
    /**
     * 根据name设置子图层可见性
     * @param key 从getTreeData方法获取的key
     * @param visible 图层可见性
     */
    setSubLayerVisibleByName(name: string, visible: boolean): void;
    findSubLayerByName(name: string): any;
    /**
     * 根据资源类型和id定位FeatureLayer
     * @param id
     * @param type
     * @param key 键值，默认为id
     */
    zoomToFeatureLayerByIdAndType(id: PropertyKey, type: string, key?: string): void;
    /**
     * 根据key设置子图层可见性
     * @param key 从getTreeData方法获取的key
     * @param visible 图层可见性
     */
    setSubLayerVisibleByKey(key: string, visible: boolean): void;
    /**
     * 设置父图层可见性
     * @param key parent key
     * @param visible 图层可见性
     */
    setParentLayerVisibleByKey(key: string, visible: boolean): boolean;
    private setLayerVisible;
}
export default MapLayerControls;
