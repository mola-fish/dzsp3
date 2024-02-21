export interface ActionOption {
    type: string;
}
export declare abstract class Action {
    readonly id: number;
    private _view3d;
    private _czviewer;
    constructor(view3d: CZMAP.MapView3D, option: ActionOption);
    get view3d(): CZMAP.MapView3D;
    get czviewer(): Cesium.Viewer;
    /** 初始化 */
    init(): Promise<void>;
    /** 开始 */
    abstract start(): void;
    /** 结束 */
    abstract finish(): void;
    /** 销毁 */
    destroy(): void;
}
