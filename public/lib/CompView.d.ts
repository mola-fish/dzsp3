declare class ColorTool {
    static rgbaMatcher: RegExp;
    static rrggbbaaMatcher: RegExp;
    static rgbParenthesesMatcher: RegExp;
    static hslParenthesesMatcher: RegExp;
    static Colors: {
        RED: number[];
        GREEN: number[];
        BLUE: number[];
        WHITE: number[];
        BLACK: number[];
    };
    static parseCssColorString(color: string): number[];
    static toPiecewiseColors(colors: CompColors): {
        color: string;
        name: string;
        min: number;
        max: number;
    }[];
}
declare namespace Comp {
    /**
     * A reusable function, used e.g. as a default for callbacks.
     *
     * @return {void} Nothing.
     */
    function VOID(): void;
    /**
     * 事件的回调函数
     */
    type EventListener = (event: Event) => boolean | void;
    /**
     * 监听对象
     */
    class ListenerObject {
        /**
         * 事件目标
         */
        target: EventTarget;
        /**
         * 事件类型
         */
        type: string;
        /**
         * 事件响应函数
         */
        listener: EventListener;
        /**
         * 绑定对象
         */
        bindto: Object;
        /**
         * 构造函数
         */
        constructor(target: EventTarget, type: string, listener: EventListener, bindto: object);
    }
    /**
     * 事件对象
     *
     */
    class EventTarget {
        /**
         * 待移除的事件
         * @private
         */
        private _removing;
        /**
         * 正在派发的事件
         * @private
         */
        private _dispatching;
        /**
         * 事件监听表（回调函数）
         * @private
         */
        private _listeners;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 获取指定事件类型的监听对象列表
         *
         * @param {string} type 事件类型
         * @return {Array<function>} 监听对象列表
         */
        getListeners(type: string): ListenerObject[];
        /**
         * 是否有指定类型的事件监听器
         *
         * @param {string=} type 事件类型，可以不指定
         * @return {boolean}
         */
        hasListener(type: string): boolean;
        /**
         * 添加事件监听器
         * @param {string} type 事件类型
         * @param {function} listener 事件监听器（回调函数）
         * @param {*} opt_this 可选的this对象
         * @return 返回唯一的监听对象
         */
        addEventListener(type: string, listener: EventListener, opt_this?: object): ListenerObject;
        /**
         * 派发事件
         *
         * 事件参数可以是字符串或者包含type属性的对象
         *
         * @param {{type: string}|Event|string} event 事件对象.
         * @api
         */
        dispatchEvent(event: string | Event): boolean;
        /**
         * 移除指定的事件监听器
         * @param {string} type 类型
         * @param {function} listener 监听器（函数）
         */
        removeEventListener(type: string, listener: EventListener, opt_this?: object): void;
        /**
         * 查找事件监听对象
         * @param {*} listener
         * @param {*} opt_this
         */
        findListener(list: ListenerObject[], listener: EventListener, opt_this?: object): number;
        /**
         * 移除所有事件监听
         */
        removeAllEventListener(): void;
        /**
         * @inheritDoc
         * @override
         */
        protected _disposeInternal(): void;
    }
}
declare namespace Comp {
    /**
     * 事件
     *
     */
    class Event {
        /**
         * 停止事件转发
         */
        propagationStopped: boolean;
        /**
         * 事件类型
         * @api
         */
        type: string;
        /**
         * 事件的目标
         * @api
         */
        target: EventTarget;
        /**
         * @param {string} type 类型.
         */
        constructor(type: string);
        /**
         * 停止事件传递
         * @api
         */
        preventDefault(): void;
        /**
         * 停止事件传递
         * @api
         */
        stopPropagation(): void;
    }
}
declare namespace Comp {
    type GenericsListenerObject<T extends string | string[]> = T extends string ? ListenerObject : ListenerObject[];
    /**
     * @classdesc
     *
     * @fires
     * @api
     */
    class Observable extends EventTarget {
        /**
         * @private
         */
        private _revision;
        /**
         * ‘改变’事件
         */
        static CHANGE: string;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 增加版本号并派发 'change' 事件
         * @api
         */
        protected changed(): void;
        /**
         * 获取当前对象的版本号，当对象修改后将版本号将增加
         * @return {number} Revision.
         * @api
         */
        getRevision(): number;
        /**
         * 监听指定类型的事件
         * @param {string|Array<string>} type 事件类型或者类型数组
         * @param {function(?): ?} listener 监听函数
         * @param {*} opt_this 可选的this对象
         * @return {} 当前监听键（Key），如果第一个参数是数组，则返回数组
         * @api
         */
        on(type: string | string[], listener: EventListener, opt_this?: object): ListenerObject | ListenerObject[];
        /**
         * 取消监听指定类型的事件
         * @param {string|Array<string>} type 事件类型或者类型数组
         * @param {function(?): ?} listener 监听函数
         * @api
         */
        un(type: string | string[], listener: EventListener, opt_this?: object): void;
        /**
         * 通过指定的key取消监听
         * @param {Object} key 函数`on()`的返回值
         */
        static unByKey(key: ListenerObject): void;
    }
}
interface AnyObject {
    [propertys: string]: any;
}
/** 绘制对象 */
declare abstract class CompDataRender extends Comp.Observable {
    protected _view: CompMapView;
    protected _declare: CompResourceRender;
    private _version;
    private _visible;
    private _properties;
    private _renderStatus;
    /** 构造函数 */
    constructor(view: CompMapView, decl: CompResourceRender);
    /** 获取图层对象 */
    abstract get layer(): CompMapLayer;
    /** 获取图层的工厂 */
    abstract get factory(): CompRenderFactory;
    /** 获取绘制器的类型 */
    get renderName(): string;
    /** 支持的数据类型列表 */
    get dataTypes(): CompResourceDataType[];
    /** 获取OLMap对象 */
    get olMap(): any;
    /** 获取OL图层对象 */
    abstract get olLayer(): any;
    /** 获取色表 */
    get colors(): CompColors;
    /** 绘制状态 */
    get renderStatus(): CompMapLayerRenderStatus;
    set properties(prop: any);
    get properties(): any;
    /** 获取额外属性的值 */
    $get(key: any): any;
    /** 设置额外属性的值 */
    $set(key: any, value: any): void;
    /** 设置可见 */
    setVisible(visible: boolean): void;
    /** 是否可见 */
    isVisible(): boolean;
    /** 是否实际可见，包含最大最小比例尺设置 */
    isRealVisible(): boolean;
    private _updateHandle;
    /** 更新 */
    update(): void;
    /** 立即更新 */
    abstract updateImm(): void;
    /** 清空 */
    abstract clear(): any;
    /** 销毁对象 */
    abstract destroy(): void;
    /** 查询可tip对象 */
    queryTip(x: number, y: number, to?: number): CompTipValue;
    /** 查询可见对象 */
    queryDisplay(x: number, y: number): any;
    /** 触发绘制事件 */
    protected _fireRenderStatus(status: CompMapLayerRenderStatus): void;
    /**
     * 根据数值获取颜色
     * @param value
     */
    protected getColor(value: number): string;
}
/**
 * 基础类型和结构定义
 */
/**
 * 色表定义
 */
interface CompColors {
    id: string;
    name: string;
    unit: string;
    minV?: number;
    maxV?: number;
    list: {
        name: string;
        minV: number;
        maxV: number;
        color: string;
        sort: number;
        opacity: number;
    }[];
}
/** 回调函数参数 */
declare type PropertyCallbackOption = {
    view: CompMapView;
    layer: CompMapLayer;
    values: any[];
};
/**
 * 条件对象
 * 当case表达式为true时，使用该对象
 * 支持占位符
 *  {f0} {f1} ... {fn} 表示对应的值
 *  {level} 表示当前地图显示等级
 */
interface PropertyValueCase<T> {
    /**
     * 条件表达式
     * 如 {1} > 10
     */
    case: string;
    /** 值 */
    value: T;
}
/** 回调函数 */
declare type PropertyValueCallback<T> = (option: PropertyCallbackOption) => T;
declare type PropertyValueObject<T> = {
    /** 类型 */
    type?: 'value' | 'switch-case' | 'callback';
    /** 值 */
    value?: T;
    /** 条件列表 */
    caselist?: PropertyValueCase<T>[];
    /** 回调函数 */
    callback?: PropertyValueCallback<T>;
};
declare type PropertyValueType<T> = T | PropertyValueCase<T>[] | PropertyValueCallback<T> | PropertyValueObject<T>;
/**
 * 资源渲染对象
 */
interface CompResourceRender {
    /** 渲染器类型 */
    type: string;
    /** 是否显示 */
    visible: boolean;
    /** 渲染级别 */
    level?: [number, number];
    /** 额外属性参数 */
    properties?: any;
}
/**
 * 瓦片地图
 */
interface TileMapRender {
    /** 渲染器类型 */
    type: 'tile';
}
interface EchartsRenderSeries {
    type: 'scatter' | 'map';
    /**
     * 名称字段
     */
    nameField: string;
    /**
     * 属性字段
     * 如果是散点图，前两个字段，分别为：x、y坐标
     */
    valueFields: (string | number)[];
    /**
     * 地图数据，用于色斑图的地图数据，GeoJSON格式
     * @example 'http://..../china.json'
     */
    mapData?: string;
    /**
     * 每个数据项的构建回调函数
     */
    itemStyleFunction?: (data: any, fields?: string[]) => any;
}
/**
 * Echarts 渲染器
 */
interface EchartsRender extends CompResourceRender {
    /** 类型 */
    type: 'echarts';
    /** 对应系列的字段名称 */
    series: EchartsRenderSeries[];
    /**
     * 地图数据，用于散点图等全局的地图数据
     * @example 'http://..../china.json'
     */
    mapData?: string;
    /** 数据过滤器 */
    filter?: (value: number[]) => boolean;
    /** 额外的echarts的选项 */
    option?: any;
}
/**
 * 矢量渲染器
 */
