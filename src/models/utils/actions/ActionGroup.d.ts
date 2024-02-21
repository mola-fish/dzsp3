import { Action, ActionOption } from "./Action";
export interface ActionGroupOption {
    start: number;
    end: number;
    actions: ActionOption[];
}
export declare class ActionGroup {
    private _start;
    private _end;
    private _actions;
    constructor(view3d: CZMAP.MapView3D, option: ActionGroupOption);
    get begin(): number;
    get end(): number;
    get duration(): number;
    get actions(): Action[];
    /** 开始 */
    start(): void;
    /** 结束 */
    finish(): void;
    destroy(): void;
}
