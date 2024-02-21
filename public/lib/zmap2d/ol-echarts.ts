
declare var ol:any;
declare var echarts:any;

type EventCallback = (e:Event)=>void;

class EventDispatchOther
{
    private _src:HTMLElement;
    private _target:HTMLElement | EventCallback;
    private _events = {};

    constructor(src:HTMLElement, tar:HTMLElement|EventCallback)
    {
        this._src = src;
        this._target = tar;
    }

    bind(...events:string[]):void 
    {
        events.forEach(event => {
            let cb = this._events[event] as EventCallback;
            if (cb) return;

            cb = (e:Event) => this._doDisp(e);
            this._src.addEventListener(event, cb);
            this._events[event] = cb;
        });
    }

    unbind(event:string):void
    {
        const cb = this._events[event] as EventCallback;
        if (!cb) return;

        this._src.removeEventListener(event, cb);
        delete this._events[event];
    }

    unbindAll():void
    {
        for (let evt in this._events)
        {
            console.info(evt);
            this.unbind(evt);
        }
    }

    private _doDisp(evt:Event)
    {
        let event:Event;
        if (evt instanceof WheelEvent)
        {
            event = new WheelEvent(evt.type, evt);
        }  
        else if (evt instanceof MouseEvent)
        {
            event = new MouseEvent(evt.type, evt);
        }
        else 
        {
            event = new Event(evt.type, evt);
        }

        ///
        if (this._target instanceof HTMLElement)
            this._target.dispatchEvent(event);
        else if (typeof this._target === 'function')
            this._target(event);
    } 
}

class OlEchartsLayer
{
    private _map:any;
    private _view:any;

    private _layer:any;
    private _source:any;

    /// 
    private _echarts;
    private _echartsDiv:HTMLDivElement;
    private _echartsSetOption: (option: any, notMerge?: boolean, lazyUpdate?: boolean) => void;

    /// echarts 的 Canvas 列表
    private _echartsCanvas:HTMLCanvasElement[];

    /// 内存Canvas
    private _memCanvas:HTMLCanvasElement;
    private _memContext: CanvasRenderingContext2D;
    private _memWidth:number;
    private _memHeight:number;
    private _memExtent: number[];
    private _memRect: number[] = [];

    /// 视图信息
    private _viewExtent:number[];
    private _viewCenter:[number,number];

    /// 
    private _mapEventKey :any;
    private _mapCenterChangedKey :any;
    private _mapResChangedKey :any;
    private _dispOther :EventDispatchOther
    private _mutation : MutationObserver;
    private _mapPan : any;
    
    /**
     * 构造一个 OlEchartsLayer
     * @param map OpenLayers map 对象
     * @param option echarts 的option
     */
    constructor(map:any, option:any)
    {
        this._map = map;
        this._view = map.getView();

        /// 
        this._viewCenter = this._view.getCenter();
        this._viewExtent = this._view.calculateExtent(this._map.getSize());

        /// 
        map.getInteractions().forEach((element:any) => {
            if (element instanceof ol.interaction.DragPan) {
                this._mapPan = element;
            }
        });

        /// 
        this._createMemoryCanvas();
        this._createLayer();
        this._createEcharts();

        ///
        this.setOption(option);

        /// 
        this._render();

        /// 
        this._mapEventKey = this._map.on('moveend', () => this._updateEcharts());
        this._mapCenterChangedKey = this._view.on('change:center', () => this._delayUpdateEcharts());
        this._mapResChangedKey = this._view.on('change:resolution', () => this._delayUpdateEcharts());
    }

    /**
     * 获取 openlayers 图层对象
     */
    get layer() { return this._layer; }

    /**
     * 获取图层是否可见
     */
    get visible() { return this._layer.getVisible(); }

    /**
     * 设置图层是否可见
     */
    set visible(visible:boolean) { this._layer.setVisible(visible); }

    /**
     * 获取echarts的实例
     */
    get echartsInstance() { return this._echarts; }

