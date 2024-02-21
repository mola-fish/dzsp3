import {createAction} from "./Actions";
import {Action, ActionOption} from "./Action";

export interface ActionGroupOption
{
    start: number;
    end: number;
    actions: ActionOption[]
}

const TimeRegex = /([0-9]+):([0-9]+)/

function parseTime(time:number|string)
{
    if (typeof time === 'number')
        return time;

    if (typeof time === 'string')
    {
        if (TimeRegex.test(time))
        {
            const min = RegExp.$1;
            const sec = RegExp.$2;
            return Number.parseInt(min) * 60 + Number.parseInt(sec);
        }
    }

    throw new Error('错误的时间格式!');
}

export class ActionGroup
{
    private _start:number;
    private _end:number;

    private _actions: Action[];

    constructor (view3d:CZMAP.MapView3D, option: ActionGroupOption)
    {
        this._start = parseTime(option.start);
        this._end = parseTime(option.end);

        ///
        let actions = option.actions;
        if (!Array.isArray(actions))
        {
            actions = [option as any];
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
    start():void
    {
        this.actions.forEach(act => act.start());
    }

    /** 结束 */
    finish():void
    {
        this.actions.forEach(act => act.finish());
    }

    ///
    destroy()
    {
        this.actions.forEach(act => act.destroy());
        this.actions.length = 0;
    }
}