interface VectorRender extends CompResourceRender {
    /** 类型 */
    type: 'vector';
    /** 样式 */
    style: any;
}
interface PointsRender extends CompResourceRender {
    /** 用于数据的字段列表 */
    fields?: (number | string)[];
    /** 坐标字段索的引 */
    fieldX?: number;
    fieldY?: number;
}
/**
 * 矢量渲染器
 */
interface LargePointsRender extends PointsRender {
    /** 类型 */
    type: 'largePoints';
    /** 样式 */
    style: OLE.PointStyle | OLE.PointStyleFunction;
}
/**
 * 台风渲染器
 */
interface TyphoonRender extends PointsRender {
    /** 类型 */
    type: 'typhoon';
    /** ID字段 */
    fieldId: number | string;
    /** 名称（代号）字段 */
    fieldName: number | string;
    /** 时间字段 */
    fieldDate: number | string;
    /** 风速字段 */
    fieldWindSpeed: number | string;
    /** 预报字段 */
    fieldForecast: number | string;
    /** 风圈半径字段 */
    fieldRadii: {
        radius7: number | string;
        radius10: number | string;
        radius12: number | string;
    };
    /** 台风图标 */
    icon?: string;
    /** 动画间隔毫秒，默认值50 */
    interval?: number;
    /** 插值间距，默认是10000 */
    interpDistance?: number;
    /** 允许默认点击事件 */
    enableClick?: boolean;
    /** 标注样式 */
    labelStyle?: OLE.TyphoonTextStyle;
    /** 预报圈样式 */
    forecastStyle?: OLE.TyphoonAreaStyle;
}
interface ScatterRenderLabelStroke {
    width?: number;
    color?: string;
}
interface ScatterRenderLabelBackground {
    shapeDraw?: boolean;
    shapeFillColor?: string;
    shapeBorderColor?: string;
    shapeBorderWidth?: number;
    shapeBorderRadius?: number;
    padding?: number | [number, number] | [number, number, number, number];
}
interface ScatterRenderLabel {
    /** 启用标注 */
    enable?: boolean;
    /** 标注颜色 */
    color?: PropertyValueType<string>;
    /** 标注字体 */
    font?: PropertyValueType<string>;
    stroke?: PropertyValueType<ScatterRenderLabelStroke>;
    background?: ScatterRenderLabelBackground;
    lineColor?: PropertyValueType<string>;
    lineWidth?: PropertyValueType<string>;
    /** 标注对齐 */
    textAlign?: PropertyValueType<CanvasTextAlign>;
    textBaseline?: PropertyValueType<CanvasTextBaseline>;
    /** 文字偏移 */
    offset?: PropertyValueType<number[]>;
    /** 文字是否旋转 */
    enableRotate?: PropertyValueType<boolean>;
    /**
     * 显示的文本，支持占位符
     */
    text?: PropertyValueType<string>;
}
interface ScatterRenderStyle {
    /** 符号，支持图片image:// */
    symbol?: PropertyValueType<OLE.PointShapeType>;
    /** 符号尺寸 */
    symbolSize?: PropertyValueType<number>;
    /** 字形符号，对应type=CHARACTER */
    symbolRotate?: PropertyValueType<number>;
    /** 填充颜色 默认=auto */
    fillColor?: PropertyValueType<string>;
    /** 线条颜色 默认=#000 */
    lineColor?: PropertyValueType<string>;
    /** 线宽 默认 0 */
    lineWidth?: PropertyValueType<number>;
    /** 标注 */
    label?: ScatterRenderLabel;
}
/** 过滤器 */
interface ScatterRenderFilter {
    /** 用于过滤的字段 */
    field: string | number;
    /**
     * 过滤器条件表达式
     * 使用 {value} 标识field指定的字段值
     */
    case: string;
    /**
     * 当表达式为true时，用于替换的值
     * 如果值为undefined，则忽略该记录
     */
    value: any;
}
/**
 * 散点图渲染器
 */
interface ScatterRender extends CompResourceRender {
    /** 类型 */
    type: 'scatter';
    /** X坐标字段 */
    fieldX?: number | string;
    /** Y坐标字段 */
    fieldY?: number | string;
    /** 值字段，在使用色表时使用该字段 */
    fieldValue?: number | string;
    /** 数据过滤器 */
    filter?: ScatterRenderFilter[] | ((value: number[]) => boolean);
    /** 正常样式 */
    styleNormal?: ScatterRenderStyle;
    /** 高亮样式 */
    styleEmphasis?: ScatterRenderStyle;
}
/**
 * Overlays渲染器
 */
interface OverlaysRender extends PointsRender {
    /** 类型 */
    type: 'overlays';
    /** Overlays的内容 */
    html: string | HTMLElement | ((pt: any[]) => string | HTMLElement);
    /** 偏移值 */
    offset?: number[];
    /** 位置 */
    positioning?: string;
}
declare type RasterRenderFormat = PropertyValueType<string | OLE.RasterLabelIcon>;
interface RasterRenderLabel {
    /** 字体名称 */
    font_name?: string;
    /** 字体大小 */
    font_size?: number;
    /** 颜色 */
    color?: string;
    /** 小数位数 */
    fixed?: number;
    /** 边距 */
    padding?: number[];
    /** 网格 */
    grid?: {
        color?: string;
        width?: number;
    };
    stroke?: {
        color?: string;
        width?: number;
    };
    formatter?: RasterRenderFormat;
}
/**
 * 栅格渲染器
 */
interface RasterRender extends CompResourceRender {
    /** 类型 */
    type: 'raster';
    /** 渲染模式 */
    mode: 'raster' | 'isolines' | 'isobands' | 'raster+isolines';
    /** 渲染让个标注 */
    label?: RasterRenderLabel;
    /** 插值方法 */
    interpFilter: OLE.FILTER;
    /** 是否启用worker */
    useWorker: boolean;
    /** 裁切区，MultiPolygon */
    clip?: number[][][][];
}
/** 栅格文字绘制器 */
interface RasterTextRender extends CompResourceRender, RasterRenderLabel {
    type: 'raster-text';
    /** 裁切区，MultiPolygon */
    clip?: number[][][][];
}
interface IsoOnServerRender extends CompResourceRender {
    /** 渲染模式 */
    mode: 'isolines' | 'isobands' | 'isobands+isolines';
    /** 服务器地址 */
    server: string;
    /** 要计算的等值线值 */
    values?: number[];
    /** 线宽。颜色 */
    line: {
        color: string;
        width: number;
        style?: "solid" | "dash" | "no" | "dot" | "dash dot" | "dash dot dot";
        capstyle?: "round" | "square" | "flat";
        joinstyle?: "round" | "bevel" | "miter";
    };
    /** 标注颜色，字体 */
    label: {
        size: number;
        color: string;
        decimals: number;
        repeat: number;
        fontFamily?: string;
        textSpacing?: number;
        place?: Array<String>;
        minFeatureSize: number;
        shadow?: {
            shadowDraw?: boolean;
            shadowOffsetAngle?: number;
            shadowOffsetDist?: number;
            shadowRadius?: number;
            shadowColor?: [number, number, number];
            shadowTransparency: number;
        };
        buffer?: {
            bufferDraw?: boolean;
            bufferSize?: number;
            bufferColor?: string | [number, number, number, number];
        };
        background?: {
            shapeDraw?: boolean;
            shapeFillColor?: string | [number, number, number, number];
            shapeBorderColor?: string | [number, number, number, number];
            shapeBorderWidth?: number;
        };
    };
    /** 裁剪区域 */
    clip: number[][][][];
    /** 差值方法 */
    interpFilter: 0 | 1 | 2 | 3 | 4 | 5;
}
/**
 * 栅格渲染器
 */
interface RasterIsoRender extends IsoOnServerRender {
    /** 类型 */
    type: 'raster-iso';
}
interface PointIsoRender extends IsoOnServerRender {
    type: 'point-iso';
    fieldx: number | string;
    fieldy: number | string;
    fieldv: number | string;
    /** 预插值 */
    preInterp?: boolean;
    interpGapx?: number;
    interpGapy?: number;
    interpRadius?: number;
    /** 插值网格数，用于 preInterp == false时 */
    interpGrid?: number;
}
/**
 * 栅格风矢渲染器
 */
interface RasterWindVectorRender extends CompResourceRender {
    /** 类型 */
    type: 'windVector';
    /** 风矢的尺寸 */
    windSize: number;
    /** 风矢的颜色 */
    windColor: string;
}
interface RasterStreamLineRender extends CompResourceRender, OLE.StreamLineOption {
    type: 'streamLine';
}
/**
 * 栅格风场渲染器
 */
interface RasterFlowFieldRender extends CompResourceRender {
    /** 类型 */
    type: 'flowField';
    /** 粒子的宽度 */
    particleWidth: number;
    /** 粒子的数量 */
    particleNumber: number;
    /** 淡出参数，控制粒子的长度 */
    fadeOpacity: number;
    /** 速度参数，控制粒子速度 */
    speedFactor: number;
    /** 速度过滤 */
    speeddFilterMin: number;
    speeddFilterMax: number;
    windColor: string | [string];
}
interface CompResourceExData {
}
interface CompTableResourceExData {
    fieldx?: string | number;
    filedy?: string | number;
}
/**
 * 瓦片数据集扩展参数
 */
interface CompResourceExDataTileMap extends CompResourceExData {
    tileType: string;
    extent?: number[];
    topGrid?: [number, number];
}
/**
 * Smartbi数据集扩展参数
 */