    /**
     * 设置echarts option
     * @param option 
     */
    setOption(option: any, notMerge?: boolean, lazyUpdate?: boolean)
    {
        ///
        if (!this._echarts) return;

        ///
        const [vleft, vbottom, vright, vtop] = this._viewExtent;

        ///
        option = OlEchartsLayer.deepClone(option);

        /// 关闭 echarts 的动画效果
        option.animation = false;
        /// 设置 echarts 的地图组件的的位置信息
        option.geo = Object.assign(option.geo || {}, {
            /// 设置纵横比
            aspectScale:1.0,
            /// 不适用echarts的 zoom功能
            zoom: 1,
            /// 禁用echarts的漫游功能
            roam: false,
            /// 设置边界为 0 
            left:0, top:0,right:0,bottom:0,
            /// 视图中心
            center: this._viewCenter,
            /// 左上角和右下角
            boundingCoords:[[vleft,vtop],[vright,vbottom]]
        });

        function setZLevel(layer:any)
        {
            /// 
            if (layer === null || layer === undefined) return;

            ///
            if (Array.isArray(layer))
            {
                layer.forEach(setZLevel);
                return;
            }

            ///
            if (layer.zlevel && layer.zlevel < 9999)
                layer.zlevel = layer.zlevel + 9999;
            else 
                layer.zlevel = 9999;
            return;
        }

        function setZLevelOption(option:any, item:any)
        {
            const layer = option[item];
            if (!layer) 
            {
                option[item] = { zlevel : 9999 }
                return;
            }

            ///
            setZLevel(layer);
        }

        function setSeriesZLevel(s:any)
        {
            if (s === undefined || s === null) return;
            if (s.type === undefined) return;

            /// 
            if (s.type === 'scatter')
            {
                s.large = true;
                s.largeThreshold = 20000;
            }

            ///
            if (s.type === 'map' || s.coordinateSystem === 'geo') return;

            ///
            setZLevel(s);
        }

        setZLevelOption(option, 'title');
        setZLevelOption(option, 'legend');
        setZLevelOption(option, 'visualMap');
        setZLevelOption(option, 'toolbox');
        setZLevelOption(option, 'grid');
        
        setZLevel(option.xAxis);
        setZLevel(option.yAxis);
        setZLevel(option.radiusAxis);
        setZLevel(option.angleAxis);
        setZLevel(option.radar);
        setZLevel(option.polar);
        if (Array.isArray(option.series))
            option.series.forEach(setSeriesZLevel);
        else 
            setSeriesZLevel(option.series);

        /// 设置echarts参数
        this.setOptionInner(option, notMerge, lazyUpdate);
        
        ///
        this._echartsCanvas = [];
        const cvss = this._echartsDiv.firstChild.childNodes;
        for (let i = 0; i < cvss.length; ++i)
        {
            const canvas = cvss[i] as HTMLCanvasElement;
            const id = canvas.getAttribute('data-zr-dom-id');
            const idnum = parseFloat(id.substr(3));
            if (idnum >= 9999)
                continue;
            
            ///
            canvas.style.display = 'none';
            this._echartsCanvas.push(canvas);
        }
    }

    setOptionInner(option: any, notMerge?: boolean, lazyUpdate?: boolean)
    {
        this._echartsSetOption.call(this._echarts, option, notMerge, lazyUpdate);
    }

    /**
     * 销毁对象，销毁后，无法再使用
     */
    destroy()
    {
        if (!this._echarts) return;

        ///
        ol.Observable.unByKey(this._mapEventKey);
        ol.Observable.unByKey(this._mapCenterChangedKey);
        ol.Observable.unByKey(this._mapResChangedKey);

        ///
        this._mutation.disconnect();
        this._dispOther.unbindAll();

        ///
        this._echarts.dispose();
        this._echarts = null;
        
        ///
        this._echartsCanvas = null;
        this._echartsDiv && this._echartsDiv.parentNode && this._echartsDiv.parentNode.removeChild(this._echartsDiv);
        this._echartsDiv = null;

        ///
        this._map.removeLayer(this._layer);
        this._layer = null;
        this._source = null;

        /// 
        this._memContext = null;
        this._memCanvas = null;

        /// 
        return null;
    }

