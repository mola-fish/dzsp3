import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import CompInterface from "../interface/CompInterface";
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
/**
 * 图层分发器
 */
declare class MapLayerDispatch {
    static computeRegx: RegExp;
    static DEFAULT_LAYER: string;
    static CUSTOM_LAYER: string;
    /** 包裹下面的瓦片 模型 业务图层 */
    protected layers: Array<Array<WrapFolder>>;
    protected models: Array<WrapFolder>;
    protected recordLayers: Array<WrapFolder>;
    protected tileMaps: Array<WrapFolder>;
    static regexPlacer: RegExp;
    static regexYears: RegExp;
    static regexMonths: RegExp;
    static regexDate: RegExp;
    static regexHours: RegExp;
    static regexMinutes: RegExp;
    static regexSeconds: RegExp;
    static regexMilliseconds: RegExp;
    static uRegexYears: RegExp;
    static uRegexMonths: RegExp;
    static uRegexDate: RegExp;
    static uRegexHours: RegExp;
    static uRegexMinutes: RegExp;
    static uRegexSeconds: RegExp;
    static uRegexMilliseconds: RegExp;
    static fmtDate(time: Date, fmt: string): string;
    protected flatLayers: Array<CompMapLayer>;
    protected instances: Array<CompInterfaceInstance>;
    /** config.json 文件等同的js对象 */
    protected mapConfig: MapLayerConfig;
    map: CompMapView;
    /** tip框的容器 */
    protected tipContainer: HTMLElement;
    private current;
    constructor(map: CompMapView);
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
    /** 初始化tip容器 */
    private _initTipContainer;
    protected preCreateLayer(ld: any): any;
    private _initLayers;
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
}
/**
 * 图层控制工具<br>
 * UI和底层的衔接类
 */
declare class MapLayerControls extends MapLayerDispatch {
    private option;
    constructor(map: CompMapView, option?: MapLayerControlsOptions);
    private convertConfig;
    /**
     * 获取结构树
     */
    getTreeData(): any[];
    /**
     * 根据名称显示子图层
     * @param name
     */
    showSubLayerByName(name: string): void;
    /**
     * 根据名称隐藏子图层
     * @param name
     */
    hideSubLayerByName(name: string): void;
    removeLayer(name: any): void;
    private removeFromFlatLayers;
    addLayer(layerDefine: any): CompMapLayer;
    /**
     * 根据name设置子图层可见性
     * @param name
     * @param visible 图层可见性
     */
    setSubLayerVisibleByName(name: string, visible: boolean): void;
    /**
     * 根据名称找到子图层*
     * @param name
     */
    findSubLayerByName(name: string): CompMapLayer;
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
    setParentLayerVisibleByKey(key: string, visible: boolean): void;
    private static setLayerVisible;
}
export default MapLayerControls;
