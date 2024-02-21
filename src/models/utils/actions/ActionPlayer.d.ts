import { ActionGroupOption } from "./ActionGroup";
export interface ActionPlayerOption {
    groups: ActionGroupOption[];
    audio: string;
}
export declare class ActionPlayer {
    private _view3d;
    private _groups;
    private _loopHandle;
    private _current;
    private _paused;
    private _currents;
    private _audioPlayer;
    private _inited;
    private _ready;
    private _readyResolve;
    constructor(view3d: CZMAP.MapView3D);
    get duration(): number;
    get current(): number;
    set current(val: number);
    get paused(): boolean;
    get ready(): Promise<void>;
    init(option: ActionPlayerOption): Promise<void>;
    /** 播放 */
    play(start?: number): void;
    /** 暂停 */
    pause(): void;
    /** 切换状态 */
    togger(): void;
    /** 销毁对象，释放资源 */
    destroy(): void;
    private _run;
    private _loop;
    private _findActions;
}
