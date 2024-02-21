interface AudioPlayerEventMap {
    "play": Event;
    "pause": Event;
    "ended": Event;
}
type AudioPlayerListener<K extends keyof AudioPlayerEventMap> = (this: AudioPlayer, ev: AudioPlayerEventMap[K]) => any;
/**
 * 音频播放器。基于AudioContext
 */
export declare class AudioPlayer extends EventTarget {
    private _context;
    private _buffer;
    private _sourceNode;
    private _gainNode;
    private _onEndListener;
    /** 循环 */
    private _loop;
    /** 音量 */
    private _volume;
    /** 播放开始的时间 */
    private _startTime;
    /** 播放偏移 */
    private _offsetTime;
    /** 暂停的位置 */
    private _pauseTime;
    constructor();
    /** 媒体时长 */
    get duration(): number;
    /** 是否暂停 */
    get paused(): boolean;
    /** 音量 */
    get volume(): number;
    /** 音量 */
    set volume(val: number);
    /** 当前播放的时间 */
    get currentTime(): number;
    set currentTime(val: number);
    /** 循环播放 */
    set loop(val: boolean);
    get loop(): boolean;
    /** 打开音频数据并解码 */
    open(src: string): Promise<void>;
    /** 打开音频数据并解码 */
    openBuffer(buffer: ArrayBuffer): Promise<void>;
    /** 开始播放 */
    play(start?: number): void;
    /** 暂停播放 */
    pause(): void;
    /** 恢复播放 */
    resume(): void;
    addEventListener<K extends keyof AudioPlayerEventMap>(type: K, listener: AudioPlayerListener<K>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioPlayerEventMap>(type: K, listener: AudioPlayerListener<K>, options?: boolean | EventListenerOptions): void;
    /** 开始播放 */
    private _start;
    /** 停止播放 */
    private _stop;
    private _onended;
    private _fire;
}
export {};
