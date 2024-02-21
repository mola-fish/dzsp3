import { createAction } from "./Actions";
const TimeRegex = /([0-9]+):([0-9]+)/;
function parseTime(time) {
    if (typeof time === 'number')
        return time;
    if (typeof time === 'string') {
        if (TimeRegex.test(time)) {
            const min = RegExp.$1;
            const sec = RegExp.$2;
            return Number.parseInt(min) * 60 + Number.parseInt(sec);
        }
    }
    throw new Error('错误的时间格式!');
}
export class ActionGroup {
    constructor(view3d, option) {
        this._start = parseTime(option.start);
        this._end = parseTime(option.end);
        ///
        let actions = option.actions;
        if (!Array.isArray(actions)) {
            actions = [option];
        }
        this._actions = actions.map(act => createAction(view3d, act));
    }
    ///
    get begin() { return this._start; }
    get end() { return this._end; }
    get duration() { return this._end - this._start; }
    ///
    get actions() { return this._actions; }
    /** 开始 */
    start() {
        this.actions.forEach(act => act.start());
    }
    /** 结束 */
    finish() {
        this.actions.forEach(act => act.finish());
    }
    ///
    destroy() {
        this.actions.forEach(act => act.destroy());
        this.actions.length = 0;
    }
}
