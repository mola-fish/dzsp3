/**
 * 场景控制工具 <br>
 * 重置三维地图的高动态范围（对比度）
 * @author flake
 * @param map3dView {ZMap3D.Map}
 * @param viewer {Cesium.Viewer}
 * @param opt {any}
 */
declare class SceneControl {
    constructor(map3dView: any, viewer: any, opt?: {});
    /**
     * 重置三维球环境（取消HDR）
     * @returns {SceneControl}
     */
    resetAround(): this;
    /**
     * 取消entity双击锁定
     */
    cancelDoubleClickLock(): this;
    /**
     * @param devicePixelRatio {PropertyKey}
     * 开启精细化处理<br>
     * 开启之后图片的抗锯齿会开启，高分屏优化会开启，同时绘制也会更耗性能
     */
    fineProcessing(devicePixelRatio: any): this;
    /** 设置像素比 */
    setResolutionScale(devicePixelRatio: any): void;
    limitNumber(num: any): number;
}
export default SceneControl;
