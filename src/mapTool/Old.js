/// <reference path="../assets/dts/czmap-s.d.ts" />

const ZMap = new URL('../lib/ZMap', import.meta.url).href

// 封装旧版库的全局对象 + 新的管理对象
export default {
    CZMAP: window.CZMAP,
    CZMAPAPP: window.CZMAPAPP,
    ZMap,
    WebglMapWidget: ZMap.WebglMapWidget,
    /** @type ZMap3D */
    ZMap3D: window.ZMap3D,
    /** @type Cesium */
    GmMap3D: window.GmMap3D,
    ZMap3DLib: window.ZMap3DLib,
    ZMAP3DTILES: window.ZMAP3DTILES,
    Map3DSDK: window.Map3DSDK,
    /** @type Cesium */
    Cesium: window.Cesium,
    /** @type jQuery */
    $: window.$,
    $GlobalConvert: window.$GlobalConvert,

    PinTool: window.PinTool,
    drawTool: window.drawTool,
    ActionPlayerConfig:window.ActionPlayerConfig
    /** @type MapManager */
};