interface CompResourceExDataSmartbi extends CompTableResourceExData {
    fieldx?: string | number;
    filedy?: string | number;
    /** 数据集的参数列表 */
    params?: [{
        id: string;
        value: string;
    }];
    /** 数据集批量获取的数量 */
    batchCount?: number;
}
interface CompResourceDeclare {
    /**
     * 资源类型
     */
    type: string;
    /** 资源的统一描述字符串 */
    url?: string;
    /** 当前的资源类型 */
    nowUrlType?: URLType;
    /** 多资源【可选】 */
    urls?: [{
        url: string;
        type: URLType;
        dataType: DataType;
        rate?: CompResourceDeclare["rate"];
    }];
    dataType?: DataType | string;
    nowDataType?: DataType | string;
    /** 预报时效 */
    futureList?: [[string, string]] | undefined;
    /** 预报时效值 */
    futureValue?: string;
    /** 预报时效u */
    futureUList?: [[string, string]];
    /** 预报时效v */
    futureVList?: [[string, string]];
    /** 预报时效值uv */
    futureUVValue?: string;
    /** 资源的投影 */
    projection: string;
    /**
     * 资源的更新频率
     * 1 days, 24 hours, 5 minutes
     */
    rate: string | {
        unit?: string;
        value?: number;
        offset?: number;
        values?: number[];
    };
}
interface CompResourceDeclareCommon extends CompResourceDeclare {
    fieldx?: string | number;
    fieldy?: string | number;
    /** 方法 */
    method: 'GET' | 'POST';
    /** 内容类型 */
    contentType: 'application/x-www-form-urlencoded' | 'application/json' | string;
    /** 附加的标头 */
    headers: Record<string, string>;
    /** 发送数据 */
    data: string | Record<string, any>;
    /** 返回数据路径 */
    responseDataPath: string[];
}
interface CompResourceDeclareMemory extends CompResourceDeclare {
    data: {
        fields: string[];
        rows: any[][];
        fieldx?: string | number;
        fieldy?: string | number;
    };
}
interface CompResourceDeclareSmartbi extends CompResourceDeclare {
    fieldx?: string | number;
    fieldy?: string | number;
    /** 数据集的参数列表 */
    params?: [{
        id: string;
        value: string;
    }];
    /** 数据集批量获取的数量 */
    batchCount?: number;
}
interface CompResourceDeclareTileMap extends CompResourceDeclare {
    tileType: string;
    extent?: number[];
    topGrid?: [number, number];
}
/**
  * 综合资源对象
  * @deprecated
  */
interface CompResourceDeclareOld {
    /**
     * 资源id，用于唯一标识资源对象
     */
    id: string;
    /**
     * 资源名称
     * @example "雨预报-3小时"
     */
    name: string;
    /** 资源的描述信息 */
    desc: string;
    /**
     * 资源类型
     */
    type: string;
    /** 资源的统一描述字符串 */
    url: string;
    /** 多资源【可选】 */
    urls?: [{
        url: string;
        type: URLType;
        dataType: DataType;
    }];
    dataType?: DataType | string;
    /** 预报时效 */
    futureList?: [[string, string]];
    /** 预报时效值 */
    futureValue?: string;
    /** 预报时效u */
    futureUList?: [[string, string]];
    /** 预报时效v */
    futureVList?: [[string, string]];
    /** 预报时效值uv */
    futureUVValue?: string;
    /** 资源配置额外的信息 */
    exdata: {};
    /** 资源的投影 */
    projection: string;
    /**
     * 资源的更新频率
     * 1 days, 24 hours, 5 minutes
     */
    rate: string | {
        unit?: string;
        value?: number;
        offset?: number;
        values?: number[];
    };
}
declare type CompTooltipPositioning = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-center' | 'center-right' | 'top-left' | 'top-center' | 'top-right';
interface CompTooltip {
    /** 是否启用 */
    enable?: boolean;
    /** 拾取容差 */
    pickTolerance?: number;
    /** tooltip 的位置  */
    positioning?: CompTooltipPositioning;
    /** 背景色 */
    backgroundColor?: string;
    /** 边框颜色 */
    borderColor?: string;
    /** 边框宽度 */
    borderWidth?: number;
    /** 内边距 */
    padding?: number | number[];
    /** 额外的css样式 */
    extraCssText?: string;
    /** 额外的css类 */
    extraCssClass?: string;
    /** 内容 */
    content: PropertyValueType<string>;
    contentFunction?: PropertyValueCallback<string>;
}
/**
 * 资源图层
 */
interface CompResourceLayer {
    /**
     * 资源id，用于唯一标识资源对象
     */
    id: string;
    /**
     * 资源名称
     * @example "雨预报-3小时"
     */
    name: string;
    /** 资源的描述信息 */
    desc: string;
    /** 资源 */
    resource: CompResourceDeclare;
    /** 资源的渲染器 */
    render: CompResourceRender | CompResourceRender[];
    /**
     * 色表
     */
    colors: CompColors;
    /** 提示框 */
    tooltip?: CompTooltip;
    /**
     * 数据时间
     */
    datetime: Date;
    minzoom: 3;
    maxzoom: 10;
    visible: true;
}
declare var ZMap: any;
declare var ZMap2D: any;
declare var ol: any;
declare class CompFieldsHelp {
    static findField(fields: string[], field: string | number, def?: string | string[]): number;
}
interface CompLRUCacheItem<K, V> {
    key: K;
    value: V;
    iterator: LinkedListItem<K>;
}
declare class CompLRUCache<K, V> {
    private _mCapability;
    private _mLowLevel;
    private _map;
    private _list;
    constructor(cap?: number, low?: number);
    setSize(cap: number, low: number): void;
    get(key: K): V;
    add(key: K, value: V): void;
    remove(key: K): V;
    clear(): void;
    get size(): number;
    get lowlevel(): number;
    get capability(): number;
    forEach(func: (value: V, key: K) => any): void;
    private _obsolete;
}
interface LinkedListItem<T> {
    data: T;
    owner: CompLinkedList<T>;
    prev: LinkedListItem<T>;
    next: LinkedListItem<T>;
}
/** 单链表 */
declare class CompLinkedList<T> {
    private _size;
    private _head;
    private _tail;
    constructor();
    push_front(v: T): LinkedListItem<T>;
    push_back(v: T): LinkedListItem<T>;
    pop_front(): LinkedListItem<T>;
    pop_back(): LinkedListItem<T>;
    get front(): T;
    get back(): T;
    frontItem(): LinkedListItem<T>;
    backItem(): LinkedListItem<T>;
    find(v: T): LinkedListItem<T>;
    insert(v: T, after?: LinkedListItem<T>): LinkedListItem<T>;
    remove(v: T): void;
    removeByItem(sli: LinkedListItem<T>): LinkedListItem<T>;
    clear(): void;
    toString(): string;
}
/**
 * 图层的事件支持
 */
declare enum CompMapLayerEventType {
    /** 开始加载数据 */
    LOAD_STARTED = "load-started",
    /** 数据加载成功 */
    LOAD_SUCCESSED = "load-successed",
    /** 数据加载失败 */
    LOAD_FAILED = "load-failed",
    /** 数据加载完成 */
    LOAD_FINISHED = "load-finished",
    /** 绘制开始 */
    RENDER_BEGIN = "render-begin",
    /** 绘制成功 */
    RENDER_COMPLATE = "render-complate",
    /** 绘制错误 */
    RENDER_ERROR = "render-error",
    /** 可见性发生改变 */
    CHANGED_VISIBLE = "changed-visible",
    /** 透明度发生改变 */
    CHANGED_OPACITY = "changed-opacity"
}
declare type CompMapLayerLoadStatus = CompMapLayerEventType.LOAD_STARTED | CompMapLayerEventType.LOAD_SUCCESSED | CompMapLayerEventType.LOAD_FAILED | CompMapLayerEventType.LOAD_FINISHED;
declare type CompMapLayerRenderStatus = CompMapLayerEventType.RENDER_BEGIN | CompMapLayerEventType.RENDER_COMPLATE | CompMapLayerEventType.RENDER_ERROR;
declare class CompMapLayerEvent extends Comp.Event {
    target: CompMapLayer;
    msg: string;
    constructor(type: string, target: CompMapLayer, msg?: string);
}
/**  */
interface CompTipValue {
    layer: CompMapLayer;
    fields: string[];
    values: any[];
    hlShape: CompCustomDrawer;
}
interface CompMapLayerOption {
    id?: string;
    name?: string;
    view: CompMapView;
    resource: CompResource;
    /** 资源的渲染器 */
    render?: CompResourceRender | CompResourceRender[];
    /**
     * 色表
     */
    colors?: CompColors;
    /** 提示框 */
    tooltip?: CompTooltip;
    minzoom?: 3;
    maxzoom?: 10;
    visible?: true;
    opacity?: number;
    url?: string;
}
/**
 * 图层
 *
 * 图层支持的事件列表
 */
