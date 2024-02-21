import Old from './Old';
import { PromiseQueue } from "../common/PromiseQueue";
const { WebglMapWidget, Cesium, ZMap3DLib, ZMAP3DTILES: ZMap3DTiles, Map3DSDK, CZMAP } = Old;
const promiseQueue = new PromiseQueue();
/// czmap 辅助函数
class CompMapViewTools {
    constructor(center, key, comp, option) {
        this.center = center;
        this.layers = [];
        this.init(key, comp, option);
    }
    /**
     * 初始化二三维一体化地图
     */
    init(key, comp, option) {
        const setting = Object.assign({
            z: 7,
            zoomTool: false,
            mousePosition: true, //显示鼠标位置（经纬度）
            levelTool: false, //显示级别导航条,
        }, option.setting);
        const map = comp || new CompMapView({
            dom: key,
            setting: {
                x: this.center[0],
                y: this.center[1],
                // zoom
                z: setting.z,
                zoomTool: setting.zoomTool, //显示缩放工具
                mousePosition: setting.mousePosition, //显示鼠标位置（经纬度）
                levelTool: setting.levelTool, //显示级别导航条,
                minZoom: setting.minZoom,
                maxZoom: setting.maxZoom
            },
            /// tip框设置
            tip: option.tip,
            /// 底图
            data: this.convertBaseMap(option.map)
        });
        this.map = map;
    }
    convertBaseMap(baseMaps) {
        return baseMaps.map(m => ({
            name: m.name,
            maptype: m.type,
            minZoom: m.minzoom,
            maxZoom: m.maxzoom,
            url: m.url,
            img: m.thumbnail
        }));
    }
}
/// 统一管理地图各类对象，提升性能
class MapManager extends CompMapViewTools {
    /**
   * 统一管理地图对象构造函数
   * @param key {String} 地图实例的唯一键
   * @param images {Array<String>} 底图
   * @param center {Array<Number>} 视图中心
   * @param option {any} 其他参数
   */
    constructor(key, images, center, option = {}) {
        super(center, key, option.instance, option);
        // 初始化内部参数
        this._viewer = undefined;
        this._scene = undefined;
        this._camera = undefined;
        this._map3dView = undefined;
        this._loadPromise = new Promise((resolve) => {
            this.resolve = resolve;
        });
        this.otherMap = {};
        // 初始化传入参数
        this.images = images;
        this.center = center;
        this.key = key;
        // one of [initWidgetMap,initCZMap]
        // this.initCZMap();
        this.restoreWidget(option);
    }
    /**
     * 初始化微件工具，并执行暂存操作
     */
    restoreWidget(opt) {
        const map = this.map;
        // 回写各个地图相关对象
        this.initSet(undefined, {
            ComMap: map
        });
        MapManager.setStore(this.key, this);
    }
    /**
   * 更新
   */
    update() {
        this.resolve(this);
    }
    /**
     * @param compMap
     * @param other {Object} 其他被存储的参数
     */
    initSet(compMap, other = {}) {
        this.otherMap = other;
        this.update();
    }
    /** 设置属性 */
    $set(key, value) {
        this[key] = value;
        this.update();
        return this;
    }
    /** 获取实例属性或者other里面的属性 */
    $get(key) {
        return this[key] || this.otherMap[key];
    }
    get viewer() {
        return this._viewer;
    }
    set viewer(viewer) {
        this._viewer = viewer;
    }
    /**
   * 加载状态的promise <br>
   * 初始化完成之后 promise会立马完成
   */
    get loadPromise() {
        return this._loadPromise;
    }
}
/// MARK 这里不能写成MapManager的静态方法，会报找不到MapManager对象，原因未知，怀疑和webpack打包有关系
MapManager.instance = {};
/** 设置存储实例 */
MapManager.setStore = (key, instance) => {
    if (instance instanceof MapManager) {
        MapManager.instance = MapManager.instance || {};
        MapManager.instance[key] = instance;
        promiseQueue.updateQueue(key, instance);
    }
    else {
        throw new Error('被存储的对象必须是 MapManager 的实例');
    }
};
/** 获取存储实例 */
MapManager.getStore = (key) => {
    const result = MapManager.instance[key];
    if (result) {
        return Promise.resolve(result);
    }
    else {
        return promiseQueue.addItem(key);
    }
};
export default MapManager;
