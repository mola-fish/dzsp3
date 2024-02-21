export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARNING"] = 3] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["NOLOG"] = 5] = "NOLOG";
})(LogLevel || (LogLevel = {}));
;
export class Log {
    constructor(level = LogLevel.NOLOG) {
        this.level = level;
    }
    debug(text, args = []) {
        this._assert(LogLevel.DEBUG, text, args);
    }
    info(text, args = []) {
        this._assert(LogLevel.INFO, text, args);
    }
    warn(text, args = []) {
        this._assert(LogLevel.WARNING, text, args);
    }
    error(text, args = []) {
        this._assert(LogLevel.ERROR, text, args);
    }
    _assert(level, text, args = []) {
        if (level >= this.level) {
            this._print(text, args);
        }
    }
    _print(text, args) {
        console.log(text, args);
    }
}
;
