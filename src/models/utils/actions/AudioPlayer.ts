interface AudioPlayerEventMap
{
    "play": Event;
    "pause": Event;
    "ended": Event;
}

type AudioPlayerListener<K extends keyof AudioPlayerEventMap> = (this: AudioPlayer, ev: AudioPlayerEventMap[K]) => any;

/**
 * 音频播放器。基于AudioContext
 */
export class AudioPlayer extends EventTarget
{
    private _context : AudioContext;
    private _buffer: AudioBuffer;
    private _sourceNode: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _onEndListener = (e:Event) => this._onended(e);

    /** 循环 */
    private _loop = false;
    /** 音量 */
    private _volume = 0;

    /** 播放开始的时间 */
    private _startTime = 0;
    /** 播放偏移 */
    private _offsetTime = 0;
    /** 暂停的位置 */
    private _pauseTime = 0;

    constructor ()
    {
        super();
    }

    /** 媒体时长 */
    get duration()
    {
        return this._buffer ? this._buffer.duration : 0;
    }

    /** 是否暂停 */
    get paused()
    {
        return this._sourceNode === undefined;
    }

    /** 音量 */
    get volume()
    {
        return this._volume;
    }

    /** 音量 */
    set volume(val)
    {
        this._volume = 0;
        if (this._gainNode)
            this._gainNode.gain.value = 0;
    }

    /** 当前播放的时间 */
    get currentTime()
    {
        if (!this._context) return 0;

        if (this.paused)
            return this._pauseTime;

        ///
        const duration = this.duration;
        const current = this._context.currentTime - this._startTime + this._offsetTime;
        if (current < duration)
        {
            return current;
        }
        else if (this._loop)
        {
            return current % duration;
        }
        else
        {
            return duration;
        }
    }

    set currentTime(val)
    {
        if (this.paused)
        {
            this._pauseTime = val;
        }
        else
        {
            this.play(val);
        }
    }

    /** 循环播放 */
    set loop(val)
    {
        this._loop = val;
        if (this._sourceNode)
            this._sourceNode.loop = val;
    }

    get loop() { return this._loop; }

    /** 打开音频数据并解码 */
    async open(src: string)
    {
        this.pause();

        const resp = await fetch(src);
        const buffer = await resp.arrayBuffer();

        ///
        return this.openBuffer(buffer);
    }

    /** 打开音频数据并解码 */
    async openBuffer(buffer:ArrayBuffer)
    {
        if (!this._context)
            this._context = new AudioContext();

        ///
        this._buffer = await this._context.decodeAudioData(buffer);
    }

    /** 开始播放 */
    play(start?:number)
    {
        const paused = this.paused;
        if (!paused)
        {
            this._stop();
        }

        ///
        this._start(start);

        ///
        if (paused)
            this._fire('play');
    }

    /** 暂停播放 */
    pause()
    {
        this._pauseTime = this.currentTime;
        this._stop();
        this._fire('pause');
    }

    /** 恢复播放 */
    resume()
    {
        this.play(this._pauseTime);
    }

    addEventListener<K extends keyof AudioPlayerEventMap>(type: K, listener: AudioPlayerListener<K>, options?: boolean | AddEventListenerOptions): void
    {
        super.addEventListener(type, listener, options);
    }

    removeEventListener<K extends keyof AudioPlayerEventMap>(type: K, listener: AudioPlayerListener<K>, options?: boolean | EventListenerOptions): void
    {
        super.removeEventListener(type, listener, options);
    }

    /** 开始播放 */
    private _start(start?:number)
    {
        if (!this._buffer) return new Error('not open!');

        ///
        if (start === undefined) start = this._pauseTime;
        if (start >= this.duration) start = 0;

        ///
        this._sourceNode = this._context.createBufferSource();
        this._sourceNode.buffer = this._buffer;
        this._sourceNode.loop = this._loop;
        this._sourceNode.addEventListener('ended', this._onEndListener);

        this._gainNode = this._context.createGain();
        this._gainNode.gain.value = this._volume;

        ///
        this._sourceNode.connect(this._gainNode);
        this._gainNode.connect(this._context.destination);

        ///
        this._sourceNode.start(0, start);
        this._startTime = this._context.currentTime;
        this._offsetTime = start || 0;
    }

    /** 停止播放 */
    private _stop()
    {
        if (this._sourceNode)
        {
            this._sourceNode.removeEventListener('ended', this._onEndListener);
            this._sourceNode.stop();
            this._sourceNode.disconnect();
            this._sourceNode = undefined;
        }

        if (this._gainNode)
        {
            this._gainNode.disconnect();
            this._gainNode = undefined;
        }
    }

    private _onended(e:Event)
    {
        this._pauseTime = this.currentTime;

        this._fire('ended');
        if (this._sourceNode)
        {
            this._sourceNode.disconnect();
            this._sourceNode = undefined;
        }

        if (this._gainNode)
        {
            this._gainNode.disconnect();
            this._gainNode = undefined;
        }
    }

    private _fire<K extends keyof AudioPlayerEventMap>(event: K)
    {
        this.dispatchEvent(new CustomEvent(event));
    }
}
