// 封装旧版库的全局对象 + 新的管理对象
// @ts-ignore
export default {
    CZMAP: window.CZMAP,
    CZMAPAPP: window.CZMAPAPP,
    WebglMapWidget: ZMap.WebglMapWidget,
    /** @type ZMap3D */
    ZMap3D: window.ZMap3D,
    /** @type Cesium */
    GmMap3D: window['GmMap3D'],
    ZMap3DLib: window['ZMap3DLib'],
    ZMAP3DTILES: window['ZMAP3DTILES'],
    Map3DSDK: window['Map3DSDK'],
    /** @type Cesium */
    Cesium: window.Cesium,
    /** @type jQuery */
    $: window['$'],
    $GlobalConvert: window['$GlobalFunction'],

    PinTool: window['PinTool'],
    drawTool: window['drawTool'],
    /** @type MapManager */
};
