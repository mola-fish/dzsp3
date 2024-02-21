import ComMap = CZMAP.ComMap;
/**
 * 图层控制工具<br>
 * UI和底层的衔接类
 */
declare class MapLayerDebuggerControls {
    private map;
    constructor(map: ComMap);
    private loadDebug;
    /** 添加围网线 */
    private addGridLine;
}
export default MapLayerDebuggerControls;
