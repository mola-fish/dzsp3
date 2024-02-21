export declare enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4,
    NOLOG = 5
}
export declare class Log {
    level: LogLevel;
    constructor(level?: LogLevel);
    debug(text: string, args?: Array<any>): void;
    info(text: string, args?: Array<any>): void;
    warn(text: string, args?: Array<any>): void;
    error(text: string, args?: Array<any>): void;
    _assert(level: LogLevel, text: string, args?: Array<any>): void;
    _print(text: any, args: any): void;
}
