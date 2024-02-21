import ComMap = CZMAP.ComMap;
import Layer = CZMAP.Layer;
declare class EventHandler {
    handle: any;
    eventType: any;
    constructor(eventType: any);
    on(type: any, call: any): void;
    off(type: any, func: any): boolean;
    offAll(): void;
    trigger(type: any, args?: any[]): any;
}
declare class FrameAnimation extends EventHandler {
    _layers: Array<Layer>;
    _interval: number;
    _pause: boolean;
    _loop: boolean;
    _count: number;
    _timer: number;
    _statusenum: any;
    functionenum: any;
    stepFunction: string | Function;
    constructor(layers: any[], interval: number, step: string, opt: any);
    set layers(layers: Layer[]);
    get layers(): Layer[];
    set interval(interval: number);
    get interval(): number;
    get status(): any;
    toggle(): this;
    pause(): this;
    start(): this;
    stop(): this;
    reset(): void;
    _createTimer(): void;
    _destroyTimer(): this;
    _loopMachine(): void;
    _hideAllLayer(): void;
    customLayerStep(_count: any): void;
    getCompLayer(layer: any): any;
}
export declare class AnimationLayerManager {
    private compMap;
    static map: Array<{
        key: PropertyKey;
        layers: Array<Layer>;
        layer: FrameAnimation;
    }>;
    static wrapElement: HTMLElement;
    constructor(map: ComMap);
    createAnimationLayer(layerDefine: Array<any>, opt: any, key?: PropertyKey): void;
    destroyAnimationLayer(key: PropertyKey): void;
}
export {};
