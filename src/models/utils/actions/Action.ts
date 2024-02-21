export interface ActionOption
{
    type: string;
}

let nextActionID = 0;

export abstract class Action
{
    readonly id = nextActionID ++;
    private _view3d:CZMAP.MapView3D;
    private _czviewer:Cesium.Viewer;

    constructor (view3d:CZMAP.MapView3D, option:ActionOption)
    {
        this._view3d = view3d;
        this._czviewer = view3d.czviewer;
    }

    get view3d() { return this._view3d; }
    get czviewer() { return this._czviewer; }

    /** 初始化 */
    init():Promise<void>
    {
        return Promise.resolve();
    }

    /** 开始 */
    abstract start():void;
    /** 结束 */
    abstract finish():void;
    /** 销毁 */
    destroy(): void {}
}

