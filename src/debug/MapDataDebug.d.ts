/**
 * 地图数据相关的调试类
 * @param viewer {Cesium.Viewer}
 */
declare class MapDataDebug {
    constructor(viewer: any);
    getDebugServer(): string;
    loadDebugTile(): void;
    loadDebugData(): void;
}
export default MapDataDebug;