declare abstract class CompMapLayer extends Comp.Observable {
    protected _id?: string;
    protected _name: string;
    protected _view: CompMapView;
    protected _resource: CompResource;
    protected _colors: CompColors;
    protected _tooltip: CompTooltip;
    protected _renders: CompDataRender[];
    private _olLayer;
    private _declare;
    private _params;
    private _version;
    private _time;
    private _thisTime;
    private _thisParams;
    private _renderStatus;
    private _loadStatus;
    protected static mapResolutionMercator: {
        level: number;
        scale: number;
        resolution: number;
    }[];
    protected static mapResolutionDegrees: {
        level: number;
        range: number;
        resolution: number;
    }[];
    /**
     * 构造一个图层
     * @param option 图层选项
     */
    constructor(option: CompMapLayerOption);
    /** 图层的名称 */
    get name(): string;
    /** 获取视图对象 */
    get view(): CompMapView;
    /** 获取图层定义对象 */
    get declare(): CompMapLayerOption;
    /**
     * 获取资源对象
     */
    get resource(): CompResource;
    /** 数据版本 */
    get version(): number;
    /** 获取色表配置 */
    get colors(): CompColors;
    /** 获取Openlayer的图层对象 */
    get olLayer(): any;
    /** 数据类型 */
    get dataType(): CompResourceDataType;
    /** 获取当前图层数据时间 */
    get time(): Date;
    /** 设置当前图层数据时间（不刷新数据） */
    set time(d: Date);
    /** 当前加载状态 */
    get loadStatus(): CompMapLayerLoadStatus;
    /** 当前绘制状态 */
    get renderStatus(): CompMapLayerRenderStatus;
    /** 获取渲染器列表 */
    get renders(): CompDataRender[];
    /** 获取字段 */
    abstract get fields(): string[];
    /** 获取值列表 */
    abstract get values(): any[];
    /** 获取资源对象 */
    getResource(): void;
    /**
     * 设置是否可见
     * @param visible
     */
    setVisible(visible: boolean): void;
    /**
     * 获取图层是否可见
     * @returns 图层可见
     */
    getVisible(): any;
    /**
     * 设置图层不透明度
     * @param opacity 不透明度
     */
    setOpacity(opacity: number): void;
    /**
     * 获取图层不透明度
     */
    getOpacity(): number;
    private _urlDirty;
    private _setParamHandle;
    /**
     * 设置参数
     * @param time 时间参数
     * @param params 其他参数
     */
    setParams(time: Date, params: {
        [key: string]: any;
    }, onlySet?: boolean): void;
    /** 改变URL类型 */
    setURLType(type: URLType): void;
    /**
     * 检查时间是否相同
     * @param t1 时间1
     * @param t2 时间2
     * @returns true:参数相同，false:参数不同
     */
    static checkTime(t1: Date, t2: Date): boolean;
    /**
     * 检查参数是否改变
     * @param p1 参数1
     * @param p2 参数2
     * @returns true:参数相同，false:参数不同
     */
    static checkParams(p1: Record<string, any>, p2: Record<string, any>): boolean;
    /**
     * 获取级别对应的分辨率
     * @param level 地图级别
     * @returns 指定级别的分辨率信息
     */
    static getResolution(level: number): number;
    /**
     * 设置参数
     * @param time 时间
     * @param params 数据参数
     */
    setParamsImm(time: Date, params: {
        [key: string]: any;
    }): void;
    setTime(time: Date, onlySet?: boolean): void;
    /**
     * 获取图层的时间
     */
    getTime(): Date;
    /**
     * 上面获取图层的时间的方法看起来有点问题
     */
    getThisTime(): Date;
    /**
     * 设置色表
     * @param colors
     */
    setColors(colors: CompColors): void;
    /**
     * 获取色表
     */
    getColors(): CompColors;
    /**
     * 根据数值获取颜色
     * @param value
     */
    getColor(value: number): string;
    /**
     * 检查颜色
     * @returns 如果被过滤返回 true
     */
    filterByColor(value: number): boolean;
    /**
     * 设置提示框设置
     * @param tooltip
     */
    setTooltip(tooltip: CompTooltip): void;
    /** 获取提示框设置 */
    getTooltip(): CompTooltip;
    /** 数据是否为空 */
    abstract isDataEmpty(): boolean;
    /** 获取值对象的x */
    getValueX(value: any[]): number;
    /** 获取值对象的Y */
    getValueY(value: any[]): number;
    /**
     * 查询指定坐标的数据
     * @param x 坐标X
     * @param y 坐标Y
     */
    query(x: number, y: number, to?: number): any[];
    /**
     * 查询指定区域的数据
     * @param extent 坐标范围 [xmin, ymin, xmax, ymax]
     */
    queryRect(extent: number[]): any[];
    /** 简单多边形查询 */
    queryPolygon(polygon: [number, number][]): any[];
    /** 圆形查询 */
    queryCircle(x: number, y: number, r: number): any[];
    /**
     * 查询可以提示的对象
     * @param x
     * @param y
     * @param to
     */
    queryTip(x: number, y: number, to?: number): CompTipValue;
    /** 查询显示的对象 */
    queryDisplay(x: number, y: number): any;
    /** 更新图层 */
    update(): void;
    /**
     * 销毁图层
     */
    destroy(): void;
    /**
     * 注册事件
     * @param type
     * @param listener
     * @param opt_this
     */
    on(type: CompMapLayerEventType, listener: Comp.EventListener, opt_this?: object): Comp.ListenerObject;
    on(type: CompMapLayerEventType[], listener: Comp.EventListener, opt_this?: object): Comp.ListenerObject[];
    protected _isOutofDate(version: number): boolean;
    /** 触发绘制事件 */
    protected _fireLoadStatus(status: CompMapLayerLoadStatus, msg?: string): void;
    /** 触发绘制事件 */
    protected _fireRenderStatus(status: CompMapLayerRenderStatus, msg?: string): void;
    /** 创建渲染器 */
    protected createRender(rdecl: CompResourceRender): CompDataRender;
    /** 移除渲染器 */
    protected removeRender(render: CompDataRender): void;
    /** 创建多个渲染器 */
    protected createRenders(render: CompResourceRender | CompResourceRender[]): void;
    /** 数据开始加载 */
    protected _onPreLoadData(): void;
    /** 加载数据 */
    protected abstract _onLoadData(e: CompResourceData): void;
    /** 数据加载完成 */
    protected _onLoadDataComplate(): void;
    /** 数据加载失败 */
    protected _onLoadDataError(error: any): void;
}
interface ComMapViewTipOption {
    /** tip框的活动范围 */
    activeArea?: number[];
    /** tip框的活动边距 */
    activePadding?: number[];
}
interface CompMapViewOption {
    dom?: string | HTMLElement;
    data?: any;
    setting?: any;
    /** tip信息设置 */
    tip?: ComMapViewTipOption;
}
interface CompMapViewDrawEvent {
    type: string;
    feature?: any;
    geometry?: any;
    coordinates?: any;
}
interface CompMapViewDrawOption {
    type: string;
    freehand?: string;
    style?: any;
    onDrawStart?: () => void;
    onDrawEnd?: (evt: CompMapViewDrawEvent) => void;
}
declare enum CompMapViewEventType {
    CLICK = "click",
    DBLCLICK = "dblclick",
    MOUSEMOVE = "mousemove"
}
declare enum CompMapViewQueryType {
    /** 所有图层 */
    ALL = "all",
    /** 可见图层 */
    VISIBLE = "visible",
    /** 最上可见图层 */
    TOPMOST = "top-most"
}
declare class CompMapViewMouseEvent extends Comp.Event {
    event: any;
    pixel: [number, number];
    coordinate: [number, number];
    constructor(type: CompMapViewEventType, e: any);
}
declare type CompMapViewEventListener = (event: CompMapViewMouseEvent) => boolean | void;
interface CompCustomDrawer {
    onCustomDraw(extent: number[], size: [number, number], resolution: number, pixelRatio: number, ctx: CanvasRenderingContext2D): void;
}
declare class CustomDrawerLayer extends OLE.BaseCanvasLayer {
    private _customDrawers;
    constructor();
    /**
     * 添加自定义绘制对象
     * @param drawer
     */
    addCustomDrawer(drawer: CompCustomDrawer): void;
    /**
     * 删除自定义绘制对象
     * @param drawer
     */
    removeCustomDrawer(drawer: CompCustomDrawer): void;
    protected _canvasFunction(extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: string): void;
}
/**
 * 地图视图
 */
