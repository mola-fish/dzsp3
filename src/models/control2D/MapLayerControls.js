var defType;
(function (defType) {
    defType["table"] = "table";
})(defType || (defType = {}));
class MapLayerQuery {
    constructor() {
    }
    static circleQuery(circle, layers, type) {
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
}
/**
 * 图层分发器
 */
class MapLayerDispatch {
    static fmtDate(time, fmt) {
        const regex = CompResource.regexPlacer;
        if (!regex.test(fmt))
            return fmt;
        const diff = 8 * 3600 * 1000;
        let utime = new Date(time.getTime() - diff);
        ///
        const fields = [
            { regex: CompResource.regexYears, value: time.getFullYear() },
            { regex: CompResource.regexMonths, value: time.getMonth() + 1 },
            { regex: CompResource.regexDate, value: time.getDate() },
            { regex: CompResource.regexHours, value: time.getHours() },
            { regex: CompResource.regexMinutes, value: time.getMinutes() },
            { regex: CompResource.regexSeconds, value: time.getSeconds() },
            { regex: CompResource.regexMilliseconds, value: time.getMilliseconds() },
            { regex: CompResource.uRegexYears, value: utime.getFullYear() },
            { regex: CompResource.uRegexMonths, value: utime.getMonth() + 1 },
            { regex: CompResource.uRegexDate, value: utime.getDate() },
            { regex: CompResource.uRegexHours, value: utime.getHours() },
            { regex: CompResource.uRegexMinutes, value: utime.getMinutes() },
            { regex: CompResource.uRegexSeconds, value: utime.getSeconds() },
            { regex: CompResource.uRegexMilliseconds, value: utime.getMilliseconds() },
        ];
        ////
        fields.forEach(m => {
            while (m.regex.test(fmt)) {
                const mt = RegExp.$1;
                let vt = m.value.toString();
                if (vt.length < mt.length - 2) {
                    const isUTC = mt.startsWith("{u");
                    vt = "000000".substr(0, mt.length - (isUTC ? 3 : 2) - vt.length) + vt;
                }
                fmt = fmt.replace(mt, vt);
            }
        });
        ///
        return fmt;
    }
    constructor(map) {
        /** 包裹下面的瓦片 模型 业务图层 */
        this.layers = [];
        ///
        this.flatLayers = [];
        /// 各个业务实例的包裹对象
        this.instances = [];
        this.map = map;
    }
    /**
     * 通过配置文件地址加载图层<br>
     * 对应public / static文件夹下的文件
     * @returns {Promise}
     */
    async loadConfigByLocalUrl(url) {
        const e = await fetch(url);
        const text = await e.text();
        const data = Function(`return ${text}`)(); //JSON.parse(text);
        this.init(data);
        return data;
    }
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    /**
     * TODO 尚未实现
     */
    async loadConfigByRemoteUrl() {
    }
    /**  */
    init(data) {
        this.mapConfig = this.clone(data);
        this
            ._initTipContainer()
            ._initLayers(data);
    }
    /** 初始化tip容器 */
    _initTipContainer() {
        // TODO 完成此方法
        // const root = this.map
        // const tipContainer = document.createElement("div");
        // tipContainer.classList.add('zmap-tip-container');
        // root.append(tipContainer);
        // this.tipContainer = tipContainer
        return this;
    }
    preCreateLayer(ld) {
        ld.url = MapLayerDispatch.fmtDate(new Date(), ld.url);
        return ld;
    }
    _initLayers(data) {
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
    clickCall(e) {
        const { instances, pickedFeature, pickedLayer } = this._callPickData(e);
        instances.forEach((instance) => {
            const compInstance = instance.instance;
            if (compInstance)
                compInstance.click({ e, args: [pickedFeature, pickedLayer, instance] });
        });
    }
    /** tip回调 */
    tipCall(e) {
        this._removeAllTip();
        if (e.type === CZMAP.MapEventsType.MOUSE_OVER) { // 鼠标移入
            const { instances, pickedFeature, pickedLayer } = this._callPickData(e);
            // 没有匹配的图层或者自定义的图层
            if (instances.length === 0) {
                const type = MapLayerDispatch.CUSTOM_LAYER;
                const tip = pickedLayer.define?.hover?.tip || pickedLayer.define?.tip || pickedLayer.define?.style?.tip || null;
                this.renderTip(e, tip, type);
            }
            else {
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
                    if ('custom' === tip && compInstance) {
                        compInstance.hover({ e: e, args: [pickedFeature, pickedLayer, instance], el: MapLayerDispatch.getTipWrapElement(instance.type) });
                    }
                    else {
                        this.renderTip(e, tip, instance.type);
                    }
                });
            }
        }
    }
    // 渲染不同类型的tip
    renderTip(e, tip, type) {
        if (typeof tip === 'string') {
            this.renderTipString(e, tip, {
                recordType: type
            });
        }
        else if (typeof tip === 'object' && tip.render === 'table') {
            this.renderTipRichTable(e, tip, {
                recordType: type
            });
        }
        else if (Array.isArray(tip)) {
            this.renderTipArray(e, tip, {
                recordType: type
            });
        }
    }
    /** 渲染类型为string的tip */
    renderTipString(e, content, data = {}) {
        const { recordType } = data;
        const el = this.getTipWrap(e, recordType);
        const featureLayer = e.object;
        const prop = featureLayer.properties;
        el.innerHTML = this.fmtParam(prop, content);
        this.tipContainer.append(el);
    }
    /** 渲染类型为rich table的tip */
    renderTipRichTable(e, table, data = {}) {
        const { recordType } = data;
        const featureLayer = e.object;
        const prop = featureLayer.properties;
        const el = this.getTipWrap(e, recordType, 'rich-table');
        const tableText = this._renderTable(table.rows, prop, table.fieldMap);
        el.setAttribute('data-title', table.name);
        el.innerHTML = tableText;
        this.tipContainer.append(el);
    }
    /** 渲染类型为Array的tip */
    renderTipArray(e, table, data = {}) {
        const { recordType } = data;
        const featureLayer = e.object;
        const prop = featureLayer.properties;
        const el = this.getTipWrap(e, recordType, 'table');
        el.innerHTML = this._renderTable(table, prop);
        this.tipContainer.append(el);
    }
    /** 获取tip容器 */
    getTipWrap(e, recordType, renderType = 'string') {
        const el = MapLayerDispatch.getTipWrapElement(recordType, renderType);
        // 偏移5px,避免影响鼠标事件
        el.setAttribute("style", `left: ${e.x + 5}px; top: ${e.y + 5}px;`);
        return el;
    }
    _renderTable(table, prop, fieldMap = {}) {
        return `
        <table>
            ${table.map(tr => this._renderTableRow(tr, prop, fieldMap)).join('')}
        </table>
        `;
    }
    _renderTableRow(tr, prop, fieldMap = {}) {
        return `
        <tr>
            ${tr.map(td => this._renderTableCell(td, prop, fieldMap)).join('')}
        </tr>
        `;
    }
    _renderTableCell(td, prop, fieldMap = {}) {
        return `
            <td colspan="${td.cols || 1}">${this.fmtParam(prop, td.content, fieldMap)}</td>
        `;
    }
    /**
     * 根据参数格式化字符串
     * @param params
     * @param fmt
     * @private
     */
    fmtParam(params, fmt, fieldMap = {}) {
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
            const val = match.substring(2, match.length - 1);
            fmt = fmt.replace(match, eval(val));
        });
        // 替换映射表
        Object.keys(fieldMap).forEach((key) => {
            fmt = fmt.replace(key, fieldMap[key]);
        });
        return fmt;
    }
    /** 清除所有的tip框 */
    _removeAllTip() {
        // this.tipContainer.innerHTML = '';
        // if(!this.current) return;
        // const { vectorLayer,featureLayer } = this.current;
        // if (vectorLayer) {
        //     const target = vectorLayer.define.style;
        //     featureLayer.style.update(target, undefined, undefined);
        // }
    }
    /** 获取事件对象内有用的对象 */
    _callPickData(e) {
        const pickedFeature = e.object;
        const pickedLayer = pickedFeature.parent;
        const instances = this.instances.filter((instance) => {
            return instance.layer === pickedLayer;
        });
        return { instances, pickedFeature, pickedLayer };
    }
    /** 获取包裹tip内容的的元素 */
    static getTipWrapElement(type, renderType = 'string') {
        const wrap = document.createElement("div");
        wrap.classList.add("zmap-tip-wrap");
        wrap.setAttribute('data-type', type);
        wrap.setAttribute('data-render-type', renderType);
        return wrap;
    }
    circleQuery(circleInfo, type) {
        return MapLayerQuery.circleQuery(circleInfo, this.recordLayers, type);
    }
}
// 计算量匹配 #[....] 的内容，
MapLayerDispatch.computeRegx = /#\[.*?\]/g;
MapLayerDispatch.DEFAULT_LAYER = "DEFAULT_LAYER";
MapLayerDispatch.CUSTOM_LAYER = "CUSTOM_LAYER";
MapLayerDispatch.regexPlacer = /(\{[a-zA-z]+\})/;
MapLayerDispatch.regexYears = /(\{yyyy\})/;
MapLayerDispatch.regexMonths = /(\{M+\})/;
MapLayerDispatch.regexDate = /(\{d+\})/;
MapLayerDispatch.regexHours = /(\{[Hh]+\})/;
MapLayerDispatch.regexMinutes = /(\{m+\})/;
MapLayerDispatch.regexSeconds = /(\{s+\})/;
MapLayerDispatch.regexMilliseconds = /(\{S+\})/;
MapLayerDispatch.uRegexYears = /(\{uyyyy\})/;
MapLayerDispatch.uRegexMonths = /(\{uM+\})/;
MapLayerDispatch.uRegexDate = /(\{ud+\})/;
MapLayerDispatch.uRegexHours = /(\{u[Hh]+\})/;
MapLayerDispatch.uRegexMinutes = /(\{um+\})/;
MapLayerDispatch.uRegexSeconds = /(\{us+\})/;
MapLayerDispatch.uRegexMilliseconds = /(\{uS+\})/;
/**
 * 图层控制工具<br>
 * UI和底层的衔接类
 */
