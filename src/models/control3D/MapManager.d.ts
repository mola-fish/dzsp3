import { MapContainerTools } from "../common/MapContainerTools";
declare class CZMapTools implements MapContainerTools {
    protected map: CZMAP.ComMap;
    private layers;
    protected center: [number, number, number];
    constructor(center: [number, number, number], key: string, comp: CZMAP.ComMap);
    /**
     * 初始化二三维一体化地图
     */
    init(key: string, comp: CZMAP.ComMap): void;
}
type MapManagerOption = {
    viewerQuality: PropertyKey;
    dem?: PropertyKey;
};
declare class MapManager extends CZMapTools {
    static instance: Object;
    static setStore: Function;
    static getStore: Function;
    private key;
    private images;
    private otherMap;
    private _loadPromise;
    private _viewer;
    private _camera;
    private _scene;
    private _map3dView;
    private resolve;
    /**
   * 统一管理地图对象构造函数
   * @param key {String} 地图实例的唯一键
   * @param images {Array<String>} 底图
   * @param center {Array<Number>} 视图中心
   * @param option {any} 其他参数
   */
    constructor(key: string, images: Array<string>, center: [number, number, number], option?: any);
    /**
     * 初始化微件工具，并执行暂存操作
     */
    restoreWidget(opt: MapManagerOption): void;
    /**
   * 更新
   */
    update(): void;
    /**
     * @param map3dView {ZMap3D.Map}
     * @param other {Object} 其他被存储的参数
     */
    initSet(map3dView: any, other?: {}): void;
    /** 设置属性 */
    $set(key: PropertyKey, value: any): this;
    /** 获取实例属性或者other里面的属性 */
    $get(key: PropertyKey): any;
    get viewer(): Cesium.Viewer;
    set viewer(viewer: Cesium.Viewer);
    get scene(): Cesium.Scene;
    set scene(scene: Cesium.Scene);
    get camera(): Cesium.Camera;
    set camera(camera: Cesium.Camera);
    get map3DView(): ZMap3D.Map;
    set map3DView(view: ZMap3D.Map);
    /**
   * 加载状态的promise <br>
   * 初始化完成之后 promise会立马完成
   */
    get loadPromise(): Promise<any>;
}
export default MapManager;
