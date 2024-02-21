import { ActionGroup } from "./ActionGroup";
import { AudioPlayer } from "./AudioPlayer";
export class ActionPlayer {
    constructor(view3d) {
        this._groups = [];
        this._loopHandle = 0;
        this._current = 0;
        this._paused = true;
        this._currents = new Map();
        this._audioPlayer = new AudioPlayer();
        this._inited = false;
        this._view3d = view3d;
        this._ready = new Promise(resolve => {
            this._readyResolve = resolve;
        });
    }
    get duration() {
        return this._audioPlayer.duration;
    }
    get current() { return this._current; }
    set current(val) {
        this._current = val;
        this._audioPlayer.currentTime = val;
    }
    get paused() { return this._paused; }
    get ready() { return this._ready; }
    init(option) {
        ///
        if (this._inited)
            return this._ready;
        ///
        this._inited = true;
        const readys = [];
        option.groups.forEach(g => {
            const group = new ActionGroup(this._view3d, g);
            group.actions.forEach(act => {
                readys.push(act.init());
            });
            this._groups.push(group);
        });
        ///
        readys.push(this._audioPlayer.open(option.audio));
        ///
        Promise.all(readys).then(this._readyResolve);
        ///
        return this._ready;
    }
    /** 播放 */
    play(start) {
        this._paused = false;
        if (!this._loopHandle) {
            this._run();
        }
        if (start !== undefined)
            this._current = start;
        this._audioPlayer.play(start);
    }
    /** 暂停 */
    pause() {
        this._paused = true;
        this._audioPlayer.pause();
    }
    /** 切换状态 */
    togger() {
        if (this.paused)
            this.play();
        else
            this.pause();
    }
    /** 销毁对象，释放资源 */
    destroy() {
        if (this._loopHandle) {
            cancelAnimationFrame(this._loopHandle);
            this._loopHandle = 0;
        }
        this._audioPlayer.pause();
        this._groups.forEach(act => act.destroy());
        this._groups.length = 0;
        this._currents.clear();
    }
    _run() {
        this._current = 0;
        this._audioPlayer.play(0);
        let lastTime;
        const next = (nowTime) => {
            if (lastTime === undefined)
                lastTime = nowTime;
            const diff = (nowTime - lastTime) / 1000;
            this._loop(diff);
            lastTime = nowTime;
            this._loopHandle = requestAnimationFrame(next);
        };
        ///
        this._loopHandle = requestAnimationFrame(next);
    }
    _loop(diff) {
        if (this._paused)
            return;
        const currents = this._currents;
        const begin = this._current;
        const end = this._current + diff;
        /// 结束过期的action
        currents.forEach((act, key) => {
            if (act.begin > begin || act.end < end) {
                act.finish();
                currents.delete(key);
            }
        });
        /// 查找新的action
        const result = this._findActions(begin, end);
        result.forEach((act, key) => {
            if (currents.has(key))
                return;
            ///
            //act.finish();
            act.start();
            ///
            currents.set(key, act);
        });
        ///
        this._current = end;
    }
    _findActions(begin, end) {
        const result = new Map();
        this._groups.forEach((act, index) => {
            if (act.begin <= end && act.end >= begin && act.end > end) {
                result.set(index, act);
            }
        });
        return result;
    }
}