class MapLayerControls extends MapLayerDispatch {
    constructor(map, option = {}) {
        super(map);
        this.option = option;
    }
    convertConfig(config) {
        return config;
    }
    /**
     * 获取结构树
     */
    getTreeData() {
        // TODO 完成此方法
        const data = [];
        return data;
    }
    /**
     * 根据名称显示子图层
     * @param name
     */
    showSubLayerByName(name) {
        this.setSubLayerVisibleByName(name, true);
    }
    /**
     * 根据名称隐藏子图层
     * @param name
     */
    hideSubLayerByName(name) {
        this.setSubLayerVisibleByName(name, false);
    }
    removeLayer(name) {
        const layer = this.findSubLayerByName(name);
        this.removeFromFlatLayers(layer);
        this.map.removeLayer(layer);
    }
    removeFromFlatLayers(layer) {
        const findIndex = this.flatLayers.findIndex(item => item === layer);
        if (findIndex !== -1) {
            this.flatLayers.splice(findIndex, 1);
        }
    }
    addLayer(layerDefine) {
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
    setSubLayerVisibleByName(name, visible) {
        let target = this.findSubLayerByName(name);
        return MapLayerControls.setLayerVisible(target, !!visible);
    }
    /**
     * 根据名称找到子图层*
     * @param name
     */
    findSubLayerByName(name) {
        return this.flatLayers.find(layer => layer.name === name);
    }
    /**
     * 根据资源类型和id定位FeatureLayer
     * @param id
     * @param type
     * @param key 键值，默认为id
     */
    zoomToFeatureLayerByIdAndType(id, type, key = 'id') {
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
    setSubLayerVisibleByKey(key, visible) {
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
    setParentLayerVisibleByKey(key, visible) {
        // const set = this.layers[key] as Array<WrapFolder>;
        // set.forEach(wrapLayer => {
        //     wrapLayer.folder.visible = !!visible;
        // })
        //
        // return true;
    }
    static setLayerVisible(layer, visible, autoZoom = true) {
        if (!layer)
            return;
        layer.setVisible(visible);
        // TODO 实现自动定位
    }
}
export default MapLayerControls;
