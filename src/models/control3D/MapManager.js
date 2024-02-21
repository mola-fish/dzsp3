// @ts-ignore
import SceneControl from "../tools/SceneControl";
// @ts-ignore
import Old from './Old';
import { PromiseQueue } from "../common/PromiseQueue";
const { GmMap3D, WebglMapWidget, Cesium, ZMap3DLib, ZMAP3DTILES: ZMap3DTiles, Map3DSDK, CZMAP, CZMAPAPP } = Old;
// const appConfig = require('@/assets/mockdata/layers.json');
/// czmap 辅助函数
class CZMapTools {
    constructor(center, key = 'webContainer', comp) {
        this.center = center;
        this.layers = [];
        this.init(key, comp);
    }
    /**
     * 初始化二三维一体化地图
     */
    init(key, comp) {
        const map = comp || new CZMAP.ComMap(CZMAP.MapMode.Mode3D, key);
        // map.view.cluster.minDistance = 0;
        const ctrl = map.view3d.czviewer.scene.screenSpaceCameraController;
        ctrl.enableFlatMode = false;
        ctrl.flatModeHeight = 1000;
        /// 设置交互不限制旋转角度
        ctrl.minimumPitch = Cesium.Math.toRadians(-360);
        ctrl.maximumPitch = Cesium.Math.toRadians(360);
        this.map = map;
        map.view.setViewInfo({
            "position": [
                114.36340890953481,
                30.728570069907228,
                176974.96453419406
            ],
            "heading": 0.22200405224236874,
            "pitch": 89.19766383618975,
            "roll": 1.8223523296324517e-12
        });
    }
}
/**
 * widget map 辅助函数
 * // TODO 尚未完成此工具
 */
class WidgetMapTools {
    constructor(center) {
        this.center = center;
        this.layers = [];
        this.images = [];
        this.init();
    }
    /**
     * 初始化微件地图
     */
    init() {
        const images = this.images || [];
        const mapLayer = new WebglMapWidget('webContainer', null, { navigation: true, images: images });
        const map3DView = mapLayer.zmap3dview;
        const viewer = map3DView.GetView();
        // 注册键盘事件
        map3DView.RegisterKeyBoard();
        // 注册工具类
        const map3DTool = new ZMap3DLib.Input3DTool(map3DView);
        // map3DView.CenterAndZoom(initcen, initzoom);//初始化地图呈现的位置和zoom大小
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(...this.center)
        });
        // AddTdtLayer();//添加天地图图层
        const zMap3DTiles = new ZMap3DTiles(map3DView);
        // AddTdtLayer()
        // 模型拾取
        const zMapPickModel = new Map3DSDK.ZmapModelPick(map3DView, { hoverClass: 'hoverClass' });
        // 添加鼠标位置信息显示
        map3DView.AddControl(new Cesium['MousePositionCtl']({ map: map3DView }));
        // 设置复位坐标和级别
        map3DView.SetResetCenterAndZoom(...this.center);
        // 设置三维环境
        const sceneTool = new SceneControl(map3DView, viewer, {});
        sceneTool
            .resetAround()
            .cancelDoubleClickLock();
        // .fineProcessing();
        // 回写各个地图相关对象
        // this.initSet(map3DView, {
        //   mapLayer,
        //   map3DTool,
        //   zMap3DTiles,
        //   zMapPickModel
        // });
        //
        // MapManager.setStore(this.key, this);
    }
}
const promiseQueue = new PromiseQueue();
/// 统一管理地图各类对象，提升性能
class MapManager extends CZMapTools {
    /**
   * 统一管理地图对象构造函数
   * @param key {String} 地图实例的唯一键
   * @param images {Array<String>} 底图
   * @param center {Array<Number>} 视图中心
   * @param option {any} 其他参数
   */
    constructor(key, images, center, option = {}) {
        super(center, key, option.instance);
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
        const map3DView = map.view3d.zmap3d;
        // 初始化微件，仅仅使用里面携带的交互工具
        const mapLayer = new WebglMapWidget(map3DView, null, { navigation: true, images: [] });
        map3DView.setResetCenterAndHeight(...this.center);
        // 设置三维环境
        const sceneTool = new SceneControl(map3DView, map.view['_czviewer'], {});
        if (opt.dem) {
            const op = {
                url: opt.dem,
                type: 'ZMapTerrain'
            };
            map3DView.setTerrain(op);
        }
        sceneTool
            .resetAround()
            .cancelDoubleClickLock()
            .fineProcessing(opt.viewerQuality);
        // 回写各个地图相关对象
        this.initSet(map3DView, {
            mapLayer,
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
     * @param map3dView {ZMap3D.Map}
     * @param other {Object} 其他被存储的参数
     */
    initSet(map3dView, other = {}) {
        this._map3dView = map3dView;
        this._viewer = map3dView.GetView();
        this._camera = this._viewer.camera;
        this._scene = this._viewer.scene;
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
    get scene() {
        return this._scene;
    }
    set scene(scene) {
        this._scene = scene;
    }
    get camera() {
        return this._camera;
    }
    set camera(camera) {
        this._camera = camera;
    }
    get map3DView() {
        return this._map3dView;
    }
    set map3DView(view) {
        this._map3dView = view;
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