declare class CompMapView extends Comp.Observable {
    private _map2d;
    private _mapWidget;
    /** 图层列表 */
    private _layers;
    private _customLayer;
    private _tipOption;
    private _swipe;
    constructor(option?: CompMapViewOption);
    get zmap2d(): any;
    get olMap(): any;
    /**
     * 创建图层
     * @param {CompResourceLayer} reslayer
     */
    createLayer(reslayer: CompResourceLayer): CompMapLayer;
    /**
     * 获取矢量绘制图层
     * @param create
     */
    getDrawLayer(create: boolean): CompVectorLayer;
    /**
     * 删除图层
     * @param {*} layer
     */
    removeLayer(layer: CompMapLayer): void;
    /**
     * 移动图层
     * @param {*} layer
     * @param {*} to
     */
    moveLayer(layer: CompMapLayer, to: number): void;
    /**
     * 获取所有图层
     */
    getLayers(): CompMapLayer[];
    /** 更新当前视图 */
    update(): void;
    /**
     * 添加图层到图层刷（卷帘）中
     * @param layer 待添加的图层
     * @param positioning 图层位置，可用值 `'left'|'top'|'right'|'bottom'|'left-top'|'left-bottom'|'right-top'|'right-bottom'`
     */
    addLayerSwipe(layer: CompMapLayer | CompDataRender, positioning: OLE.SwipePositioning): void;
    /**
     * 移除图层刷（卷帘）中指定图层
     * @param layer 待移除的图层
     */
    removeLayerSwipe(layer: CompMapLayer | CompDataRender): void;
    /** 移除图层刷（卷帘）中所有图层 */
    clearLayerSwipe(): void;
    /**
     * 设置图层刷（卷帘）位置百分比
     * @param x x坐标位置：[0.0-1.0]
     * @param y y坐标位置：[0.0-1.0]
     */
    setLayerSwipePos(x?: number, y?: number): void;
    /**
     * 设置图层刷（卷帘）像素位置
     * @param px x坐标像素位置
     * @param py y坐标像素位置
     */
    setLayerSwipePixel(px?: number, py?: number): void;
    /**
     * 查询指定坐标的数据
     * @param x 坐标X
     * @param y 坐标Y
     */
    query(type: CompMapViewQueryType, x: number, y: number, to?: number): any[];
    /**
     * 查询指定区域的数据
     * @param extent 坐标范围 [xmin, ymin, xmax, ymax]
     */
    queryRect(type: CompMapViewQueryType, extent: number[]): any[];
    /** 简单多边形查询 */
    queryPolygon(type: CompMapViewQueryType, polygon: [number, number][]): any[];
    /** 圆形查询 */
    queryCircle(type: CompMapViewQueryType, x: number, y: number, r: number): any[];
    private _queryByType;
    private _lastDraw;
    /** 绘图工具 */
    draw(option: CompMapViewDrawOption): void;
    /**
     * 抓图
     */
    screenshot(): string;
    private _gif;
    /** 抓取GIF图 */
    screenshotGIF(option: Comp.ScreenShotOption): void;
    /** 取消抓图 */
    cancelScreenshotGIF(): void;
    /**
     * 监听事件
     * @param type
     * @param listener
     * @param opt_this
     */
    on(type: CompMapViewEventType | CompMapViewEventType[], listener: CompMapViewEventListener, opt_this?: object): Comp.ListenerObject | Comp.ListenerObject[];
    /**
     * 添加自定义绘制对象
     * @param drawer
     */
    addCustomDrawer(drawer: CompCustomDrawer): void;
    /**
     * 删除自定义绘制对象
     * @param drawer
     */
    removeCustomDrawer(drawer: CompCustomDrawer): void;
    updateCustomDrawers(): void;
    private _tooltipOverlay;
    private _tooltipElement;
    private _onMouseMoveHandle;
    /**
     * 计算tooltip的位置
     * @param tipo
     * @param x
     * @param y
     * @returns
     */
    private _calcPositioning;
    private _calcOffset;
    private _initTooltip;
    private _initCustomDrawers;
}
declare function callWithTryCatch(callback: (...args: any[]) => any, ...args: any[]): any;
declare enum CompResourceDataType {
    MAP = "map",
    TABLE = "table",
    RASTER = "raster",
    RASTERUV = "raster-uv"
}
declare enum CompResourceRateType {
    YEARS = "years",
    MONTHS = "months",
    DAYS = "days",
    HOURS = "hours",
    MINUTES = "minutes",
    SECONDS = "seconds"
}
declare abstract class CompResourceData {
    abstract get dataType(): CompResourceDataType;
}
interface CompResourceMapDataOption {
    /** 数据地址 */
    url: string;
    /** 数据范围 */
    extent?: number[];
    /** 数据投影 */
    projection?: string;
}
declare abstract class CompResourceMapData extends CompResourceData implements CompResourceMapDataOption {
    url: string;
    extent?: number[];
    projection?: string;
    constructor(option?: CompResourceMapDataOption & object);
    get dataType(): CompResourceDataType;
}
interface CompResourceWmsMapDataOption extends CompResourceMapDataOption {
}
/** WMS 数据 */
declare class CompResourceWmsMapData extends CompResourceMapData implements CompResourceWmsMapDataOption {
    constructor(option?: CompResourceWmsMapDataOption);
}
interface CompResourceWtmsMapDataOption extends CompResourceMapDataOption {
    /** 瓦片地图类型 */
    type?: string;
    /** 顶层瓦片 */
    topGrid?: [number, number];
}
/** WTMS 数据 */
declare class CompResourceWtmsMapData extends CompResourceMapData implements CompResourceWtmsMapDataOption {
    type?: string;
    topGrid?: [number, number];
    constructor(option?: CompResourceWtmsMapDataOption);
}
/**
 * 表格数据
 */
declare class CompResourceTable extends CompResourceData {
    /** 数据字段列表 */
    fields: string[];
    /** x字段 */
    fieldx: number;
    /** y字段 */
    fieldy: number;
    /** 数据列表 */
    rows: any[][];
    /** 最后一部分 */
    isLastPart: boolean;
    constructor(option?: {
        fields: string[];
        fieldx: number;
        fieldy: number;
        rows: any[][];
        isLastPart: boolean;
    });
    get dataType(): CompResourceDataType;
}
interface CompRasterData {
    /** 原始编码的数据 */
    base64: string;
    /** 解码和的数据 */
    values: ArrayLike<number>;
    /** 数据的最小值 */
    vmin: number;
    /** 数据的最大值 */
    vmax: number;
    /** 无效值 */
    noData: number;
}
interface CompResourceBaseRasterOption {
    extent: number[];
    xcells: number;
    ycells: number;
}
interface CompResourceRasterOption extends CompResourceBaseRasterOption {
    data: CompRasterData;
}
interface CompResourceUVRasterOption extends CompResourceRasterOption {
    datau: CompRasterData;
    datav: CompRasterData;
}
declare abstract class CompResourceBaseRaster extends CompResourceData {
    /** 栅格数据的列数 */
    xcells: number;
    /** 栅格数据的行数 */
    ycells: number;
    /** 栅格数据的空间范围 */
    extent: number[];
    xres: number;
    yres: number;
    constructor(option?: CompResourceBaseRasterOption);
    /** 获取指定像元的值 */
    abstract getCellValue(cx: number, cy: number): number | number[];
    /** 计算像元的x编号 */
    getXNum(x: number): number;
    /** 计算像元的y编号 */
    getYNum(y: number): number;
}
/**
 * 栅格数据
 */
declare class CompResourceRaster extends CompResourceBaseRaster {
    data: CompRasterData;
    constructor(option?: CompResourceRasterOption);
    get dataType(): CompResourceDataType;
    /**
     * @override
     * @param cx
     * @param cy
     */
    getCellValue(cx: number, cy: number): number | number[];
}
/**
 * UV栅格数据
 */
declare class CompResourceUVRaster extends CompResourceRaster {
    datau: CompRasterData;
    datav: CompRasterData;
    constructor(option?: CompResourceUVRasterOption);
    get dataType(): CompResourceDataType;
    /**
     * @override
     * @param cx
     * @param cy
     */
    getCellValue(cx: number, cy: number): number[];
}
declare type CompResLoadDataSuccess = () => void;
declare type CompResLoadDataGotData = (result: CompResourceData) => void;
declare type CompResLoadDataError = (ex?: any) => void;
declare type CompResLoadDataFinish = () => void;
/** 数据加载参数 */
interface LoadDataOption {
    /** 加载数据的时间参数 */
    time?: Date;
    /** 其他参数 */
    params?: Record<string, any>;
    /** 数据加载成功时回调，回调可能会执行多次 */
    gotdata?: CompResLoadDataGotData;
    /** 数据加载完成没有发生错误时执行 */
    success?: CompResLoadDataSuccess;
    /** 数据加载发生异常时执行 */
    error?: CompResLoadDataError;
    /** 数据加载结束时调用，总是会执行 */
    finish?: CompResLoadDataFinish;
}
/**
 * 资源对象
 */
declare abstract class CompResource {
    private _declare;
    private _rateType;
    private _rateValue;
    private _rateOffset;
    private _rateValues;
    constructor(decl: CompResourceDeclare);
    static regexRate: RegExp;
    /**
     *
     */
    get declare(): CompResourceDeclare;
    /**
     * 获取数据类型
     */
    abstract get dataType(): CompResourceDataType;
    /**
     * 加载资源
     */
    abstract load(option: LoadDataOption): void;
    /**
     * 获取基础时间
     * @param time
     */
    getBaseTime(time: Date, special?: boolean): Date;
    /**
     * 获取前一个有效时间
     * @param time
     */
    getPreTime(time: Date): Date;
    /**
     * 获取下一个有效时间
     * @param time
     */
    getNextTime(time: Date): Date;
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
    static computeRegx: RegExp;
    static fmtDate(time: Date, fmt: string): string;
    static fmtParam(time: Date, params: {
        [key: string]: any;
    }, fmt: string): string;
    static getTimeField(t: Date, type: CompResourceRateType): number;
    static setTimeField(t: Date, type: CompResourceRateType, nvalue: number): void;
    static plusTimeField(t: Date, type: CompResourceRateType, nvalue: number): void;
    static callWithTryCatch(callback: (...args: any[]) => any, ...args: any[]): any;
    static callLoadGotData(option: LoadDataOption, result: CompResourceData): void;
    static callLoadDataSuccess(option: LoadDataOption): void;
    static callLoadDataError(option: LoadDataOption, ex: any): void;
    static callLoadDataFinish(option: LoadDataOption): void;
}
declare class CompResourceFactory {
    static createResource(res: CompResourceDeclare): CompResource;
    /**
     * 资源列表
     */
    static factories: {
        [x: string]: {
            new (res: CompResourceDeclare): CompResource;
        };
    };
}
declare type Constructor = {
    new (layer: CompMapLayer, decl: CompResourceRender): CompDataRender;
};
/**
 * 图层工厂
 */
declare class CompRenderFactory {
    private _name;
    private _alias;
    private _types;
    private _factory;
    constructor(name: string, types: CompResourceDataType | CompResourceDataType[], factory: Constructor, alias?: string[]);
    get name(): string;
    get alias(): string[];
    get types(): CompResourceDataType[];
    get factory(): Constructor;
}
/**
 * 渲染器工厂
 */