    /**
     * 创建内存 Canvas缓存
     */
    private _createMemoryCanvas()
    {
        this._memCanvas = document.createElement('CANVAS') as HTMLCanvasElement;
        this._memContext = this._memCanvas.getContext('2d');
    }

    /**
     * 创建Openlayer 图层
     */
    private _createLayer()
    {
        /// 数据源
        this._source = new ol.source.ImageCanvas({
            canvasFunction: (e:any, r:any, p:any, s:any, proj:any) => this._canvasFunction(e,r,p,s,proj),
            projection: this._view.getProjection()
        });

        /// 图层
        this._layer = new ol.layer.Image({ source : this._source});

        /// 
        this._map.addLayer(this._layer);
    }

    /**
     * 创建 echarts 对象
     */
    private _createEcharts()
    {
        /// 
        if (!echarts || typeof(echarts.init) !== 'function')
        {
            console.error('没有引用echarts库，请引用echarts库！！！');
            return;
        }

        /// 创建 echarts DIV
        this._echartsDiv = document.createElement('DIV') as HTMLDivElement;

        /// 插入到地图之前
        const mapVP:HTMLDivElement = this._map.getViewport();
        mapVP.append(this._echartsDiv);

        ///
        this._bindEvents();
        
        /// 设置样式
        Object.assign(this._echartsDiv.style, { 
            position: 'absolute', 
            height: '100%',
            width: '100%',
            pointerEvents: 'none',
            //display : 'none',
            top : '0px'
        });

        /// 创建echarts 对象
        this._echarts = echarts.init(this._echartsDiv);
        this._echartsSetOption = this._echarts.setOption;
        this._echarts.setOption = (option: any, notMerge?: boolean, lazyUpdate?: boolean) => {
            this.setOption(option, notMerge, lazyUpdate);
        };

        /// 监听样式改变
        this._mutation = new MutationObserver((e) => this._mutationEvent(e));
        this._mutation.observe(this._echartsDiv.firstChild, { attributes: true, attributeFilter:['style']});
    }

    private _mutationEvent(mlist:MutationRecord[])
    {
        if (mlist.length == 0) return;

        const mapVP:HTMLDivElement = this._map.getViewport();
        const div = mlist[0].target as HTMLElement;
        mapVP.style.cursor = div.style.cursor;
        if (this._mapPan)
        {
            this._mapPan.setActive(div.style.cursor === 'default');
        }
    }

    private _bindEvents()
    {
        const disp = (evt:Event) => { 
            ///
            const ch = this._echartsDiv.children;
            const chlen = ch.length;
            for (let i = 0; i < chlen; ++i)
            {
                const c = ch[i];
                if (evt.target === c) continue;

                ///
                if (c.nodeName === 'DIV')
                    c.dispatchEvent(evt);
            }
        }
        ///
        const mapVP:HTMLDivElement = this._map.getViewport();
        const canvas:HTMLCanvasElement = mapVP.querySelector('canvas.ol-unselectable');
        this._dispOther = new EventDispatchOther(canvas, disp);
        this._dispOther.bind('click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mousewheel', 'mouseenter', 'mouselevel', 'mousemove', 'mouseover', 'mouseout', 'selectstart');
    }

