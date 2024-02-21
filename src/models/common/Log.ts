export enum LogLevel{
    DEBUG = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4,
    NOLOG = 5,
};

export class Log {
    level: LogLevel
    constructor (level:LogLevel = LogLevel.NOLOG) {
        this.level = level;
    }

    debug (text:string, args:Array<any> = []) {
        this._assert(LogLevel.DEBUG, text, args);
    }

    info (text:string, args:Array<any> = []) {
        this._assert(LogLevel.INFO, text, args);
    }

    warn (text:string, args:Array<any> = []) {
        this._assert(LogLevel.WARNING, text, args);
    }

    error (text:string, args:Array<any> = []) {
        this._assert(LogLevel.ERROR, text, args);
    }

    _assert (level:LogLevel, text:string, args:Array<any> = []) {
        if (level >= this.level) {
            this._print(text, args);
        }
    }

    _print (text, args) {
        console.log(text, args);
    }
};