declare class CompRenderFactorys {
    private static renderSupports;
    /**
     * 创建图层
     * @param view
     * @param render
     */
    static createRender(layer: CompMapLayer, render: CompResourceRender): CompDataRender;
    static regFactory(def: CompRenderFactory): void;
    /**
     * 注册图层
     * @param name
     * @param def
     */
    static regFactory2(type: string | string[], def: CompRenderFactory): void;
}
declare var GIF: any;
declare namespace Comp {
    enum OverlayType {
        TEXT = "text",
        IMAGE = "image",
        RECT = "rect",
        TIMESTAMP = "timestamp",
        COLORTABLES = "colortables",
        PROGRESS = "progress"
    }
    export interface ScreenShotOverlay {
        /** 类型 */
        type?: OverlayType;
        /** 位置 */
        position?: string;
        /** 偏移 */
        offset?: number[];
    }
    interface ScreenShotShapeStyle {
        /** 填充样式 */
        fillColor?: string | CanvasGradient | CanvasPattern;
        /** 线条样式 */
        borderColor?: string | CanvasGradient | CanvasPattern;
        /** 线宽 */
        borderWidth?: number;
    }
    interface ScreenShotTextStyle {
        /** 字体 */
        font?: string;
        /** 颜色 */
        color?: string;
        /** 背景色 */
        bgColor?: string;
        /** 边框色 */
        borderColor?: string;
        /** 边框宽度 */
        borderWidth?: number;
    }
    interface ScreenShotDimension {
        /** 宽度 */
        width?: number;
        /** 高度 */
        height?: number;
    }
    export interface ScreenShotRect extends ScreenShotOverlay, ScreenShotDimension, ScreenShotShapeStyle {
    }
    export interface ScreenShotImage extends ScreenShotOverlay, ScreenShotDimension {
        url?: string;
        image?: HTMLCanvasElement | HTMLImageElement;
    }
    export interface ScreenShotText extends ScreenShotOverlay, ScreenShotTextStyle {
        /** 要显示的文本 */
        text?: string;
    }
    export interface ScreenShotTimestamp extends ScreenShotOverlay, ScreenShotTextStyle {
    }
    export interface ScreenShotProgress extends ScreenShotOverlay, ScreenShotShapeStyle {
        /** 内边距 */
        padding: number;
        /** 元素大小 */
        cellSize: ScreenShotDimension;
        /**  */
        cellStyle: ScreenShotShapeStyle;
        /** 当前要素样式 */
        currentStyle: ScreenShotShapeStyle;
    }
    export interface ScreenShotColorTables extends ScreenShotOverlay, ScreenShotDimension, ScreenShotShapeStyle {
        padding?: number;
        textWidth?: number;
        textStyle?: ScreenShotTextStyle;
        barHeight?: number;
        barBorderColor?: string | CanvasGradient | CanvasPattern;
        barBorderWidth?: number;
        barLabelStyle?: ScreenShotTextStyle;
    }
    export interface ScreenShotOption {
        /** 开始时间 */
        start: Date;
        /** 结束时间 */
        end: Date;
        /** 数据间隔，单位：秒 */
        interval: number;
        /** gif每一帧的长度 */
        frameTime?: number;
        /** gif动画质量 */
        quality?: number;
        /** gif动画是否重复 */
        repeat?: boolean;
        /** 超时时间 */
        timeout?: number;
        /** worker脚本位置 */
        workerScript?: string;
        /** 覆盖层列表 */
        overlays?: ScreenShotOverlay[];
        onProgress: (current: number, count: number) => void;
        onError: (reason?: any) => void;
        onSuccess: (img: string) => void;
        onCancel: () => void;
    }
    export class ScreenShotGif {
        private _view;
        private _date;
        private _current;
        private _frameTime;
        private _repeat;
        private _quality;
        private _gif;
        private _cancel;
        private _mapCanvas;
        private _mapCtx;
        private _memCanvas;
        private _memCtx;
        private _timeOut;
        private _isTimeout;
        private _timeOutHandle;
        private _workerScript;
        private _overlays;
        private _onProcess;
        private _onSuccess;
        private _onError;
        private _onCancel;
        constructor(view: CompMapView, option: ScreenShotOption);
        /** 当前进度 */
        get current(): number;
        /** 是否正在处理中 */
        get processing(): boolean;
        /**
         * 开始抓取GIF
         */
        start(): void;
        /** 停止抓取GIF */
        stop(): void;
        /** 处理一个时间的数据 */
        private _processOne;
        private _processLast;
        private _addFrame;
    }
    export {};
}
declare namespace CompUtils {
    function isDefined<T>(val: T): boolean;
    function defualtValue<T>(val: T, def?: T): T;
    function normalExtent(extent: number[]): number[];
    /**
     * 使用实际值替换token
     * @param fields
     * @param values
     * @param target
     */
    function replaceTokenByFiled(fields: string[], values: any[] | object, target: string): string;
    /**
     * 构造条件表达式函数
     * @param vcase 包含占位符的表达式
     *
     * 支持的占位符为
     *  {f0} {f1} ... {fn} 索引占位符，从values中取值
     *  {xxx} 字段占位符，从others，中取值
     */
    function buildCaseFunction(vcase: string, fields?: string[]): (values: any[], others: {
        [x: string]: any;
    }) => boolean;
    /**
     * 构建属性获取器
     * 支持回调函数
     * 条件表达式
     * 支持的占位符
     *  {f0} {f1} ... {fn} 表示对应的值
     *  {level} 表示当前地图显示等级
     */
    function buildPropertyGetter<T>(prop: PropertyValueType<T>, fields: string[]): PropertyValueCallback<T>;
    /** 创建 Promise<HTMLImageElement> */
    function createImagePromise(src: string, option?: {
        cancel?: boolean;
    }): Promise<HTMLImageElement>;
}
interface SmartbiDatasetResult {
    /** 开始行数 */
    start: number;
    /** 字段的名称列表 */
    fields: string[];
    /** 字段的类型列表 */
    types: string[];
    /** 数据 */
    data: string[][];
    /** 是否最后一部分数据 */
    isLastPart: boolean;
}
declare type FetchSmartbiDataGotData = (result: SmartbiDatasetResult) => void;
declare type FetchSmartbiDataSuccess = () => void;
declare type FetchSmartbiDataError = (ex?: any) => void;
declare type FetchSmartbiDataFinish = () => void;
interface SmartbiDatasetFetchOption {
    /** 数据集参数 */
    params?: {
        id: string;
        value: string;
    }[];
    /** 分页数目 */
    rows?: number;
    /** 获取数据的回调 */
    gotdata?: FetchSmartbiDataGotData;
    /** 成功完成后 */
    success?: FetchSmartbiDataSuccess;
    /** 获取数据错误 */
    error?: FetchSmartbiDataError;
    /** 完成回调 */
    finish?: FetchSmartbiDataFinish;
}
/**
 * Smartbi数据辅助类
 */
declare class SmartbiDataset {
    /** 服务器地址 */
    private _address;
    /** 数据集ID */
    private _dsid;
    constructor(address: string, id: string);
    get dataSetId(): string;
    set dataSetId(_dsid: string);
    /**
     * 拉取Smartbi数据集的数据
     * @param params 数据集的参数
     * @param rows 分页数目
     */
    fetch(option?: SmartbiDatasetFetchOption): void;
    private rmi;
    /** 获取时效列表 */
    getFutureList(datasetID: string, type?: string): Promise<{
        type: string;
        data1: any;
        data2: any;
    }>;
    static SmartBiRMI(address: string, className: string, methodName: string, params: any[]): Promise<{
        retCode: number;
        result: any;
        duration: number;
    }>;
}
/**
 * UV数据绘制器
 */