    public static deepClone(source)
    {
        const BUILTIN_OBJECT = {
            '[object Function]': 1,
            '[object RegExp]': 1,
            '[object Date]': 1,
            '[object Error]': 1,
            '[object CanvasGradient]': 1,
            '[object CanvasPattern]': 1,
            // For node-canvas
            '[object Image]': 1,
            '[object Canvas]': 1
        };
        
        const TYPED_ARRAY = {
            '[object Int8Array]': 1,
            '[object Uint8Array]': 1,
            '[object Uint8ClampedArray]': 1,
            '[object Int16Array]': 1,
            '[object Uint16Array]': 1,
            '[object Int32Array]': 1,
            '[object Uint32Array]': 1,
            '[object Float32Array]': 1,
            '[object Float64Array]': 1
        };
        
        const objToString = Object.prototype.toString;
        const primitiveKey = '__ec_primitive__';

        function isPrimitive(obj:any) {
            return obj[primitiveKey];
        }

        function isDom(value:any) {
            return typeof value === 'object'
                && typeof value.nodeType === 'number'
                && typeof value.ownerDocument === 'object';
        }

        if (source == null || typeof source != 'object') {
            return source;
        }
    
        var result = source;
        var typeStr = objToString.call(source);
    
        if (typeStr === '[object Array]') {
            if (!isPrimitive(source)) {
                result = [];
                for (var i = 0, len = source.length; i < len; i++) {
                    result[i] = OlEchartsLayer.deepClone(source[i]);
                }
            }
        }
        else if (TYPED_ARRAY[typeStr]) {
            if (!isPrimitive(source)) {
                var Ctor = source.constructor;
                if (source.constructor.from) {
                    result = Ctor.from(source);
                }
                else {
                    result = new Ctor(source.length);
                    for (var i = 0, len = source.length; i < len; i++) {
                        result[i] = OlEchartsLayer.deepClone(source[i]);
                    }
                }
            }
        }
        else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
            result = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = OlEchartsLayer.deepClone(source[key]);
                }
            }
        }
    
        return result;
    }

    /**
     * ImageCanvas数据源的处理回调函数 
     * @param extent 
     * @param resolution 
     * @param pixelRatio 
     * @param size 
     * @param projection 
     */
    private _canvasFunction(extent:number[], resolution:any, pixelRatio:any, size:[number,number], projection:any) 
    {
        this._memCanvas.width = this._memWidth = size[0];
        this._memCanvas.height = this._memHeight = size[1];
        this._memExtent = extent;

        ///
        this._updateEcharts(true);

        ///
        return this._memCanvas;
    }

    private _delayTimer:number = 0;
    private _delayUpdateEcharts()
    {
        if (this._delayTimer) clearTimeout(this._delayTimer);

        ///
        this._delayTimer = setTimeout(() => this._updateEcharts(), 500);
    }

    private _echartsEntent = [];

    /**
     * 更新 echarts 地图位置
     */
    private _updateEcharts(force?:boolean)
    {
        ///
        if (!this._echarts) return;
        if (!force && ol.extent.equals(this._echartsEntent, this._viewExtent)) return;

        /// 
        ol.extent.buffer(this._viewExtent, 0, this._echartsEntent);

        /// 
        const [vleft, vbottom, vright, vtop] = this._viewExtent;
        const [left, bottom, right, top] = this._memExtent;
        const xScale = this._memWidth / (right - left); //画布尺寸与坐标投影比
        const yScale = this._memHeight / (top - bottom);

        ///
        this._memRect[0] = (vleft - left) * xScale;
        this._memRect[1] = (top - vtop) * yScale;
        this._memRect[2] = (vright - vleft) * xScale;
        this._memRect[3] = (vtop - vbottom) * yScale;

        /// 
        console.info('_updateEcharts');

        ///
        this.setOptionInner({geo:{
            /// 视图中心
            center: this._viewCenter,
            /// 左上角和右下角
            boundingCoords:[[vleft,vtop],[vright,vbottom]]
        }});
    }

    /**
     * 开始绘制
     */
    private _render()
    {
        ///
        if (!this._echarts) return;

        ///
        this._renderOneFrame();
        requestAnimationFrame(() => this._render());
    }

    /**
     * 单帧绘制
     */
    private _renderOneFrame()
    {
        if (!this._memExtent) return;

        /// 
        this._viewCenter = this._view.getCenter();
        this._viewExtent = this._view.calculateExtent(this._map.getSize());

        /// 清空
        this._memContext.clearRect(0,0, this._memWidth, this._memHeight);

        /// 复制
        const [x0, y0, cw, ch] = this._memRect;
        this._echartsCanvas.forEach(c => this._memContext.drawImage(c, 0, 0, c.width, c.height, x0, y0, cw, ch));

        /// 
        this._map.render();
    }
}