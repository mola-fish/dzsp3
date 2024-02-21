import Old from './Old';
import { PromiseQueue } from "../common/PromiseQueue";
import { MapContainerTools } from "../common/MapContainerTools";
const { WebglMapWidget, Cesium, ZMap3DLib, ZMAP3DTILES: ZMap3DTiles, Map3DSDK, CZMAP } = Old;

type MapManagerOption = {
    viewerQuality: PropertyKey,
    dem?: PropertyKey
}
type CompMapViewOptionSetting = {
    z: number,
    zoomTool: boolean,
    mousePosition: boolean,
    levelTool: boolean,
    minZoom: number,
    maxZoom: number
}
interface CompMapViewOptionConfig extends CompMapViewOption {
    map: Array<any>
}

const promiseQueue = new PromiseQueue();

/// czmap 辅助函数
class CompMapViewTools implements MapContainerTools{
    protected map: CompMapView;
    private layers: Array<CZMAP.Layer>;
    protected center: [number, number, number];

    constructor (center: [number, number, number], key: string, comp: CompMapView, option: CompMapViewOptionConfig) {
        this.center = center;
        this.layers = [];
        this.init(key, comp, option);
    }

    /**
     * 初始化二三维一体化地图
     */
    public init (key: string, comp: CompMapView, option: CompMapViewOptionConfig) {

        const setting = Object.assign( {
            z: 7,
            zoomTool: false,
            mousePosition: true,//显示鼠标位置（经纬度）
            levelTool: false,//显示级别导航条,
        }, option.setting) as CompMapViewOptionSetting;

        const map = comp || new CompMapView({
            dom: key,
            setting: {
                x: this.center[0],
                y: this.center[1],
                // zoom
                z: setting.z,
                zoomTool: setting.zoomTool,  //显示缩放工具
                mousePosition: setting.mousePosition,//显示鼠标位置（经纬度）
                levelTool: setting.levelTool,//显示级别导航条,
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

    public convertBaseMap(baseMaps)
    {
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
    static instance: Object;
    static setStore: Function;
    static getStore: Function;

    private key: string;
    private images: Array<string>;
    private otherMap: any;
    private _loadPromise: Promise<any>;
    private _viewer: Cesium.Viewer;
    private _camera: Cesium.Camera;
    private _scene: Cesium.Scene;
    private _map3dView: ZMap3D.Map;
    private resolve: Function;

    /**
   * 统一管理地图对象构造函数
   * @param key {String} 地图实例的唯一键
   * @param images {Array<String>} 底图
   * @param center {Array<Number>} 视图中心
   * @param option {any} 其他参数
   */
    constructor (key:string, images: Array<string>, center: [number,number, number], option: any = {}) {
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
    restoreWidget (opt: MapManagerOption) {
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
    update () {
        this.resolve(this);
    }

    /**
     * @param compMap
     * @param other {Object} 其他被存储的参数
     */
    initSet (compMap, other = {}) {
        this.otherMap = other;
        this.update();
    }

    /** 设置属性 */
    $set (key: PropertyKey, value: any) {
        this[key] = value;
        this.update();
        return this;
    }

    /** 获取实例属性或者other里面的属性 */
    $get (key: PropertyKey): any {
        return this[key] || this.otherMap[key];
    }

    get viewer (): Cesium.Viewer {
        return this._viewer;
    }

    set viewer (viewer: Cesium.Viewer) {
        this._viewer = viewer;
    }

    /**
   * 加载状态的promise <br>
   * 初始化完成之后 promise会立马完成
   */
    get loadPromise (): Promise<any> {
        return this._loadPromise;
    }
}

/// MARK 这里不能写成MapManager的静态方法，会报找不到MapManager对象，原因未知，怀疑和webpack打包有关系
MapManager.instance = {};

/** 设置存储实例 */
MapManager.setStore = (key: PropertyKey, instance: MapManager) => {
    if (instance instanceof MapManager) {
        MapManager.instance = MapManager.instance || {};
        MapManager.instance[key] = instance;
        promiseQueue.updateQueue(key, instance);
    } else {
        throw new Error('被存储的对象必须是 MapManager 的实例');
    }
};

/** 获取存储实例 */
MapManager.getStore = (key: PropertyKey) => {
    const result = MapManager.instance[key];
    if (result) {
        return Promise.resolve(result as MapManager);
    } else {
        return promiseQueue.addItem(key);
    }
};

export default MapManager;