declare abstract class CompMapDataRender extends CompDataRender {
    private _layer;
    /** @inheritdoc */
    constructor(layer: CompMapDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get layer(): CompMapDataLayer;
    get data(): CompResourceMapData;
}
/**
 * 栅格数据绘制器
 */
declare abstract class CompRasterDataRender extends CompDataRender {
    private _layer;
    /** @inheritdoc */
    constructor(layer: CompRasterDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get layer(): CompRasterDataLayer;
    get data(): CompResourceRaster;
}
declare abstract class CompTableDataRender extends CompDataRender {
    protected _layer: CompTableDataLayer;
    constructor(layer: CompTableDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get layer(): CompTableDataLayer;
    /** 可部分绘制 */
    get partialRenderable(): boolean;
}
/**
 * UV数据绘制器
 * @deprecated
 * @see CompWtmsDataRender
 */ 
/**
 * UV数据绘制器
 */
declare abstract class CompUVDataRender extends CompDataRender {
    private _layer;
    /** @inheritdoc */
    constructor(layer: CompUVDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get layer(): CompUVDataLayer;
    get data(): CompResourceUVRaster;
}
declare enum URLType {
    /** 普通数据集 */
    NORMAL = "normal",
    /** 预报数据集 */
    FUTURE = "future"
}
declare enum DataType {
    /** 栅格数据 */
    GRID = "grid",
    /** uv风栅格数据 */
    UVGRID = "uvGrid"
}
declare class CompLayerCreator {
    static create(view: CompMapView, reslayer: CompResourceLayer): CompTableDataLayer | CompRasterDataLayer | CompUVDataLayer | CompMapDataLayer;
}
/** 地图数据图层 */
declare class CompMapDataLayer extends CompMapLayer {
    protected _data: CompResourceMapData;
    constructor(option: CompMapLayerOption);
    get data(): CompResourceMapData;
    /** 获取数据的字段列表 */
    get fields(): string[];
    /** 获取所有数据 */
    get values(): any[][];
    /** 数据是否为空 */
    isDataEmpty(): boolean;
    protected _onLoadData(res: CompResourceData): void;
    protected _onLoadDataError(e: any): void;
    private _isSame;
}
declare abstract class CompAbstractRasterDataLayer extends CompMapLayer {
    constructor(option: CompMapLayerOption);
    abstract get data(): CompResourceBaseRaster;
    /**
     * 查询指定坐标的数据
     * @param x 坐标X
     * @param y 坐标Y
     */
    query(x: number, y: number, to?: number): number[];
    /**
     * 查询指定区域的数据
     * @param extent 坐标范围 [xmin, ymin, xmax, ymax]
     */
    queryRect(extent: number[]): any[];
}
/** 表格图层 */
declare class CompRasterDataLayer extends CompAbstractRasterDataLayer {
    protected _data: CompResourceRaster;
    constructor(option: CompMapLayerOption);
    /**
     * @inheritdoc
     * @override
     */
    get data(): CompResourceRaster;
    /** 数据是否为空 */
    isDataEmpty(): boolean;
    /**
     * 获取值对象的x
     * @override
     */
    getValueX(value: any[]): number;
    /**
     * 获取值对象的Y
     * @override
     */
    getValueY(value: any[]): number;
    static Fields: string[];
    /** 获取数据的字段列表 */
    get fields(): string[];
    /** 获取所有数据 */
    get values(): any[][];
    protected _onLoadData(res: CompResourceData): void;
}
/** 表格图层 */
declare class CompTableDataLayer extends CompMapLayer {
    protected _fields: string[];
    protected _values: any[][];
    protected _fieldx: number;
    protected _fieldy: number;
    protected _complate: boolean;
    protected _isoRender: CompTableDataRender;
    private _hidePoints;
    constructor(option: CompMapLayerOption);
    /** 创建ISO渲染器 */
    createIso(isoRender: PointIsoRender, option?: {
        hidePoints?: boolean;
    }): void;
    /** 清除ISO渲染器 */
    removeIso(): void;
    /** 获取数据的字段列表 */
    get fields(): string[];
    /** 获取所有数据 */
    get values(): any[][];
    get fieldx(): number;
    get fieldy(): number;
    get complate(): boolean;
    /**
     * 获取值对象的x
     * @override
     */
    getValueX(value: any[]): number;
    /**
     * 获取值对象的Y
     * @override
     */
    getValueY(value: any[]): number;
    /** 数据是否为空 */
    isDataEmpty(): boolean;
    /**
     * 查询指定坐标的数据
     * @param x 坐标X
     * @param y 坐标Y
     */
    /**
     * 查询指定区域的数据
     * @param extent 坐标范围 [xmin, ymin, xmax, ymax]
     */
    queryRect(extent: number[]): any[];
    /**
     * 查询可以提示的对象
     * @param x
     * @param y
     * @param to
     */
    queryTip(x: number, y: number, to?: number): CompTipValue;
    /** @override */
    protected _onPreLoadData(): void;
    /** @override */
    protected _onLoadData(res: CompResourceData): void;
}
/**
 * 瓦片图层
 * @deprecated
 * @see CompMapDataLayer
 */
/** 表格图层 */
declare class CompUVDataLayer extends CompAbstractRasterDataLayer {
    protected _data: CompResourceUVRaster;
    constructor(option: CompMapLayerOption);
    /**
     * @inheritdoc
     * @override
     */
    get data(): CompResourceUVRaster;
    static Fields: string[];
    /** 获取数据的字段列表 */
    get fields(): string[];
    /** 获取所有数据 */
    get values(): any[][];
    /** 数据是否为空 */
    isDataEmpty(): boolean;
    protected _onLoadData(res: CompResourceData): void;
}
/**
 * 矢量样式
 */
interface CompVectorStyle {
    /** 填充样式 */
    fill: {
        color: string;
    };
    /** 线条样式 */
    line: {
        color: string;
        width: number;
    };
    /** 图标 */
    icon: {};
    /** 标注 */
    label: {};
}
declare type GetCompVectorStyle = (feature: any) => CompVectorStyle;
/***
 * 矢量图层
 */
declare class CompVectorLayer extends CompMapLayer {
    private _olVector;
    private _olVectorSource;
    private _olEditor;
    constructor(option: CompMapLayerOption);
    /**
     * 获取OpenLayer的Source对象
     * @returns {ol.source.Vector}
     */
    get olSource(): any;
    /** 获取编辑器 */
    get editor(): OlExtends.OlEditor;
    /** @override */
    setVisible(visible: boolean): void;
    /** 获取数据的字段列表 */
    get fields(): string[];
    /** 获取所有数据 */
    get values(): any[][];
    /**
     * 添加要素到当前图层中
     * @param feature
     * @returns 添加到的要素
     */
    addFeature(feature: any, style?: CompVectorStyle): any;
    /**
     * 添加多个要素到当前图层中
     * @param features
     * @returns {ol.Feature[]}
     */
    addFeatures(features: any[], style?: CompVectorStyle | GetCompVectorStyle): any[];
    /**
     * 清除所有要素
     */
    clear(): void;
    /** 数据是否为空 */
    isDataEmpty(): boolean;
    /**
     * 查询指定坐标的数据
     */
    query(x: number, y: number, to?: number): any;
    /**
     * 查询指定区域的数据
     * @param extent 坐标范围 [xmin, ymin, xmax, ymax]
     */
    queryRect(extent: number[]): any[];
    /** 简单多边形查询 */
    queryPolygon(polygon: [number, number][]): any[];
    /** 圆形查询 */
    queryCircle(x: number, y: number, r: number): any[];
    /**
     * 删除要素
     * @param feature
     */
    removeFeature(feature: any): void;
    /**
     * 修改要素属性
     * @param feature
     * @param style
     */
    modifyStyle(feature: any, style?: CompVectorStyle | GetCompVectorStyle): void;
    /**
     * 修改所有对象的样式
     * @param style
     */
    modifyAllStyle(style?: CompVectorStyle | GetCompVectorStyle): void;
    /**
     * 获取所有要素
     */
    getAllFeatures(): any[];
    /**
     * 删除图层
     */
    destroy(): void;
    private _toOlStyle;
    protected _createRender(decl: CompResourceRender): CompDataRender;
    protected _onLoadData(e: CompResourceData): void;
}
/**
 * echarts 图形
 * 散点图和色斑图等
 */
declare class CompEchartsRender extends CompTableDataRender {
    private _olEcharts;
    static renderType: string;
    static dataTypes: CompResourceDataType[];
    constructor(layer: CompTableDataLayer, decl: CompResourceRender);
    /**
     * 获取绘制器的类型
     */
    get factory(): any;
    /** @inheritdoc */
    get olLayer(): any;
    /** 加载数据 */
    updateImm(): void;
    /** 清空 */
    clear(): any;
    /** 设置色表 */
    destroy(): void;
    private _getValue;
    private _buildColors;
    /**
     * 构建echarts的选项
     */
    private _buildEchartsOption;
}
declare const CompEchartsRenderFactory: any;
/**
 * 流场图层
 */
declare class CompFlowFieldRender extends CompUVDataRender {
    private _flow;
    private _defaultRender;
    /**
     * 构造函数，构造流场图图层
     * @param view
     * @param res
     * @param decl
     */
    constructor(layer: CompUVDataLayer, decl: CompResourceRender);
    setDefaultParams(): void;
    setDefaultColors(): void;
    /** @inheritdoc */
    get factory(): any;
    /** @inheritdoc */
    get olLayer(): any;
    /**
     * 查询指定坐标的数据
     */
    query(x: number, y: number): any;
    updateImm(): void;
    clear(): void;
    /**
     * @inheritdoc
     */
    destroy(): void;
}
declare const CompFlowFieldRenderFactory: any;
/***
 * 大量的点图层
 */
declare class CompOverlaysRender extends CompTableDataRender {
    private _olGroup;
    private _overlays;
    private _source;
    constructor(layer: CompTableDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get factory(): any;
    /** @inheritdoc */
    get olLayer(): any;
    /**
     * 查询指定坐标的数据
     */
    query(x: number, y: number): void;
    /**
     * 清除所有对象
     */
    clear(): void;
    /**
     * 删除图层
     */
    destroy(): void;
    /**
     * @inheritdoc
     * @override
     * @param visible
     */
    setVisible(visible: boolean): void;
    updateImm(): void;
}
declare const CompOverlaysRenderFactory: any;
/**
 * 栅格图
 * 等值线，等值面图
 */
declare class CompPointIsoRender extends CompTableDataRender {
    private _raster;
    private _isoOnServer;
    constructor(layer: CompTableDataLayer, decl: CompResourceRender);
    get factory(): any;
    get olLayer(): any;
    /**
     * 查询指定坐标的数据
     */
    query(x: number, y: number): void;
    updateImm(): void;
    clear(): void;
    destroy(): void;
    private _GetImage;
    static fieldName2Index(field: number | string, fields: string[]): number;
    private _initIsoLine;
}
declare const CompPointIsoRenderFactory: any;
/***
 * 点绘制器
 */
declare class CompPointsRender extends CompTableDataRender {
    private _points;
    private _onMouseMoveHandle;
    private _tooltip;
    private _tooltipElement;
    private _tooltipPoint;
    private _renderFields;
    constructor(layer: CompTableDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get factory(): any;
    /** @inheritdoc */
    get olLayer(): any;
    /** @override */
    updateImm(): void;
    /** @override */
    clear(): any;
    /**
     * 删除图层
     */
    destroy(): void;
    /** 该绘制器有自己的tip事件处理 */
    queryTip(x: number, y: number, to?: number): CompTipValue;
    private _updateNormal;
    private _updateForEcharts;
    private static _tipOn;
    private _getStyle;
}
declare const CompPointRenderFactory: any;
/**
 * 栅格图
 * 等值线，等值面图
 */
declare abstract class CompRasterBaseRender extends CompRasterDataRender {
    protected _filter: OLE.FILTER;
    protected _raster: OLE.RasterLayer;
    constructor(layer: CompRasterDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get olLayer(): any;
    /**
     * @inheritdoc
     * @override
     */
    queryDisplay(x: number, y: number): {
        x: number;
        y: number;
        originValue: number;
        displayValue: number;
        rgba: number[];
        color: string;
    };
    /** @override */
    updateImm(): void;
    /**
     * 设置插值方法（过滤器）
     */
    set interpFilter(filter: OLE.FILTER);
    /** 获取插值方法（过滤器） */
    get interpFilter(): OLE.FILTER;
    /** @override */
    clear(): void;
    /** @override */
    destroy(): void;
    protected _getFormatter<T>(fmt: PropertyValueType<T>): (value: number) => T;
}
/** 等值线直接绘制 */
declare class CompRasterDirectRender extends CompRasterBaseRender {
    constructor(layer: CompRasterDataLayer, decl: RasterRender);
    /** @inheritdoc */
    get factory(): any;
}
declare const CompRasterDirectRenderFactory: any;
declare class CompRasterTextRender extends CompRasterBaseRender {
    constructor(layer: CompRasterDataLayer, decl: RasterTextRender);
    /** @inheritdoc */
    get factory(): any;
}
declare const CompRasterTextRenderFactory: any;
/**
 * 栅格图
 * 等值线，等值面图
 */
declare class CompRasterIsoRender extends CompRasterDataRender {
    private _raster;
    private _isoOnServer;
    constructor(layer: CompRasterDataLayer, decl: CompResourceRender);
    get factory(): any;
    get olLayer(): any;
    /** @override */
    updateImm(): void;
    /** @override */
    clear(): void;
    /** @override */
    destroy(): void;
    private _GetImage;
    private _initIsoLine;
}
declare const CompRasterIsoRenderFactory: any;
declare class CompHightLightScatter implements CompCustomDrawer {
    _point: any[];
    _x: number;
    _y: number;
    _style: OLE.PointStyle;
    constructor();
    setPoint(pt: any[], fx: number, fy: number, style: OLE.PointStyle): void;
    onCustomDraw(extent: number[], size: [number, number], resolution: number, pixelRatio: number, ctx: CanvasRenderingContext2D): void;
}
/***
 * 点绘制器
 */
declare class CompScatterRender extends CompTableDataRender {
    private _pointsDrawer;
    private _tooltipPoint;
    private _fieldValue;
    private _fieldX;
    private _fieldY;
    /** 正常样式 */
    private _styleNormal?;
    /** 高亮样式 */
    private _styleEmphasis?;
    constructor(layer: CompTableDataLayer, decl: CompResourceRender);
    /** @inheritdoc */
    get factory(): any;
    /** @inheritdoc */
    get olLayer(): any;
    updateImm(): void;
    clear(): any;
    /**
     * 删除图层
     */
    destroy(): void;
    queryTip(x: number, y: number, to?: number): CompTipValue;
    private _filter;
    private _initFilter;
    private _initStyle;
    private _getStyle;
}
declare const CompScatterRenderFactory: CompRenderFactory;
/**
 * 风矢图
 */
declare class CompStreamLineRender extends CompUVDataRender {
    private _stream;
    /** 构造风矢图绘制器 */
    constructor(layer: CompUVDataLayer, decl: CompResourceRender);
    get factory(): any;
    get olLayer(): any;
    /** @override */
    query(x: number, y: number): any[];
    /** @override */
    updateImm(): void;
    /** @override */
    clear(): void;
    /** @override */
    destroy(): void;
}
declare const CompStreamLineRenderFactory: CompRenderFactory;
/**
 * 瓦片图层
 * @deprecated
 * @see CompWtmsDataRender
 */
/**
 * 台风绘制器
 */
declare class CompTyphoonRender extends CompTableDataRender {
    private _typhoon;
    private _tooltipPoint;
    private _fieldX;
    private _fieldY;
    constructor(layer: CompTableDataLayer, decl: CompResourceRender);
    get factory(): CompRenderFactory;
    get olLayer(): any;
    updateImm(): void;
    clear(): void;
    destroy(): void;
    queryTip(x: number, y: number, to?: number): CompTipValue;
}
declare const CompTyphoonRenderFactory: CompRenderFactory;
/**
 * 风矢图
 */
declare class CompWindVectorRender extends CompUVDataRender {
    private _wind;
    /** 构造风矢图绘制器 */
    constructor(layer: CompUVDataLayer, decl: CompResourceRender);
    get factory(): any;
    get olLayer(): any;
    /** @override */
    query(x: number, y: number): any[];
    /** @override */
    updateImm(): void;
    /** @override */
    clear(): void;
    /** @override */
    destroy(): void;
}
declare const CompWindVectorRenderFactory: any;
/**
 * WMS 图层
 */
declare class CompWmsDataRender extends CompMapDataRender {
    private _wms;
    private _imageFlag;
    constructor(layer: CompMapDataLayer, decl: CompResourceRender);
    get factory(): any;
    get olLayer(): any;
    /** @ */
    updateImm(): void;
    /** @override */
    clear(): void;
    /** @override */
    destroy(): void;
    private _getImage;
}
declare class CompWmsHelp {
    minx: number;
    miny: number;
    maxx: number;
    maxy: number;
    west: number;
    east: number;
    south: number;
    north: number;
    width: number;
    height: number;
    bbox: string;
    size: string;
    constructor(extent: number[], resolution: number, pixelRatio: number, size: number[], proj: any);
}
declare const CompWmsDataRenderFactory: any;
/**
 * 瓦片图层
 */
declare class CompWtmsDataRender extends CompMapDataRender {
    private _tile;
    constructor(layer: CompMapDataLayer, decl: CompResourceRender);
    get factory(): any;
    get olLayer(): any;
    updateImm(): void;
    clear(): void;
    destroy(): void;
}
declare const CompWtmsDataRenderFactory: any;
/**
 * Smartbi数据集
 */
declare class CompCommonDataset extends CompResource {
    private exdata;
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据
     * @param time
     */
    load(option: LoadDataOption): void;
    changeDataSetType(type: URLType): void;
    /** 设置时效 */
    set futureTime(value: string);
    /** 获取时效 */
    get futureTime(): string;
}
interface CompMapDatasetCheckResult {
    ok: boolean;
    extent?: number[];
    projection?: string;
}
/**
 *
 */
declare abstract class CompMapDataset extends CompResource {
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据
     * @param time
     */
    load(option: LoadDataOption): void;
    /**
     * 检查数据是否有效
     * @param option
     * @returns
     */
    protected _checkData(option: LoadDataOption): Promise<CompMapDatasetCheckResult>;
    protected abstract _loadData(option: LoadDataOption, result: CompMapDatasetCheckResult): CompResourceMapData;
}
/**
 * 内存数据集
 */
declare class CompMemoryDataset extends CompResource {
    private exdata;
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据
     * @param time
     */
    load(option: LoadDataOption): void;
    changeDataSetType(type: URLType): void;
    /** 设置时效 */
    set futureTime(value: string);
    /** 获取时效 */
    get futureTime(): string;
    /**
     * 1 --> 001
     * @param str
     * @private
     */
    private fillNumber;
}
declare class CompMemoryRasterDataset extends CompResource {
    get dataType(): CompResourceDataType;
    load(option: LoadDataOption): void;
}
/**
 * Smartbi数据集
 */
declare class CompSmartbiDataset extends CompResource {
    private exdata;
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据
     */
    load(option: LoadDataOption): void;
    changeDataSetType(type: URLType): void;
    /** 设置时效 */
    set futureTime(value: string);
    /** 获取时效 */
    get futureTime(): string;
    /**
     * 1 --> 001
     * @param str
     * @private
     */
    private fillNumber;
    private pickFutureRealValue;
    private pickFutureURealValue;
    private pickFutureVRealValue;
    static SmartBiPrefix: string;
    /**
     * 获取smartbi主机
     */
    protected getAddress(): string;
    /**
     * 获取数据集ID
     */
    protected getDatasetID(): string;
}
declare class CompSmartbiRasterDataset extends CompSmartbiDataset {
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据
     */
    load(option: LoadDataOption): void;
}
declare class CompSmartbiUVRasterDataset extends CompSmartbiDataset {
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据集
     */
    load(option: LoadDataOption): void;
}
declare namespace SmartbiUtils {
    function asTable(option: LoadDataOption, e: SmartbiDatasetResult, fieldx: string | number, fieldy: string | number): void;
    function asRaster(option: LoadDataOption, tdata: CompResourceTable): void;
    function asRasterUV(option: LoadDataOption, tdata: CompResourceTable): void;
}
declare class CompSmartbiDatasetLocal extends CompResource {
    get dataType(): CompResourceDataType;
    load(option: LoadDataOption): void;
    asTable(option: LoadDataOption, rows: [][]): void;
}
declare class CompSmartbiRasterDatasetLocal extends CompSmartbiDatasetLocal {
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据
     */
    load(option: LoadDataOption): void;
}
declare class CompSmartbiUVRasterDatasetLocal extends CompSmartbiDatasetLocal {
    constructor(res: CompResourceDeclare);
    get dataType(): CompResourceDataType;
    /**
     * 加载数据集
     */
    load(option: LoadDataOption): void;
}
/**
 * @see CompWtmsMapDataset
 */
declare class CompWmsMapDataset extends CompMapDataset {
    constructor(res: CompResourceDeclare);
    protected _loadData(option: LoadDataOption, result: CompMapDatasetCheckResult): CompResourceMapData;
}
declare class CompWtmsMapDataset extends CompMapDataset {
    constructor(res: CompResourceDeclare);
    protected _loadData(option: LoadDataOption): CompResourceMapData;
}
interface ZMapServerError {
    success: boolean;
    service: string;
    path: string;
    msg: string;
    exception: string;
}
/**
 * ZMapServer Catalog
 */
interface ZMapCataLogInfo {
    attributes: {
        MiddleWare: string;
        url: string;
    } & object;
    descriptions: object;
}
interface ZMapTileDataInfo {
    crs: string;
    extent: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    };
}
declare enum ZMapMiddleWareEnum {
    LocalRawRaster = "LocalRawRaster",
    LocalBz2Raster = "LocalBz2Raster"
}
/**
 * ZMapServer 数据集
 */
declare class CompZMapServerCheck {
    private static Regx_zsMap;
    private static Regx_zsTileMap;
    private static Regx_CustomTags;
    private _url;
    private _server;
    private _catalog;
    private _query;
    private _infoURL;
    private _info;
    constructor(url: string);
    get url(): string;
    get server(): string;
    get catalog(): string;
    get info(): ZMapCataLogInfo;
    get isZMapServer(): boolean;
    checkHasData(): Promise<CompMapDatasetCheckResult>;
}
