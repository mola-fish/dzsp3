import Old from '../mapTool/Old';
const { Cesium } = Old;

/**
 * 场景控制工具 <br>
 * 重置三维地图的高动态范围（对比度）
 * @author flake
 * @param map3dView {ZMap3D.Map}
 * @param viewer {Cesium.Viewer}
 * @param opt {any}
 */
export default class SceneControl {
    constructor (map3dView, viewer, opt = {}) {
        this.viewer = viewer;
        this.map3dView = map3dView;
        this.opt = opt;
    }

    /**
   * 重置三维球环境（取消HDR）
   * @returns {SceneControl}
   */
    resetAround () {
        this.viewer.scene.highDynamicRange = false;
        return this;
    }

    /**
   * 取消entity双击锁定
   */
    cancelDoubleClickLock () {
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return this;
    }

    /**
   * @param devicePixelRatio {PropertyKey}
   * 开启精细化处理<br>
   * 开启之后图片的抗锯齿会开启，高分屏优化会开启，同时绘制也会更耗性能
   */
    fineProcessing (devicePixelRatio) {
        const map3DView = this.map3dView;
        if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
            this.setResolutionScale(devicePixelRatio);
        }
        map3DView.cesium.scene.postProcessStages.fxaa.enabled = true;
        return this;
    }

    /** 设置像素比 */
    setResolutionScale (devicePixelRatio) {
        const map = {
            normal: 1,
            fast: 0.5,
            auto: window.devicePixelRatio
        };
        const map3DView = this.map3dView;
        map3DView.cesium.viewer.resolutionScale = map[devicePixelRatio] || this.limitNumber(devicePixelRatio) || map.auto;
    }

    limitNumber (num) {
        const max = 2;
        const min = 0.2;
        try {
            return Math.min(Math.max(min, num), max);
        } catch (e) {
            return null;
        }
    }
}
