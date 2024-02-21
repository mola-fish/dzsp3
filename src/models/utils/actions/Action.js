let nextActionID = 0;
export class Action {
    constructor(view3d, option) {
        this.id = nextActionID++;
        this._view3d = view3d;
        this._czviewer = view3d.czviewer;
    }
    get view3d() { return this._view3d; }
    get czviewer() { return this._czviewer; }
    /** 初始化 */
    init() {
        return Promise.resolve();
    }
    /** 销毁 */
    destroy() { }
}
