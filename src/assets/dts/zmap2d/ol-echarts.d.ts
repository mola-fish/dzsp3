/*!
 * 武汉兆图科技有限公司，版权所有
 **/
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
interface OlEchartsLayerOption {
    animation?: boolean;
    delayOnMouseMove?: number;
    noAddToMap?: boolean;
    optimizeScatter?: boolean;
    optimizeRadius?: number;
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
    private _mapMoveendKey;
    private _viewCenterKey;
    private _mapCenterChangedKey;
    private _mapResChangedKey;
    private _dispOther;
    private _mutation;
    private _mapPan;
    private _isMoving;
    private _option;
    private _echartsOption;
    private _echartsSeries;
    static current: OlEchartsLayer;
    constructor(map: any, echartsOption: any, option: OlEchartsLayerOption);
    get olMap(): any;
    get olView(): any;
    get layer(): any;
    get visible(): boolean;
    set visible(visible: boolean);
    get echartsInstance(): any;
    setOption(option: any, notMerge?: boolean, lazyUpdate?: boolean): void;
    setOptionInner(option: any, notMerge?: boolean, lazyUpdate?: boolean): void;
    destroy(): any;
    private _createMemoryCanvas;
    private _createLayer;
    private _createEcharts;
    private _mutationEvent;
    private _delayEvent;
    private _bindEvents;
    static deepClone(source: any): any;
    private _canvasFunction;
    private _delayTimer;
    private _delayUpdateEcharts;
    private _lastCenter;
    private _lastResolu;
    private _isNeedUpdate;
    private _updateEcharts;
    private _optimizeScatterData;
    private _tagPoint;
    private _render;
    private _renderOneFrame;
}
