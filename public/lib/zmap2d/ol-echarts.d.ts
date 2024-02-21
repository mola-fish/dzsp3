declare var ol: any;
declare var echarts: any;
declare type EventCallback = (e: Event) => void;
declare class EventDispatchOther {
    private _src;
    private _target;
    private _events;
    constructor(src: HTMLElement, tar: HTMLElement | EventCallback);
    bind(...events: string[]): void;
    unbind(event: string): void;
    unbindAll(): void;
    private _doDisp;
}
declare class OlEchartsLayer {
    private _map;
    private _view;
    private _layer;
    private _source;
    private _echarts;
    private _echartsDiv;
    private _echartsSetOption;
    private _echartsCanvas;
    private _memCanvas;
    private _memContext;
    private _memWidth;
    private _memHeight;
    private _memExtent;
    private _memRect;
    private _viewExtent;
    private _viewCenter;
    private _mapEventKey;
    private _mapCenterChangedKey;
    private _mapResChangedKey;
    private _dispOther;
    private _mutation;
    private _mapPan;
    /**
     * 构造一个 OlEchartsLayer
     * @param map OpenLayers map 对象
     * @param option echarts 的option
     */
    constructor(map: any, option: any);
    /**
     * 获取 openlayers 图层对象
     */
    readonly layer: any;
    /**
     * 获取图层是否可见
     */
    /**
    * 设置图层是否可见
    */
    visible: boolean;
    /**
     * 获取echarts的实例
     */
    readonly echartsInstance: any;
    /**
     * 设置echarts option
     * @param option
     */
    setOption(option: any, notMerge?: boolean, lazyUpdate?: boolean): void;
    setOptionInner(option: any, notMerge?: boolean, lazyUpdate?: boolean): void;
    /**
     * 销毁对象，销毁后，无法再使用
     */
    destroy(): any;
    /**
     * 创建内存 Canvas缓存
     */
    private _createMemoryCanvas;
    /**
     * 创建Openlayer 图层
     */
    private _createLayer;
    /**
     * 创建 echarts 对象
     */
    private _createEcharts;
    private _mutationEvent;
    private _bindEvents;
    static deepClone(source: any): any;
    /**
     * ImageCanvas数据源的处理回调函数
     * @param extent
     * @param resolution
     * @param pixelRatio
     * @param size
     * @param projection
     */
    private _canvasFunction;
    private _delayTimer;
    private _delayUpdateEcharts;
    private _echartsEntent;
    /**
     * 更新 echarts 地图位置
     */
    private _updateEcharts;
    /**
     * 开始绘制
     */
    private _render;
    /**
     * 单帧绘制
     */
    private _renderOneFrame;
}
