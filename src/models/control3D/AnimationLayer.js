class EventHandler {
    constructor(eventType) {
        this.handle = {};
        this.eventType = eventType;
    }
    on(type, call) {
        if (!(type in this.handle)) {
            this.handle[type] = [];
        }
        this.handle[type].push(call);
    }
    off(type, func) {
        let handle = this.handle;
        if (!handle[type])
            return false;
        if (!func) {
            handle[type] = [];
            return true;
        }
        else {
            let index = handle[type].indexOf(item => item === func);
            if (index !== -1)
                handle[type].splice(index, 1);
            return true;
        }
    }
    offAll() {
        this.handle = {};
    }
    trigger(type, args = []) {
        if (this.handle[type]) {
            return this.handle[type].map(func => typeof func === 'function' && func(...args));
        }
    }
}
class FrameAnimation extends EventHandler {
    constructor(layers = [], interval = 500, step = "customLayerStep", opt) {
        super({
            "start": "start",
            "reset": "reset",
            "stop": "stop",
            "step": "step",
            "pre": "pre",
            "next": "next",
            "pause": "pause"
        });
        this._layers = layers;
        this._interval = interval;
        this._pause = true;
        // TODO 尚未实现是否循环播放，默认循环
        this._loop = true;
        // 计数器
        this._count = -1;
        // 定时器
        this._timer = null;
        this._statusenum = {
            RUNNING: "running",
            STOP: "stop",
        };
        this.functionenum = {
            customLayerStep: "customLayerStep"
        };
        this.stepFunction = step;
    }
    set layers(layers) {
        this._layers = layers;
    }
    get layers() {
        return this._layers;
    }
    set interval(interval) {
        this._interval = interval;
    }
    get interval() {
        return this._interval;
    }
    get status() {
        return this._pause ? this._statusenum.STOP : this._statusenum.RUNNING;
    }
    toggle() {
        return this._pause ? this.start() : this.pause();
    }
    pause() {
        this._pause = true;
        this.trigger(this.eventType.pause, [this]);
        return this;
    }
    start() {
        this._pause = false;
        this._createTimer();
        this.trigger(this.eventType.start, [this]);
        return this;
    }
    stop() {
        this._pause = true;
        this.trigger(this.eventType.stop, [this]);
        this._destroyTimer();
        this._hideAllLayer();
        this.offAll();
        return this;
    }
    reset() {
        this.stop();
        this._layers = [];
        this._count = -1;
    }
    _createTimer() {
        this._destroyTimer();
        this._timer = window.setTimeout(() => {
            this._loopMachine();
        }, this.interval);
    }
    _destroyTimer() {
        window.clearTimeout(this._timer);
        return this;
    }
    _loopMachine() {
        if (this._pause)
            return;
        this._count = (++this._count) % this._layers.length;
        let _count = this._count;
        switch (this.stepFunction) {
            case this.functionenum.customLayerStep:
                this.customLayerStep(_count);
            default:
                typeof this.stepFunction === "function" && this.stepFunction(this._count);
        }
        this._createTimer();
    }
    _hideAllLayer() {
        this._layers.map(layer => this.getCompLayer(layer).setVisible(false));
    }
    /// 执行自定义图层的分步操作
    customLayerStep(_count) {
        this._hideAllLayer();
        let currentLayer = this._layers[this._count];
        this.getCompLayer(currentLayer).setVisible(true);
        this.trigger(this.eventType.step, [currentLayer, this]);
    }
    getCompLayer(layer) {
        return layer;
    }
}
export class AnimationLayerManager {
    constructor(map) {
        this.compMap = map;
        if (!AnimationLayerManager.wrapElement) {
            const span = document.createElement('span');
            span.classList.add('zmap-info');
            document.body.appendChild(span);
            AnimationLayerManager.wrapElement = span;
        }
    }
    createAnimationLayer(layerDefine, opt, key = Date.now()) {
        opt = Object.assign({
            interval: 1000
        }, opt);
        const root = this.compMap.rootLayer;
        const layers = layerDefine.map(defi => {
            return CZMAPAPP.MapLoader.loadLayer(root, defi);
        });
        const frameAnimation = new FrameAnimation(layers, opt.interval, undefined, {});
        AnimationLayerManager.map.push({
            key: key,
            layers: layers,
            layer: frameAnimation
        });
        frameAnimation.on('step', (currentLayer) => {
            const text = currentLayer.define.format;
            AnimationLayerManager.wrapElement.innerText = text;
            AnimationLayerManager.wrapElement.style.display = 'block';
        });
        frameAnimation.start();
    }
    destroyAnimationLayer(key) {
        const findIndex = AnimationLayerManager.map.findIndex(item => item.key === key);
        const find = AnimationLayerManager.map[findIndex];
        const root = this.compMap.rootLayer;
        if (find) {
            find.layers.forEach(layer => {
                root.removeLayer(layer);
            });
            find.layers = [];
            find.layer.reset();
            AnimationLayerManager.map.splice(findIndex, 1);
            AnimationLayerManager.wrapElement.style.display = 'none';
        }
    }
}
AnimationLayerManager.map = [];
