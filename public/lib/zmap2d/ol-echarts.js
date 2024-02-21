var EventDispatchOther = /** @class */ (function () {
    function EventDispatchOther(src, tar) {
        this._events = {};
        this._src = src;
        this._target = tar;
    }
    EventDispatchOther.prototype.bind = function () {
        var _this = this;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        events.forEach(function (event) {
            var cb = _this._events[event];
            if (cb)
                return;
            cb = function (e) { return _this._doDisp(e); };
            _this._src.addEventListener(event, cb);
            _this._events[event] = cb;
        });
    };
    EventDispatchOther.prototype.unbind = function (event) {
        var cb = this._events[event];
        if (!cb)
            return;
        this._src.removeEventListener(event, cb);
        delete this._events[event];
    };
    EventDispatchOther.prototype.unbindAll = function () {
        for (var evt in this._events) {
            console.info(evt);
            this.unbind(evt);
        }
    };
    EventDispatchOther.prototype._doDisp = function (evt) {
        var event;
        if (evt instanceof WheelEvent) {
            event = new WheelEvent(evt.type, evt);
        }
        else if (evt instanceof MouseEvent) {
            event = new MouseEvent(evt.type, evt);
        }
        else {
            event = new Event(evt.type, evt);
        }
        ///
        if (this._target instanceof HTMLElement)
            this._target.dispatchEvent(event);
        else if (typeof this._target === 'function')
            this._target(event);
    };
    return EventDispatchOther;
}());
var OlEchartsLayer = /** @class */ (function () {
    /**
     * 构造一个 OlEchartsLayer
     * @param map OpenLayers map 对象
     * @param option echarts 的option
     */
    function OlEchartsLayer(map, option) {
        var _this = this;
        this._memRect = [];
        this._delayTimer = 0;
        this._echartsEntent = [];
        this._map = map;
        this._view = map.getView();
        /// 
        this._viewCenter = this._view.getCenter();
        this._viewExtent = this._view.calculateExtent(this._map.getSize());
        /// 
        map.getInteractions().forEach(function (element) {
            if (element instanceof ol.interaction.DragPan) {
                _this._mapPan = element;
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
        this._mapEventKey = this._map.on('moveend', function () { return _this._updateEcharts(); });
        this._mapCenterChangedKey = this._view.on('change:center', function () { return _this._delayUpdateEcharts(); });
        this._mapResChangedKey = this._view.on('change:resolution', function () { return _this._delayUpdateEcharts(); });
    }
    Object.defineProperty(OlEchartsLayer.prototype, "layer", {
        /**
         * 获取 openlayers 图层对象
         */
        get: function () { return this._layer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OlEchartsLayer.prototype, "visible", {
        /**
         * 获取图层是否可见
         */
        get: function () { return this._layer.getVisible(); },
        /**
         * 设置图层是否可见
         */
        set: function (visible) { this._layer.setVisible(visible); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OlEchartsLayer.prototype, "echartsInstance", {
        /**
         * 获取echarts的实例
         */
        get: function () { return this._echarts; },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置echarts option
     * @param option
     */
    OlEchartsLayer.prototype.setOption = function (option, notMerge, lazyUpdate) {
        ///
        if (!this._echarts)
            return;
        ///
        var _a = this._viewExtent, vleft = _a[0], vbottom = _a[1], vright = _a[2], vtop = _a[3];
        ///
        option = OlEchartsLayer.deepClone(option);
        /// 关闭 echarts 的动画效果
        option.animation = false;
        /// 设置 echarts 的地图组件的的位置信息
        option.geo = Object.assign(option.geo || {}, {
            /// 设置纵横比
            aspectScale: 1.0,
            /// 不适用echarts的 zoom功能
            zoom: 1,
            /// 禁用echarts的漫游功能
            roam: false,
            /// 设置边界为 0 
            left: 0, top: 0, right: 0, bottom: 0,
            /// 视图中心
            center: this._viewCenter,
            /// 左上角和右下角
            boundingCoords: [[vleft, vtop], [vright, vbottom]]
        });
        function setZLevel(layer) {
            /// 
            if (layer === null || layer === undefined)
                return;
            ///
            if (Array.isArray(layer)) {
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
        function setZLevelOption(option, item) {
            var layer = option[item];
            if (!layer) {
                option[item] = { zlevel: 9999 };
                return;
            }
            ///
            setZLevel(layer);
        }
        function setSeriesZLevel(s) {
            if (s === undefined || s === null)
                return;
            if (s.type === undefined)
                return;
            /// 
            if (s.type === 'scatter') {
                s.large = true;
                s.largeThreshold = 20000;
            }
            ///
            if (s.type === 'map' || s.coordinateSystem === 'geo')
                return;
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
        var cvss = this._echartsDiv.firstChild.childNodes;
        for (var i = 0; i < cvss.length; ++i) {
            var canvas = cvss[i];
            var id = canvas.getAttribute('data-zr-dom-id');
            var idnum = parseFloat(id.substr(3));
            if (idnum >= 9999)
                continue;
            ///
            canvas.style.display = 'none';
            this._echartsCanvas.push(canvas);
        }
    };
    OlEchartsLayer.prototype.setOptionInner = function (option, notMerge, lazyUpdate) {
        this._echartsSetOption.call(this._echarts, option, notMerge, lazyUpdate);
    };
    /**
     * 销毁对象，销毁后，无法再使用
     */
    OlEchartsLayer.prototype.destroy = function () {
        if (!this._echarts)
            return;
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
    };
    /**
     * 创建内存 Canvas缓存
     */
    OlEchartsLayer.prototype._createMemoryCanvas = function () {
        this._memCanvas = document.createElement('CANVAS');
        this._memContext = this._memCanvas.getContext('2d');
    };
    /**
     * 创建Openlayer 图层
     */
    OlEchartsLayer.prototype._createLayer = function () {
        var _this = this;
        /// 数据源
        this._source = new ol.source.ImageCanvas({
            canvasFunction: function (e, r, p, s, proj) { return _this._canvasFunction(e, r, p, s, proj); },
            projection: this._view.getProjection()
        });
        /// 图层
        this._layer = new ol.layer.Image({ source: this._source });
        /// 
        this._map.addLayer(this._layer);
    };
    /**
     * 创建 echarts 对象
     */
    OlEchartsLayer.prototype._createEcharts = function () {
        var _this = this;
        /// 
        if (!echarts || typeof (echarts.init) !== 'function') {
            console.error('没有引用echarts库，请引用echarts库！！！');
            return;
        }
        /// 创建 echarts DIV
        this._echartsDiv = document.createElement('DIV');
        /// 插入到地图之前
        var mapVP = this._map.getViewport();
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
            top: '0px'
        });
        /// 创建echarts 对象
        this._echarts = echarts.init(this._echartsDiv);
        this._echartsSetOption = this._echarts.setOption;
        this._echarts.setOption = function (option, notMerge, lazyUpdate) {
            _this.setOption(option, notMerge, lazyUpdate);
        };
        /// 监听样式改变
        this._mutation = new MutationObserver(function (e) { return _this._mutationEvent(e); });
        this._mutation.observe(this._echartsDiv.firstChild, { attributes: true, attributeFilter: ['style'] });
    };
    OlEchartsLayer.prototype._mutationEvent = function (mlist) {
        if (mlist.length == 0)
            return;
        var mapVP = this._map.getViewport();
        var div = mlist[0].target;
        mapVP.style.cursor = div.style.cursor;
        if (this._mapPan) {
            this._mapPan.setActive(div.style.cursor === 'default');
        }
    };
    OlEchartsLayer.prototype._bindEvents = function () {
        var _this = this;
        var disp = function (evt) {
            ///
            var ch = _this._echartsDiv.children;
            var chlen = ch.length;
            for (var i = 0; i < chlen; ++i) {
                var c = ch[i];
                if (evt.target === c)
                    continue;
                ///
                if (c.nodeName === 'DIV')
                    c.dispatchEvent(evt);
            }
        };
        ///
        var mapVP = this._map.getViewport();
        var canvas = mapVP.querySelector('canvas.ol-unselectable');
        this._dispOther = new EventDispatchOther(canvas, disp);
        this._dispOther.bind('click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mousewheel', 'mouseenter', 'mouselevel', 'mousemove', 'mouseover', 'mouseout', 'selectstart');
    };
    OlEchartsLayer.deepClone = function (source) {
        var BUILTIN_OBJECT = {
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
        var TYPED_ARRAY = {
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
        var objToString = Object.prototype.toString;
        var primitiveKey = '__ec_primitive__';
        function isPrimitive(obj) {
            return obj[primitiveKey];
        }
        function isDom(value) {
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
    };
    /**
     * ImageCanvas数据源的处理回调函数
     * @param extent
     * @param resolution
     * @param pixelRatio
     * @param size
     * @param projection
     */
    OlEchartsLayer.prototype._canvasFunction = function (extent, resolution, pixelRatio, size, projection) {
        this._memCanvas.width = this._memWidth = size[0];
        this._memCanvas.height = this._memHeight = size[1];
        this._memExtent = extent;
        ///
        this._updateEcharts(true);
        ///
        return this._memCanvas;
    };
    OlEchartsLayer.prototype._delayUpdateEcharts = function () {
        var _this = this;
        if (this._delayTimer)
            clearTimeout(this._delayTimer);
        ///
        this._delayTimer = setTimeout(function () { return _this._updateEcharts(); }, 500);
    };
    /**
     * 更新 echarts 地图位置
     */
    OlEchartsLayer.prototype._updateEcharts = function (force) {
        ///
        if (!this._echarts)
            return;
        if (!force && ol.extent.equals(this._echartsEntent, this._viewExtent))
            return;
        /// 
        ol.extent.buffer(this._viewExtent, 0, this._echartsEntent);
        /// 
        var _a = this._viewExtent, vleft = _a[0], vbottom = _a[1], vright = _a[2], vtop = _a[3];
        var _b = this._memExtent, left = _b[0], bottom = _b[1], right = _b[2], top = _b[3];
        var xScale = this._memWidth / (right - left); //画布尺寸与坐标投影比
        var yScale = this._memHeight / (top - bottom);
        ///
        this._memRect[0] = (vleft - left) * xScale;
        this._memRect[1] = (top - vtop) * yScale;
        this._memRect[2] = (vright - vleft) * xScale;
        this._memRect[3] = (vtop - vbottom) * yScale;
        /// 
        console.info('_updateEcharts');
        ///
        this.setOptionInner({ geo: {
                /// 视图中心
                center: this._viewCenter,
                /// 左上角和右下角
                boundingCoords: [[vleft, vtop], [vright, vbottom]]
            } });
    };
    /**
     * 开始绘制
     */
    OlEchartsLayer.prototype._render = function () {
        var _this = this;
        ///
        if (!this._echarts)
            return;
        ///
        this._renderOneFrame();
        requestAnimationFrame(function () { return _this._render(); });
    };
    /**
     * 单帧绘制
     */
    OlEchartsLayer.prototype._renderOneFrame = function () {
        var _this = this;
        if (!this._memExtent)
            return;
        /// 
        this._viewCenter = this._view.getCenter();
        this._viewExtent = this._view.calculateExtent(this._map.getSize());
        /// 清空
        this._memContext.clearRect(0, 0, this._memWidth, this._memHeight);
        /// 复制
        var _a = this._memRect, x0 = _a[0], y0 = _a[1], cw = _a[2], ch = _a[3];
        this._echartsCanvas.forEach(function (c) { return _this._memContext.drawImage(c, 0, 0, c.width, c.height, x0, y0, cw, ch); });
        /// 
        this._map.render();
    };
    return OlEchartsLayer;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2wtZWNoYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9sLWVjaGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7SUFNSSw0QkFBWSxHQUFlLEVBQUUsR0FBNkI7UUFGbEQsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUlqQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztJQUN2QixDQUFDO0lBRUQsaUNBQUksR0FBSjtRQUFBLGlCQVVDO1FBVkksZ0JBQWtCO2FBQWxCLFVBQWtCLEVBQWxCLHFCQUFrQixFQUFsQixJQUFrQjtZQUFsQiwyQkFBa0I7O1FBRW5CLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQ2hCLElBQUksRUFBRSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFrQixDQUFDO1lBQzlDLElBQUksRUFBRTtnQkFBRSxPQUFPO1lBRWYsRUFBRSxHQUFHLFVBQUMsQ0FBTyxJQUFLLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBZixDQUFlLENBQUM7WUFDbEMsS0FBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsbUNBQU0sR0FBTixVQUFPLEtBQVk7UUFFZixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBa0IsQ0FBQztRQUNoRCxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU87UUFFaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxzQ0FBUyxHQUFUO1FBRUksS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUM1QjtZQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFTyxvQ0FBTyxHQUFmLFVBQWdCLEdBQVM7UUFFckIsSUFBSSxLQUFXLENBQUM7UUFDaEIsSUFBSSxHQUFHLFlBQVksVUFBVSxFQUM3QjtZQUNJLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDO2FBQ0ksSUFBSSxHQUFHLFlBQVksVUFBVSxFQUNsQztZQUNJLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDO2FBRUQ7WUFDSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNwQztRQUVELEdBQUc7UUFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksV0FBVztZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNqQyxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxVQUFVO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQWhFRCxJQWdFQztBQUVEO0lBb0NJOzs7O09BSUc7SUFDSCx3QkFBWSxHQUFPLEVBQUUsTUFBVTtRQUEvQixpQkErQkM7UUFsRE8sYUFBUSxHQUFhLEVBQUUsQ0FBQztRQTZieEIsZ0JBQVcsR0FBVSxDQUFDLENBQUM7UUFTdkIsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFqYnhCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRTNCLElBQUk7UUFDSixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbkUsSUFBSTtRQUNKLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFXO1lBQ3RDLElBQUksT0FBTyxZQUFZLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO2dCQUMzQyxLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzthQUMxQjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSTtRQUNKLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdEIsR0FBRztRQUNILElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkIsSUFBSTtRQUNKLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVmLElBQUk7UUFDSixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLGNBQWMsRUFBRSxFQUFyQixDQUFxQixDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEVBQTFCLENBQTBCLENBQUMsQ0FBQztRQUM3RixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUExQixDQUEwQixDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUtELHNCQUFJLGlDQUFLO1FBSFQ7O1dBRUc7YUFDSCxjQUFjLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBS25DLHNCQUFJLG1DQUFPO1FBSFg7O1dBRUc7YUFDSCxjQUFnQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxEOztXQUVHO2FBQ0gsVUFBWSxPQUFlLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FMZjtJQVVsRCxzQkFBSSwyQ0FBZTtRQUhuQjs7V0FFRzthQUNILGNBQXdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRS9DOzs7T0FHRztJQUNILGtDQUFTLEdBQVQsVUFBVSxNQUFXLEVBQUUsUUFBa0IsRUFBRSxVQUFvQjtRQUUzRCxHQUFHO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUUzQixHQUFHO1FBQ0csSUFBQSxxQkFBaUQsRUFBaEQsYUFBSyxFQUFFLGVBQU8sRUFBRSxjQUFNLEVBQUUsWUFBd0IsQ0FBQztRQUV4RCxHQUFHO1FBQ0gsTUFBTSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUMsb0JBQW9CO1FBQ3BCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLDBCQUEwQjtRQUMxQixNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUU7WUFDekMsU0FBUztZQUNULFdBQVcsRUFBQyxHQUFHO1lBQ2Ysc0JBQXNCO1lBQ3RCLElBQUksRUFBRSxDQUFDO1lBQ1Asa0JBQWtCO1lBQ2xCLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWTtZQUNaLElBQUksRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDO1lBQzlCLFFBQVE7WUFDUixNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDeEIsV0FBVztZQUNYLGNBQWMsRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQztRQUVILFNBQVMsU0FBUyxDQUFDLEtBQVM7WUFFeEIsSUFBSTtZQUNKLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUztnQkFBRSxPQUFPO1lBRWxELEdBQUc7WUFDSCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQ3hCO2dCQUNJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU87YUFDVjtZQUVELEdBQUc7WUFDSCxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJO2dCQUNuQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOztnQkFFbkMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDeEIsT0FBTztRQUNYLENBQUM7UUFFRCxTQUFTLGVBQWUsQ0FBQyxNQUFVLEVBQUUsSUFBUTtZQUV6QyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssRUFDVjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUcsSUFBSSxFQUFFLENBQUE7Z0JBQ2hDLE9BQU87YUFDVjtZQUVELEdBQUc7WUFDSCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVELFNBQVMsZUFBZSxDQUFDLENBQUs7WUFFMUIsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFDMUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVM7Z0JBQUUsT0FBTztZQUVqQyxJQUFJO1lBQ0osSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFDeEI7Z0JBQ0ksQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7YUFDNUI7WUFFRCxHQUFHO1lBQ0gsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEtBQUssS0FBSztnQkFBRSxPQUFPO1lBRTdELEdBQUc7WUFDSCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUVELGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsQyxlQUFlLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3JDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsZUFBZSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVoQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QixTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7WUFFdkMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuQyxlQUFlO1FBQ2YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWxELEdBQUc7UUFDSCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQ3BDO1lBQ0ksSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBc0IsQ0FBQztZQUM1QyxJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDakQsSUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLEtBQUssSUFBSSxJQUFJO2dCQUNiLFNBQVM7WUFFYixHQUFHO1lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztJQUVELHVDQUFjLEdBQWQsVUFBZSxNQUFXLEVBQUUsUUFBa0IsRUFBRSxVQUFvQjtRQUVoRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxnQ0FBTyxHQUFQO1FBRUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUUzQixHQUFHO1FBQ0gsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRTlDLEdBQUc7UUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFNUIsR0FBRztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFckIsR0FBRztRQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV4QixHQUFHO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXBCLElBQUk7UUFDSixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUV2QixJQUFJO1FBQ0osT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssNENBQW1CLEdBQTNCO1FBRUksSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztRQUN4RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRDs7T0FFRztJQUNLLHFDQUFZLEdBQXBCO1FBQUEsaUJBYUM7UUFYRyxPQUFPO1FBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ3JDLGNBQWMsRUFBRSxVQUFDLENBQUssRUFBRSxDQUFLLEVBQUUsQ0FBSyxFQUFFLENBQUssRUFBRSxJQUFRLElBQUssT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsRUFBbEMsQ0FBa0M7WUFDNUYsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU07UUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUcsSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFFM0QsSUFBSTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSyx1Q0FBYyxHQUF0QjtRQUFBLGlCQXVDQztRQXJDRyxJQUFJO1FBQ0osSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFVBQVUsRUFDbkQ7WUFDSSxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDN0MsT0FBTztTQUNWO1FBRUQsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQW1CLENBQUM7UUFFbkUsV0FBVztRQUNYLElBQU0sS0FBSyxHQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRS9CLEdBQUc7UUFDSCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbkIsUUFBUTtRQUNSLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7WUFDbEMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUUsTUFBTTtZQUNiLGFBQWEsRUFBRSxNQUFNO1lBQ3JCLG1CQUFtQjtZQUNuQixHQUFHLEVBQUcsS0FBSztTQUNkLENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxVQUFDLE1BQVcsRUFBRSxRQUFrQixFQUFFLFVBQW9CO1lBQzVFLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7UUFFRixVQUFVO1FBQ1YsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUVPLHVDQUFjLEdBQXRCLFVBQXVCLEtBQXNCO1FBRXpDLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQUUsT0FBTztRQUU5QixJQUFNLEtBQUssR0FBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBcUIsQ0FBQztRQUMzQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN0QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQ2hCO1lBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUM7U0FDMUQ7SUFDTCxDQUFDO0lBRU8sb0NBQVcsR0FBbkI7UUFBQSxpQkFxQkM7UUFuQkcsSUFBTSxJQUFJLEdBQUcsVUFBQyxHQUFTO1lBQ25CLEdBQUc7WUFDSCxJQUFNLEVBQUUsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQzlCO2dCQUNJLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUM7b0JBQUUsU0FBUztnQkFFL0IsR0FBRztnQkFDSCxJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssS0FBSztvQkFDcEIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1QjtRQUNMLENBQUMsQ0FBQTtRQUNELEdBQUc7UUFDSCxJQUFNLEtBQUssR0FBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxJQUFNLE1BQU0sR0FBcUIsS0FBSyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNwTCxDQUFDO0lBRWEsd0JBQVMsR0FBdkIsVUFBd0IsTUFBTTtRQUUxQixJQUFNLGNBQWMsR0FBRztZQUNuQixtQkFBbUIsRUFBRSxDQUFDO1lBQ3RCLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsZUFBZSxFQUFFLENBQUM7WUFDbEIsZ0JBQWdCLEVBQUUsQ0FBQztZQUNuQix5QkFBeUIsRUFBRSxDQUFDO1lBQzVCLHdCQUF3QixFQUFFLENBQUM7WUFDM0Isa0JBQWtCO1lBQ2xCLGdCQUFnQixFQUFFLENBQUM7WUFDbkIsaUJBQWlCLEVBQUUsQ0FBQztTQUN2QixDQUFDO1FBRUYsSUFBTSxXQUFXLEdBQUc7WUFDaEIsb0JBQW9CLEVBQUUsQ0FBQztZQUN2QixxQkFBcUIsRUFBRSxDQUFDO1lBQ3hCLDRCQUE0QixFQUFFLENBQUM7WUFDL0IscUJBQXFCLEVBQUUsQ0FBQztZQUN4QixzQkFBc0IsRUFBRSxDQUFDO1lBQ3pCLHFCQUFxQixFQUFFLENBQUM7WUFDeEIsc0JBQXNCLEVBQUUsQ0FBQztZQUN6Qix1QkFBdUIsRUFBRSxDQUFDO1lBQzFCLHVCQUF1QixFQUFFLENBQUM7U0FDN0IsQ0FBQztRQUVGLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQzlDLElBQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDO1FBRXhDLFNBQVMsV0FBVyxDQUFDLEdBQU87WUFDeEIsT0FBTyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUVELFNBQVMsS0FBSyxDQUFDLEtBQVM7WUFDcEIsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRO21CQUN6QixPQUFPLEtBQUssQ0FBQyxRQUFRLEtBQUssUUFBUTttQkFDbEMsT0FBTyxLQUFLLENBQUMsYUFBYSxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDO1FBRUQsSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVEsRUFBRTtZQUM3QyxPQUFPLE1BQU0sQ0FBQztTQUNqQjtRQUVELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNwQixJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZDLElBQUksT0FBTyxLQUFLLGdCQUFnQixFQUFFO1lBQzlCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDL0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25EO2FBQ0o7U0FDSjthQUNJLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3RCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQzlCLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUU7b0JBQ3pCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM5QjtxQkFDSTtvQkFDRCxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkQ7aUJBQ0o7YUFDSjtTQUNKO2FBQ0ksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6RSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ1osS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7Z0JBQ3BCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZEO2FBQ0o7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ssd0NBQWUsR0FBdkIsVUFBd0IsTUFBZSxFQUFFLFVBQWMsRUFBRSxVQUFjLEVBQUUsSUFBb0IsRUFBRSxVQUFjO1FBRXpHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBRXpCLEdBQUc7UUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFCLEdBQUc7UUFDSCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUdPLDRDQUFtQixHQUEzQjtRQUFBLGlCQU1DO1FBSkcsSUFBSSxJQUFJLENBQUMsV0FBVztZQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFckQsR0FBRztRQUNILElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsY0FBYyxFQUFFLEVBQXJCLENBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUlEOztPQUVHO0lBQ0ssdUNBQWMsR0FBdEIsVUFBdUIsS0FBYztRQUVqQyxHQUFHO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUMzQixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUFFLE9BQU87UUFFOUUsSUFBSTtRQUNKLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUzRCxJQUFJO1FBQ0UsSUFBQSxxQkFBaUQsRUFBaEQsYUFBSyxFQUFFLGVBQU8sRUFBRSxjQUFNLEVBQUUsWUFBd0IsQ0FBQztRQUNsRCxJQUFBLG9CQUE0QyxFQUEzQyxZQUFJLEVBQUUsY0FBTSxFQUFFLGFBQUssRUFBRSxXQUFzQixDQUFDO1FBQ25ELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQzVELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFFaEQsR0FBRztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBRTdDLElBQUk7UUFDSixPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFL0IsR0FBRztRQUNILElBQUksQ0FBQyxjQUFjLENBQUMsRUFBQyxHQUFHLEVBQUM7Z0JBQ3JCLFFBQVE7Z0JBQ1IsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN4QixXQUFXO2dCQUNYLGNBQWMsRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2pELEVBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVEOztPQUVHO0lBQ0ssZ0NBQU8sR0FBZjtRQUFBLGlCQVFDO1FBTkcsR0FBRztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFM0IsR0FBRztRQUNILElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixxQkFBcUIsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRDs7T0FFRztJQUNLLHdDQUFlLEdBQXZCO1FBQUEsaUJBaUJDO1FBZkcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTztRQUU3QixJQUFJO1FBQ0osSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRW5FLE1BQU07UUFDTixJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWpFLE1BQU07UUFDQSxJQUFBLGtCQUFnQyxFQUEvQixVQUFFLEVBQUUsVUFBRSxFQUFFLFVBQUUsRUFBRSxVQUFtQixDQUFDO1FBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUF0RSxDQUFzRSxDQUFDLENBQUM7UUFFekcsSUFBSTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQXBpQkQsSUFvaUJDIn0=