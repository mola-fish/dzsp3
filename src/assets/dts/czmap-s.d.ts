/// <reference types="zmap-third-types" />
/// <reference types="zmap-third-types" />
/// <reference types="zmap-third-types" />
/**
 * Cegore
 *
 * 根命名空间，所有Cegore库都会存在于该命名空间
 */
declare namespace Cegore {
    var Version: number;
}
/**
 * end of file
 */
declare namespace Cegore {
    /**
     * 类 TypeCheck
     *
     * 用于JavaScript 类型检查
     *
     */
    class TypeCheck {
        /**
         * 返回值或者默认值
         *
         * 判断一个值是否定义，如果定义则，返回这个值，否则返回默认值
         *
         * @param value 待判断的值
         * @param default 默认值
         */
        static defaultValue(value: any, defaut: any): any;
        /**
         * 判断一个变量是否定义
         *
         * @param value 代判断的值
         * @returns 是否定义
         */
        static isDefined(value: any): boolean;
        /**
         * 判断一个变量是否为null
         */
        static isNull(value: any): boolean;
        /**
         * 这是一个修正的 typeof运算符
         *
         * Undefined 返回 'undefined'
         * null 返回 'null'
         * Boolean 返回 'boolean'
         * Number 返回 'number'
         * String 返回 'string'
         * Symbol 返回 'symbol'
         * 函数   返回  'function'
         * 数组   返回 'array'
         * Object 返回  'object'
         * @param value 带判断类型的值
         * @return 类型名称
         */
        static typeOf(value: any): string;
        /**
         * 判断是否为函数
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个函数，否则false.
         */
        static isFunction(value: any): boolean;
        /**
         * 判断是否为函数
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isString(value: any): boolean;
        /**
         * 判断是否为数字
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isNumber(value: any): boolean;
        /**
         * 判断是否为对象
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isObject(value: any): boolean;
        /**
         * 判断是否为布尔值
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isBool(value: any): boolean;
        /**
         * 判断是否为数组
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isArray(value: any): boolean;
        /**
         * 判断是否为某类型
         *
         * @param val
         * @param type
         */
        static isInstanceOf(val: any, type: any): boolean;
        private static _freezeObject;
        /**
         * 冻结对象
         *
         * 同Object.freeze，兼容不支持该接口的浏览器
         * @param o 要冻结的对象
         * @return 冻结后的对象
         */
        static freezeObject(o: any): any;
    }
}
declare namespace Cegore {
    /**
     * 提供Map容器的基本功能
     */
    class HashMap<T> {
        private _data;
        private _creator;
        /**
         * 构造一个新的Map<T>对象
         * @param creator 构造器，当获取的值不存在时，且没有指定默认值，则通过构造器创建默认值
         */
        constructor(creator?: any);
        /**
         * 获取值
         *
         * @param {string} key 要获取的key值
         * @param {T} def 当获取的值为null时，指定默认值
         *
         * @return {T} 返回获取到的值或者 undefined
         */
        getOrCreate(key: string, def?: T): T;
        /**
         * 获取 Map 中键为 key的对象
         * @param key 键值
         * @return {any|undefined}
         */
        get(key: string): T;
        /**
         * 设置值
         *
         * @param {string} key 设置的key值
         * @param {T} val 设置的val值
         */
        put(key: string, val: T): void;
        /**
         * 根据值获取对应的key
         *
         * @param {T} val 要获取key 的值对象
         */
        key(val: T): string;
        /**
         * 获取所有的key
         */
        keys(): any[];
        /**
         * 判断指定的元素是否存在
         */
        exist(key: string): boolean;
        /**
         * 移除指定的元素
         */
        remove(key: string): void;
        /**
         * 移除所有元素
         */
        clear(): void;
        /**
         * 移除所有元素
         */
        removeAll(): void;
    }
}
declare namespace Cegore {
    /**
     * 字符串处理辅助类
     */
    class StringUtil {
        /**
         * 判断一个字符串是否以指定的字符串开始
         *
         * @param str 待判断的字符串
         * @param pattern 字符串样式
         * @param ignoreCase 是否忽略大小写
         */
        static startsWidth(str: string, pattern: string, ignoreCase?: boolean): boolean;
        /**
         * 判断一个字符串是否以指定的字符串结束
         *
         * @param str 待判断的字符串
         * @param pattern 字符串样式
         * @param ignoreCase 是否忽略大小写
         */
        static endsWidth(str: string, pattern: string, ignoreCase?: boolean): boolean;
        /**
         * 解析整数，js parseInt函数的增强版
         *      解析输入数据为一个整数
         *      如果输入值不是一个数值，则返回默认值
         *      如果未指定默认值，则返回0
         *
         * @param {String} value 要解析的对象
         * @param {Number} def 默认值
         * @param [Number] radix 可选。表示要解析的数字的基数。
         */
        static parseInt(value: string | any, def?: number, radix?: number): number;
        /**
         * 解析整数，js parseFloat函数的增强版
         *      解析输入数据为一个整数
         *      如果输入值不是一个数值，则返回默认值
         *      如果未指定默认值，则返回0
         *
         * @param {String|any} value 要解析的对象
         * @param {Number} def 默认值
         */
        static parseFloat(value: string | any, def?: number): number;
        /**
         * 对象转Post请求的body
         * @param data
         * @returns
         */
        static toPostFormBody(data: {
            [type: string]: any;
        }): string;
    }
}
/**
 * End of file
 */ 
declare namespace Cegore {
    /**
     * @class
     */
    class ArrayUtil {
        /**
         * 查找数组，但可以自定义比较函数
         * @param item 查询的对象
         * @param array 查询到数组
         * @param cmp 比较函数
         */
        static indexOf(item: any, array: any[], cmp: any): number;
        /**
         * 一个空的数组，不可修改
         */
        static readonly EmptyArray: any;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 使用 xhr 加载数据
     */
    class LoadWithXhr {
        static loadWithXhr(options: any): void;
        /**
         * 使用xhr加载json数据
         *
         * @param options
         */
        static loadJSON(options: any): void;
        private static onPromise;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    class DOM {
        static createContext2D(width: number, height: number): CanvasRenderingContext2D;
    }
}
declare namespace Cegore {
    /**
     * 一个二维的点或者向量
     */
    class Vector2 {
        /**
         * x坐标值
         */
        x: number;
        /**
         * y坐标值
         */
        y: number;
        /**
         * 构造一个新的对象
         */
        constructor();
        /**
         * 通过x和y构造Vector2
         * @param x x坐标
         * @param y y坐标
         */
        constructor(x: number, y: number);
        /**
         * 通过数组构建Vector2
         * @param xyArray xy坐标数组
         */
        constructor(xyArray: number[]);
        /**
         * 通过包含x和y属性的对象构建Vector2
         * @param xyObj 包含x和y属性的对象
         */
        constructor(xyObj: {
            x: number;
            y: number;
        });
        /**
         * 获取当前向量的长度（点到原点的距离）
         */
        get length(): number;
        /**
         * 向量的权重，同length
         */
        get magnitude(): number;
        /**
         * 获取向量长度的平方，用于不需要知道实际长度的情况下，避免进行开方运算
         */
        get squaredLength(): number;
        /**
         * 通过x和y设置Vector2对象
         * @param x x坐标
         * @param y y坐标
         */
        set(x: number, y: number): any;
        /**
         * 通过数组设置Vector2
         * @param xyArray xy坐标数组
         */
        set(xyArray: number[]): any;
        /**
         * 通过包含x和y属性的对象设置Vector2
         * @param xyObj 包含x和y属性的对象
         */
        set(xyObj: {
            x: number;
            y: number;
        }): any;
        /**
         * 复制当前对象
         * @param result 一个可选的参数，用来存储输出结果
         * @returns 复制的对象
         */
        clone(result?: Vector2): Vector2;
        /**
         * 判断当前对象和指定的对象是否相等
         * @param right
         */
        equals(right?: Vector2): boolean;
        /**
         * 返回如下格式的字符串 '(x,y)'
         */
        toString(): string;
        /**
         * @private
         */
        _asCzVector2(): Cesium.Cartesian2;
        /**
         * 计算两个向量的距离
         * @param left
         * @param right
         */
        static distance(left: Vector2, right: Vector2): number;
        /**
         * 计算两个向量距离的平方
         * @param left
         * @param right
         */
        static squaredDistance(left: Vector2, right: Vector2): number;
        /**
         * 复制传入的对象
         * @param target 要复制的对象
         * @param result 可选的对象，用于存储复制结果
         */
        static clone(target: Vector2, result?: Vector2): Vector2;
        /**
         * 比较两个对象是否相等
         */
        static equals(left: Vector2, right: Vector2): boolean;
        /**
         * 计算两个向量的和
         * @param left
         * @param right
         * @param result
         */
        static add(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        /**
         * 计算两个向量的差
         * @param left
         * @param right
         * @param result
         */
        static sub(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        /**
         * 计算向量与标量的乘积
         * @param left
         * @param scalar
         * @param result
         */
        static mul(left: Vector2, scalar: number, result?: Vector2): Vector2;
        /**
         * 计算两个向量的乘积
         * @param left
         * @param right
         * @param result
         */
        static mul(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        /**
         * 计算向量与标量的商
         * @param left
         * @param scalar
         * @param result
         */
        static div(left: Vector2, scalar: number, result?: Vector2): Vector2;
        /**
         * 计算两个向量的商
         * @param left
         * @param right
         * @param result
         */
        static div(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        /**
         * 对当前向量取反
         * @param target
         * @param result
         */
        static negate(target: Vector2, result?: Vector2): Vector2;
        /**
         * 计算两个向量的点积（点乘）
         * @param left
         * @param right
         */
        static dot(left: Vector2, right: Vector2): number;
        /**
         * 计算两个向量的叉积（叉乘）
         * @param left
         * @param right
         */
        static cross(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        /**
         * 归一化向量
         * @param target
         * @param result
         */
        static normalize(target: Vector2, result?: Vector2): Vector2;
        /**
         * 计算两个点的中点
         * @param left
         * @param right
         * @param result
         */
        static middle(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        /**
         * 计算两个向量每个分量的最小值
         * @param left
         * @param right
         * @param result
         */
        static floor(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        /**
         * 计算两个向量每个分量的最大值
         * @param left
         * @param right
         * @param result
         */
        static ceil(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        private static _LerpStart;
        private static _LerpEnd;
        /**
         * 对两个向量进行插值
         * @param start 起点
         * @param end 终点
         * @param t 插值参数，介于[0,1]之间
         * @param result
         */
        static lerp(start: Vector2, end: Vector2, t: number, result?: Vector2): Vector2;
        private static _AngleStart;
        private static _AngleEnd;
        /**
         * 计算两个向量之间的夹角，返回弧度
         * @param start
         * @param end
         */
        static angle(start: Vector2, end: Vector2): number;
        /**
         * 向量（0,0）
         */
        static ZERO: Vector2;
        /**
         * 向量（1,1），单位向量
         */
        static UNIT: Vector2;
        /**
         * 向量（1,0）
         */
        static UNIT_X: Vector2;
        /**
         * 向量（0,1）
         */
        static UNIT_Y: Vector2;
        /**
         * 构造新对象或者使用旧对象
         * @param x
         * @param y
         * @param result
         */
        private static newOrResult;
    }
}
declare namespace Cegore {
    /**
     * 一个三维的点或者向量
     */
    class Vector3 {
        /**
         * x坐标值
         */
        x: number;
        /**
         * y坐标值
         */
        y: number;
        /**
         * z坐标值
         */
        z: number;
        /**
         * 构造一个新的对象
         */
        constructor();
        /**
         * 通过x,y和z构造Vector3
         * @param x x坐标
         * @param y y坐标
         * @param z z坐标
         */
        constructor(x: number, y: number, z: number);
        /**
         * 通过数组构建Vector3
         * @param xyzArray xyz坐标数组
         */
        constructor(xyzArray: number[]);
        /**
         * 通过包含x,y和z属性的对象构建Vector3
         * @param xyzObj 包含x,y和z属性的对象
         */
        constructor(xyzObj: {
            x: number;
            y: number;
            z: number;
        });
        /**
         * 获取当前向量的长度（点到原点的距离）
         */
        get length(): number;
        /**
         * 向量的权重，同length
         */
        get magnitude(): number;
        /**
         * 获取向量长度的平方，用于不需要知道实际长度的情况下，避免进行开方运算
         */
        get squaredLength(): number;
        /**
         * 通过x,y和z设置Vector3对象
         * @param x x坐标
         * @param y y坐标
         * @param z z坐标
         */
        set(x: number, y: number, z: number): any;
        /**
         * 通过数组设置Vector3
         * @param xyzArray xyz坐标数组
         */
        set(xyzArray: number[]): any;
        /**
         * 通过包含x,y和z属性的对象设置Vector3
         * @param xyzObj 包含x,y和z属性的对象
         */
        set(xyzObj: {
            x: number;
            y: number;
            z: number;
        }): any;
        /**
         * 复制当前对象
         * @param result 一个可选的参数，用来存储输出结果
         * @returns 复制的对象
         */
        clone(result?: Vector3): Vector3;
        /**
         * 判断当前对象和指定的对象是否相等
         * @param right
         */
        equals(right?: Vector3): boolean;
        /**
         * 返回如下格式的字符串 '(x,y,z)'
         */
        toString(): string;
        /**
         * @private
         */
        _asCzVector3(): Cesium.Cartesian3;
        /**
         * 计算两个向量的距离
         * @param left
         * @param right
         */
        static distance(left: Vector3, right: Vector3): number;
        /**
         * 计算两个向量距离的平方
         * @param left
         * @param right
         */
        static squaredDistance(left: Vector3, right: Vector3): number;
        /**
         * 复制传入的对象
         * @param target 要复制的对象
         * @param result 可选的对象，用于存储复制结果
         */
        static clone(target: Vector3, result?: Vector3): Vector3;
        /**
         * 比较两个对象是否相等
         */
        static equals(left: Vector3, right: Vector3): boolean;
        /**
         * 计算两个向量的和
         * @param left
         * @param right
         * @param result
         */
        static add(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        /**
         * 计算两个向量的差
         * @param left
         * @param right
         * @param result
         */
        static sub(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        /**
         * 计算向量与标量的乘积
         * @param left
         * @param scalar
         * @param result
         */
        static mul(left: Vector3, scalar: number, result?: Vector3): Vector3;
        /**
         * 计算两个向量的乘积
         * @param left
         * @param right
         * @param result
         */
        static mul(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        /**
         * 计算向量与标量的商
         * @param left
         * @param scalar
         * @param result
         */
        static div(left: Vector3, scalar: number, result?: Vector3): Vector3;
        /**
         * 计算两个向量的商
         * @param left
         * @param right
         * @param result
         */
        static div(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        /**
         * 对当前向量取反
         * @param target
         * @param result
         */
        static negate(target: Vector3, result?: Vector3): Vector3;
        /**
         * 计算两个向量的点积（点乘）
         * @param left
         * @param right
         */
        static dot(left: Vector3, right: Vector3): number;
        /**
         * 计算两个向量的叉积（叉乘）
         * @param left
         * @param right
         */
        static cross(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        /**
         * 归一化向量
         * @param target
         * @param result
         */
        static normalize(target: Vector3, result?: Vector3): Vector3;
        /**
         * 计算两个点的中点
         * @param left
         * @param right
         * @param result
         */
        static middle(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        /**
         * 计算两个向量每个分量的最小值
         * @param left
         * @param right
         * @param result
         */
        static floor(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        /**
         * 计算两个向量每个分量的最大值
         * @param left
         * @param right
         * @param result
         */
        static ceil(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        private static _LerpStart;
        private static _LerpEnd;
        /**
         * 对两个向量进行插值
         * @param start 起点
         * @param end 终点
         * @param t 插值参数，介于[0,1]之间
         * @param result
         */
        static lerp(start: Vector3, end: Vector3, t: number, result?: Vector3): Vector3;
        private static _AngleStart;
        private static _AngleEnd;
        private static _AngleCross;
        /**
         * 计算两个向量之间的夹角，返回弧度
         * @param start
         * @param end
         */
        static angle(start: Vector3, end: Vector3): number;
        /**
         * 向量（0,0）
         */
        static ZERO: Vector3;
        /**
         * 向量（1,1），单位向量
         */
        static UNIT: Vector3;
        /**
         * 向量（1,0）
         */
        static UNIT_X: Vector3;
        /**
         * 向量（0,1）
         */
        static UNIT_Y: Vector3;
        /**
         * 向量（0,0,1）
         */
        static UNIT_Z: Vector3;
        /**
         * 构造新对象或者使用旧对象
         * @param x
         * @param y
         * @param result
         */
        private static newOrResult;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 表示一个位置
     *
     * 该类封装了一个位置信息，表示空间上的一个某一点
     */
    class Position {
        private _x;
        private _y;
        private _z;
        /**
         * 构造一个新的LongLat对象
         */
        constructor(p0?: any, p1?: any, p2?: any);
        /**
         * 获取经度值
         */
        get lon(): number;
        /**
         * 获取纬度值
         */
        get lat(): number;
        /**
         * 获取高程
         */
        get altitude(): number;
        /**
         * 设置经度
         */
        set lon(value: number);
        /**
         * 设置纬度
         */
        set lat(value: number);
        /**
         * 设置高程
         */
        set altitude(value: number);
        /**
         * 获取x坐标，同lon
         */
        get x(): number;
        /**
         * 设置x坐标，同lon=val
         */
        set x(val: number);
        /**
         * 获取y坐标，同lat
         */
        get y(): number;
        /**
         * 设置y坐标，同lat=val
         */
        set y(val: number);
        /**
         * 获取z坐标，同altitude
         */
        get z(): number;
        /**
         * 设置z坐标，同altitude=val
         */
        set z(val: number);
        /**
         * 通过一个字符串数组设置
         * @param xyz
         */
        set(xyz: number[]): void;
        /**
         * 通过一个对象设置
         * @param xyz
         */
        set(xyz: {
            x?: number;
            y?: number;
            z?: number;
        }): void;
        /**
         * 通过数字设置
         * @param x
         * @param y
         * @param z
         */
        set(x: number, y: number, z?: number): void;
        /**
         * 通过字符串设置
         * @param x
         * @param y
         * @param z
         */
        set(x: string, y: string, z?: number): void;
        /**
         * 通过一个字符串数组构建
         * @param xyz
         */
        static from(xyz: number[]): Position;
        /**
         * 通过一个对象构建
         * @param xyz
         */
        static from(xyz: {
            x?: number;
            y?: number;
            z?: number;
        }): Position;
        /**
         * 通过数字构建
         * @param x
         * @param y
         * @param z
         */
        static from(x: number, y: number, z?: number): Position;
        /**
         * 通过字符串构建
         * @param x
         * @param y
         * @param z
         */
        static from(x: string, y: string, z?: number): Position;
        /**
         * 解析点字符串
         * @param lineStr 点位字符串，格式 'x,y,z|x,y,z|...';
         */
        static parsePoints(lineStr: any): any[];
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 一个二维的矩形区域
     *
     * Rectangle可以表述一个地理坐标（经纬度），也可以表示一个二维平面坐标
     * 在表示地理坐标的时候和二维平面坐标的时候某些行为有些不同，
     * 因为地理坐标系在经度方向上是循环连续的（-180和180的位置重合），
     * 所以在使用上需要注意。
     */
    class Rectangle {
        /**
         * x 的最小值
         */
        private _minx;
        /**
         * y 的最小值
         */
        private _miny;
        /**
         * x 的最大值
         */
        private _maxx;
        /**
         * y 的最大值
         */
        private _maxy;
        /**
         * 是否为空矩形
         */
        private _isEmpty;
        /**
         * 是否地理坐标
         */
        private _isGeographical;
        /**
         * 构造一个新的空矩形对象
         * @param isGeographical 表示当前对象是否表示的是地理坐标，默认值：<code>true</code>
         */
        constructor(isGeographical?: boolean);
        /**
         * 通过指定最大最小值构造矩形
         * @param minx x坐标最小值
         * @param miny y坐标最小值
         * @param maxx x坐标最大值
         * @param maxy y坐标最大值
         * @param isGeographical 表示当前对象是否表示的是地理坐标，默认值：<code>true</code>
         */
        constructor(minx: number, miny: number, maxx: number, maxy: number, isGeographical?: boolean);
        /**
         * 通过一个数组构造矩形
         * @param rectArray 一个包含4个数字的数组
         * @param isGeographical 表示当前对象是否表示的是地理坐标，默认值：<code>true</code>
         */
        constructor(rectArray: number[]);
        /**
         * 通过一个对象构造矩形
         * @param rectMinMax 一个包含 minx,miny,maxx,maxy属性的对象
         * @param isGeographical 表示当前对象是否表示的是地理坐标，默认值：<code>true</code>
         */
        constructor(rectMinMax: {
            minx: number;
            miny: number;
            maxx: number;
            maxy: number;
        }, isGeographical?: boolean);
        /**
         * 通过一个对象构造矩形
         * @param rectWSEN 一个包含 west,south,east,north属性的对象
         * @param isGeographical 表示当前对象是否表示的是地理坐标，默认值：<code>true</code>
         */
        constructor(rectWSEN: {
            west: number;
            south: number;
            east: number;
            north: number;
        }, isGeographical?: boolean);
        /**
         * 通过一个对象构造矩形
         * @param rectLBTR 一个包含 left,bottom,right,top属性的对象
         * @param isGeographical 表示当前对象是否表示的是地理坐标，默认值：<code>true</code>
         */
        constructor(rectLBTR: {
            left: number;
            bottom: number;
            right: number;
            top: number;
        }, isGeographical?: boolean);
        /**
         * 获取minx
         */
        get minx(): number;
        /**
         * 设置minx，如果当前是地理坐标，则只能设置为 [-180,180] 之间
         */
        set minx(val: number);
        /**
         * 获取maxx
         */
        get maxx(): number;
        /**
         * 设置maxx，如果当前是地理坐标，则只能设置为 [-180,180] 之间
         */
        set maxx(val: number);
        /**
         * 获取miny
         */
        get miny(): number;
        /**
         * 设置miny，如果当前是地理坐标，则只能设置为 [-90,90] 之间
         */
        set miny(val: number);
        /**
         * 获取maxy
         */
        get maxy(): number;
        /**
         * 设置maxy，如果当前是地理坐标，则只能设置为 [-90,90] 之间
         */
        set maxy(val: number);
        /**
         * 获取当前矩形是否为<空>
         */
        get empty(): boolean;
        /**
         * 设置当前矩形是否为<空>
         */
        set empty(empty: boolean);
        /**
         * 返回当前对象是否是表示的是地理坐标
         */
        get isGeographical(): boolean;
        /**
         * 获取矩形的宽度
         */
        get width(): number;
        /**
         * 获取矩形的高度
         */
        get height(): number;
        /**
         * 获取最西边的值，等同于minx
         */
        get west(): number;
        /**
         * 设置最西边的值，等永远minx = val
         */
        set west(val: number);
        /**
         * 获取最东边的值，等永远maxx
         */
        get east(): number;
        /**
         * 设置最东边的值，等永远maxx = val
         */
        set east(val: number);
        /**
         * 获取最南边的值，等永远miny
         */
        get south(): number;
        /**
         * 设置最南边的值，等同于miny = val
         */
        set south(val: number);
        /**
         * 获取最北边的值，等同于maxy
         */
        get north(): number;
        /**
         * 设置最北边的值，等同于maxy = val
         */
        set north(val: number);
        /**
         * 获取最左边的值，等同于minx
         */
        get left(): number;
        /**
         * 设置最左边的值，等永远minx = val
         */
        set left(val: number);
        /**
         * 获取最右边的值，等永远maxx
         */
        get right(): number;
        /**
         * 设置最右边的值，等永远maxx = val
         */
        set right(val: number);
        /**
         * 获取最下边的值，等永远miny
         */
        get bottom(): number;
        /**
         * 设置最下边的值，等同于miny = val
         */
        set bottom(val: number);
        /**
         * 获取最上边的值，等同于maxy
         */
        get top(): number;
        /**
         * 设置最上边的值，等同于maxy = val
         */
        set top(val: number);
        /**
         * 获取矩形的中心点
         * @param result 一个可选的对象，用来存储矩形的中心点
         * @returns 返回矩形的中心点
         */
        center(result?: Position): Position;
        /**
         * 获取最小点
         * @param result
         */
        min(result?: Position): Position;
        /**
         * 获取最大点
         * @param result
         */
        max(result?: Position): Position;
        /**
         * 获取左下角
         * @param result
         */
        leftBottom(result?: Position): Position;
        /**
         * 获取左上角
         * @param result
         */
        leftTop(result?: Position): Position;
        /**
         * 获取右上角
         * @param result
         */
        rightTop(result?: Position): Position;
        /**
         * 获取右下角
         * @param result
         */
        rightBottom(result?: Position): Position;
        /**
         * 获取西南角
         * @param result
         */
        southWest(result?: Position): Position;
        /**
         * 获取东南角
         * @param result
         */
        southEast(result?: Position): Position;
        /**
         * 获取西北角
         * @param result
         */
        northWest(result?: Position): Position;
        /**
         * 获取东北角
         * @param result
         */
        northEast(result?: Position): Position;
        inflate(f: number): any;
        inflate(x: number, y: number): any;
        inflate(pt: Vector2): any;
        /**
         * 合并指定的点到当前矩形中
         * @param x 要合并到矩形中的点x坐标
         * @param y 要合并到矩形中的点y坐标
         */
        merge(x: number, y: number): void;
        /**
         * 合并指定的点到当前矩形中
         * @param pos 要合并到矩形中的点
         */
        merge(pos: Position): void;
        /**
         * 合并指定的矩形到当前矩形中
         * @param rect 要合并的矩形
         */
        merge(rect: Rectangle): void;
        /**
         * 合并指定的点数组到当前矩形中
         * @param posList 要合并的点数组
         */
        merge(posList: Position[]): void;
        /**
         * 合并指定的矩形数组到当前矩形中
         * @param rectList 要合并的矩形数组
         */
        merge(rectList: Rectangle[]): void;
        /**
         * 将当前矩形对象转换成一个数组对象
         *
         * @param result 一个可选的对象，用于存储输出结果
         * @return 一个数组包含矩形的最小值最大值，如：[minx,miny,maxx,maxy]。
         */
        asArray(result?: number[]): number[];
        /**
         * 复制当前对象
         * @param result 一个可选的对象，用于存储复制结果
         * @returns 复制的结果
         */
        clone(result?: Rectangle): Rectangle;
        /**
         * 判断是否包含点
         * @param rc
         */
        contains(rc: Position): boolean;
        /**
         * 判断是否包含矩形
         */
        contains(rc: Rectangle): boolean;
        /**
         * 求取两个矩形的交集，如果两个矩形不相交，返回undefined
         * @param rc
         * @param result
         */
        intersection(rc: Rectangle, result?: Rectangle): Rectangle;
        /**
         * @private
         */
        toCZRectangle(): Cesium.Rectangle;
        static toCZRectangle(any: any): Cesium.Rectangle;
        /**
         * 标准化经度，使输入的经度处于[-180,180]之间
         * @param lon 待处理的经度
         * @return 返回标准化后的经度
         */
        static normalizeLongitude(lon: number): number;
        /**
         * 标准化纬度，使输入的纬度处于[-90,90]之间
         * @param lat 待处理的纬度
         * @return 返回标准化后的纬度
         */
        static normalizeLatitude(lat: number): number;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 表述模型的姿态信息
     */
    class HeadingPitchRoll {
        private _heading;
        private _pitch;
        private _roll;
        /**
         * 构造函数
         */
        constructor(v0?: any, v1?: any, v2?: any);
        /**
         * 获取 方位角，绕Z轴旋转，单位：度
         */
        get heading(): number;
        /**
         * 设置 方位角，绕Z轴旋转，单位：度
         */
        set heading(heading: number);
        /**
         * 获取 俯仰角，绕Y轴旋转，单位：度
         */
        get pitch(): number;
        /**
         * 设置 俯仰角，绕Y轴旋转，单位：度
         */
        set pitch(pitch: number);
        /**
         * 获取 滚转角，绕X轴旋转，单位：度
         */
        get roll(): number;
        /**
         * 设置 滚转角，绕X轴旋转，单位：度
         */
        set roll(roll: number);
        /**
         * 设置 heading pitch roll
         * @param heading 方位角
         * @param pitch 俯仰角
         * @param roll 滚转角
         */
        set(heading: number, pitch: number, roll: number): any;
        /**
         * 使用数组设置 heading pitch roll
         * @param hpr[0] 方位角
         * @param hpr[1] 俯仰角
         * @param hpr[2] 滚转角
         */
        set(hpr: number[]): any;
        /**
         * 使用对象设置 heading pitch roll
         * @param hpr.heading 方位角
         * @param hpr.pitch 俯仰角
         * @param hpr.roll 滚转角
         */
        set(hpr: {
            heading: number;
            pitch: number;
            roll: number;
        }): any;
        /**
         * 使用 HeadingPitchRoll 对象设置 heading pitch roll
         * @param hpr 姿态信息
         */
        set(hpr: HeadingPitchRoll): any;
        /**
         * 使用弧度设置 heading pitch roll
         * @param heading 方位角
         * @param pitch 俯仰角
         * @param roll 滚转角
         */
        setFromRadius(heading: number, pitch: number, roll: number): any;
        /**
         * 使用弧度数组设置 heading pitch roll
         * @param hpr[0] 方位角
         * @param hpr[1] 俯仰角
         * @param hpr[2] 滚转角
         */
        setFromRadius(hpr: number[]): any;
        /**
         * 使用弧度对象设置 heading pitch roll
         * @param hpr.heading 方位角
         * @param hpr.pitch 俯仰角
         * @param hpr.roll 滚转角
         */
        setFromRadius(hpr: {
            heading: number;
            pitch: number;
            roll: number;
        }): any;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 定义了一个局部坐标下的方位角，高度角和距离
     */
    class HeadingPitchDistance {
        /**
         * 相对于正北方向的方位角
         */
        heading: number;
        /**
         * 相对于xy平面的高度角
         */
        pitch: number;
        /**
         * 局部坐标下相对于的中心的距离
         */
        distance: number;
        /**
         * 构造一个默认的 HeadingPitchDistance
         */
        constructor();
        /**
         * 通过 heading，pitch，distance三个参数构造 HeadingPitchDistance
         * @param heading
         * @param pitch
         * @param distance
         */
        constructor(heading?: number, pitch?: number, distance?: number);
        /**
         * 通过一个包含三个成员的数组构造 HeadingPitchDistance
         * @param hpdArray
         */
        constructor(hpdArray: number[]);
        /**
         * 通过包含 heading，pitch，distance三个属性的对象构造 HeadingPitchDistance
         * @param hpdObj
         */
        constructor(hpdObj: {
            heading?: number;
            pitch?: number;
            distance?: number;
        });
        /**
         * 通过 heading，pitch，distance三个参数设置当前对象
         * @param heading
         * @param pitch
         * @param distance
         */
        set(heading?: number, pitch?: number, distance?: number): void;
        /**
         * 通过一个包含三个成员的数组设置当前对象
         * @param hpdArray
         */
        set(hpdArray: number[]): void;
        /**
         * 通过包含 heading，pitch，distance三个属性的对象设置当前对象
         * @param hpdObj
         */
        set(hpdObj: {
            heading?: number;
            pitch?: number;
            distance?: number;
        }): void;
        /**
         * @private
         */
        _asCzObject(result?: Cesium.HeadingPitchRange): Cesium.HeadingPitchRange;
    }
}
declare namespace Cegore {
    /**
     * 地理计算
     *
     * 地理计算类主要提供一些工具函数，用于常用的地理计算函数
     */
    class GeoMath {
        private static _degree2radian;
        private static _radian2degree;
        /**
         * 度转弧度
         * @param degree
         */
        static toRadian(degree: any): number;
        /**
         * 弧度转度
         * @param radian
         */
        static toDegree(radian: any): number;
        /**
         * 限制val的取值范围，如果val小于min则返回min，如果val大于max则返回max，否则返回val
         *
         * @param val 输入值
         * @param min 最小值
         * @param max 最大值
         */
        static clamp(val: number, min: number, max: number): number;
        /**
         * 同 Math.acos，计算之前先 clamp值到 [-1.0,1.0] 之间，避免返回NaN
         * @param val
         */
        static acosClamped(value: number): number;
        /**
         * 同 Math.asin，计算之前先 clamp值到 [-1.0,1.0] 之间，避免返回NaN
         * @param val
         */
        static asinClamped(value: number): number;
        /**
         * 返回一个[0,1)之间的随机数
         */
        static random(): any;
        /**
         * 返回一个[0,max)之间的随机数
         */
        static random(max: number): any;
        /**
         * 返回一个[min,max)之间的随机数
         */
        static random(min: number, max: number): any;
        /**
         * 计算多个点之间的距离
         * @param pts 点列表
         * @param radius 地球半径
         */
        static surfaceDistance(pts: any[], radius?: number): any;
        /**
         * 计算两点之间的距离
         * @param pt0
         * @param pt1
         */
        static surfaceDistance(p0: any, p1?: any, radius?: number): any;
        /**
         * 计算两个角度之间的夹角
         * @param a1
         * @param a2
         */
        static innerAngle(a1: number, a2: number): number;
        /**
         * 标准化角度，使输入的角度处于[-180,180]之间
         * @param angle 待处理的角度
         * @return 返回标准化后的角度
         */
        static stdAngle(angle: number): number;
        /**
         * 计算地球表面上多边形的投影面积
         * @param polygon 多边形，定点序列，坐标为经纬度坐标
         * @param radius 地球半径
         */
        static surfaceArea(polygon: Position[], radius?: number): number;
        /**
         * 计算多边形的面积
         * @param polygon 多边形的点序列，输入坐标为笛卡尔坐标系下的二维坐标
         */
        static area(polygon: any[]): number;
        /**
         * 计算带方向的面积
         * @param pts 多边形点序列
         */
        static signedArea(pts: any[]): number;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 在多条线段间进行形插值
     */
    class MultiLineInterp {
        private _bridges;
        constructor(options: {
            lines: any[];
        });
        /**
         * 插值折线或者多边形
         * @param amount
         */
        interp(amount: number): Vector2[];
    }
}
declare namespace Cegore {
    /**
     * 基于Canvas的绘制类，提供基础的功能
     */
    class CanvasDraw {
        private _canvas;
        private _ctx;
        private _rect;
        private _geoWidth;
        private _getHeight;
        /**
         * 构造函数
         * @param options 一个可选的参数
         * @param options.canvas 一个可选的参数，指定使用的canvas dom 或者 id
         * @param options.width 指定画布的宽度，默认值：512
         * @param options.heigth 指定画布的高度，默认值：512
         */
        constructor(options?: {
            canvas?: HTMLCanvasElement | string;
            width?: number;
            height?: number;
        });
        /**
         * 获取输出的Canvas
         */
        get canvas(): HTMLCanvasElement;
        /**
         * 获取 Context2D
         */
        get context(): any;
        /**
         * 获取数据的范围
         */
        get rect(): Rectangle;
        /**
         * 获取画布的宽度
         */
        get width(): number;
        /**
         * 获取画布的高度
         */
        get height(): number;
        /**
         * 清空画布
         */
        clear(): void;
        /**
         * 计算数据的范围
         * @param lines
         */
        protected calcRect(lines: any): void;
        /**
         * X坐标转画布坐标
         * @param x
         */
        protected convertX(x: number): number;
        /**
         * Y坐标转画布坐标
         * @param y
         */
        protected convertY(y: number): number;
        /**
         * 创建或者使用输入的Canvas
         * @param canvas 一个可选的参数，指定使用的Canvas
         */
        protected createCanvasContext2D(canvas: HTMLCanvasElement | string, width: any, height: any): any;
    }
}
declare namespace Cegore {
    /**
     * 多边形掩码
     */
    class PolygonMask extends CanvasDraw {
        private _interp;
        /**
         * 构造一个多边形掩码对象
         * @param lines 多边形的点
         * @param options
         */
        constructor(lines: Vector2[][], options?: {
            canvas?: HTMLCanvasElement | string;
            width?: number;
            height?: number;
        });
        /**
         * 绘制指定时刻的多边形掩码
         * @param amount
         */
        draw(amount: number): void;
    }
}
declare namespace Cegore {
    /**
     * 折线，多边形渐变
     */
    class PolylineGradual extends CanvasDraw {
        private _lines;
        private _fadein;
        private _fadeout;
        private _fill;
        private _canvas1;
        private _ctx1;
        private _canvas2;
        private _ctx2;
        constructor(lines: any, options?: {
            canvas?: HTMLCanvasElement | string;
            width?: number;
            height?: number;
            fadein?: number;
            fadeout?: number;
        });
        draw(amount: number): void;
        private drawLine;
        private drawMix;
    }
}
declare namespace Cegore {
    class DynamicArea {
        private _geometry;
        private _primitive;
        private _appearance;
        private _material;
        private _polygonMask;
        private _viewer;
        constructor(options: {
            viewer: Viewer;
            canvas: HTMLCanvasElement | string;
            lines: Vector2[][];
            textureSize: {
                width: number;
                height: number;
            };
            height: number;
            extrudedHeight: number;
        });
        draw(amount: number): void;
        set visible(visible: boolean);
        get visible(): boolean;
        /**
         * 删除该对象
         */
        remove(): void;
    }
}
declare namespace Cegore {
    /**
     * 颜色类
     *
     * 使用 red，green，blue和alpha四个[0.0, 1.0]之间的浮点数分量描述颜色信息
     */
    class Color {
        private _r;
        private _g;
        private _b;
        private _a;
        /**
         * 通过一个 css 字符串构造颜色对象
         *
         * @param cssColor css格式的颜色字符串：'red', '#rgb', '#rrggbb', 'rgb(r,g,b)', 'rgba(r,g,b,a)', 'hls()', 'hlsa()'
         *
         * @example
         * <pre>
         * var blue = new Color('blue');
         * var green = new Color('#0f0');
         * var red = new Color('rgb(255,0,0)');
         * </pre>
         */
        constructor(cssColor: string);
        /**
         * 通过一个数组构造一个颜色对象
         *
         * @param colorArray 一个包含3个或者4个数字的数组
         * @example
         * <pre>
         * var color = new Color([1.0, 0.5, 0.0]);
         * var color = new Color([1.0, 0.5, 0.0, 1.0]);
         * </pre>
         */
        constructor(colorArray: number[]);
        /**
         * 通过一个对象构造颜色对象
         *
         * @param colorObj 一个包含属性 r，g，b，a的对象
         * @param colorObj.r 红色分量
         * @param colorObj.g 绿色分量
         * @param colorObj.b 蓝色分量
         * @param colorObj.a 透明分量
         *
         * @example
         * <pre>
         * var color = new Color({r:1, g:0, b:0, a:1});
         * </pre>
         */
        constructor(colorObj: {
            r: number;
            g: number;
            b: number;
            a?: number;
        });
        constructor(colorObj: Cesium.Color);
        /**
         * 通过 r,g,b,a四个分量构造颜色对象
         * @param r 红色分量
         * @param g 绿色分量
         * @param b 蓝色分量
         * @param a 透明分量
         */
        constructor(r: number, g: number, b: number, a?: number);
        /**
         * 通过一个Color对象设置当前对象
         * @param color
         */
        set(color: Color): void;
        /**
         * 通过 css 颜色字符串设置当前对象
         * @param cssColor
         */
        set(cssColor: string): void;
        /**
         * 通过一个数组构造一个颜色对象
         *
         * @param colorArray 一个包含3个或者4个数字的数组
         */
        set(colorArray: number[]): void;
        /**
         * 通过一个对象设置颜色对象
         *
         * @param colorObj 一个包含属性 r，g，b，a的对象
         * @param colorObj.r 红色分量
         * @param colorObj.g 绿色分量
         * @param colorObj.b 蓝色分量
         * @param colorObj.a 透明分量
         */
        set(colorObj: {
            r: number;
            g: number;
            b: number;
            a?: number;
        }): void;
        /**
         * 通过 r,g,b,a四个分量设置颜色对象
         * @param r 红色分量
         * @param g 绿色分量
         * @param b 蓝色分量
         * @param a 透明分量
         */
        set(r: number, g: number, b: number, a?: number): void;
        /**
         * 获取红色分量
         */
        get red(): number;
        /**
         * 获取绿色分量
         */
        get green(): number;
        /**
         * 获取蓝色分量
         */
        get blue(): number;
        /**
         * 获取透明度分量
         */
        get alpha(): number;
        /**
         * 获取红色分量
         */
        get r(): number;
        /**
         * 获取绿色分量
         */
        get g(): number;
        /**
         * 获取蓝色分量
         */
        get b(): number;
        /**
         * 获取透明度分量
         */
        get a(): number;
        /**
         * 设置红色分量
         */
        set r(value: number);
        /**
         * 设置绿色分量
         */
        set g(value: number);
        /**
         * 设置蓝色分量
         */
        set b(value: number);
        /**
         * 设置透明度分量
         */
        set a(value: number);
        /**
         * 红色 <span class="colorSwath" style="background: #FF0000;"></span>
         */
        static readonly RED: Color;
        /**
         * 绿色 <span class="colorSwath" style="background: #00FF00;"></span>
         */
        static readonly GREEN: Color;
        /**
         * 蓝色 <span class="colorSwath" style="background: #0000FF;"></span>
         */
        static readonly BLUE: Color;
        /**
         * 黑色 <span class="colorSwath" style="background: #000000;"></span>
         */
        static readonly BLACK: Color;
        /**
         * 白色 <span class="colorSwath" style="background: #FFFFFF;"></span>
         */
        static readonly WHITE: Color;
        /**
         * 黄色 <span class="colorSwath" style="background: #FFFF00;"></span>
         */
        static readonly YELLOW: Color;
        /**
         * 青色 <span class="colorSwath" style="background: #00FFFF;"></span>
         */
        static readonly AUQA: Color;
        /**
         * 品红 <span class="colorSwath" style="background: #FF00FF;"></span>
         */
        static readonly FUCHSIA: Color;
        /**
         * 灰色 <span class="colorSwath" style="background: #808080;"></span>
         */
        static readonly GRAY: Color;
        /**
         * 从CSS格式颜色字符构造颜色对象
         *
         * @param css CSS格式的颜色字符串
         */
        static fromCssColor(css: string): Color;
        /**
         * 通过 0-255的 RGBA分量构造颜色对象
         * @param r [0-255]的红色分量
         * @param g [0-255]的的绿分量
         * @param b [0-255]的的蓝分量
         * @param a [0-255]的的透明分量
         * @param result 用于存储结果的对象
         */
        static fromBytes(r: number, g: number, b: number, a: number, result?: any): Color;
        /**
         * 从一个32位的 RGBA 构造颜色
         * @param rgba 32位的RGBA颜色
         * @param result 用于存储结果的对象
         */
        static fromRGBA32(rgba: number, result?: Color): Color;
        /**
         * 根据指定的参数随机生成颜色
         *
         * @param options 用于生成随机颜色的参数
         * @param options.red 如果指定该参数，则是用该参数代替随机值
         * @param options.minRed 指定随机颜色的最小值，默认为0.0
         * @param options.maxRed 指定随机颜色的最大值，默认为1.0
         * @param options.blue 如果指定该参数，则是用该参数代替随机值
         * @param options.minBlue 指定随机颜色的最小值，默认为0.0
         * @param options.maxBlue 指定随机颜色的最大值，默认为1.0
         * @param options.green 如果指定该参数，则是用该参数代替随机值
         * @param options.minGreen 指定随机颜色的最小值，默认为0.0
         * @param options.maxGreen 指定随机颜色的最大值，默认为1.0
         * @param options.alpha 如果指定该参数，则是用该参数代替随机值
         * @param options.minAlpha 指定随机颜色的最小值，默认为0.0
         * @param options.maxAlpha 指定随机颜色的最大值，默认为1.0
         * @param result 一个可选的颜色对象，用于输出存储结果
         */
        static fromRandom(options?: {
            red?: number;
            minRed?: number;
            maxRed?: number;
            green?: number;
            minGreen?: number;
            maxGreen?: number;
            blue?: number;
            minBlue?: number;
            maxBlue?: number;
            alpha?: number;
            minAlpha?: number;
            maxAlpha?: number;
        }, result?: Color): Color;
        /**
         * 将当前颜色转成 CSS 颜色字符串
         * @return 返回一个表示的颜色的CSS字符串
         */
        toCssColor(): string;
        /**
         * 将当前颜色转成 字节数组 [r, g, b, a] , 颜色值为 [0,255]
         * @param result 一个可选的数组对象，用来存储输出值
         * @return 返回一个数组，存储颜色字节
         */
        toBytes(result?: number[]): number[];
        /**
         * 将当前的颜色转为一个32位的 RGBA 整数
         */
        toRGBA32(): number;
        /**
         * @private
         */
        toCZColor(): Cesium.Color;
        private static ScratchArrayBuffer;
        private static UnionUint32;
        private static UnionUint8;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 材质
     */
    abstract class Material {
        /**
         * 获取类型
         */
        abstract get type(): string;
        /**
         * 获取材质
         * @private
         */
        abstract get czmat(): any;
    }
    /**
     * 颜色材质
     */
    class ColorMaterial extends Material {
        private _czmat;
        private _color;
        /**
         * 构造一个颜色材质
         * @param color
         */
        constructor(color: Color);
        /**
         * 获取类型
         */
        get type(): string;
        /**
         * 获取材质
         * @private
         */
        get czmat(): any;
        /**
         * 获取颜色
         */
        get color(): Color;
        /**
         * 设置颜色
         */
        set color(val: Color);
    }
    /**
     * 图片材质
     *
     * 支持 URL，Image，Canvas，Video
     */
    class ImageMaterial extends Material {
        private _czmat;
        private _color;
        private _image;
        private _repeat;
        private _transparent;
        /**
         * 构造一个图像材质
         * @param options 一个可选的参数
         * @param options.image 指定显示的图像，可以是URL，Image，Canvas和Video
         * @param options.repeat 指定图像重复显示的次数，默认值：[1.0, 1.0]
         * @param options.color 指定显示时叠加的颜色，默认值：Color.WHITE
         * @param options.transparent 指定材质是否透明显示，当图片包含透明信息是设置为true
         */
        constructor(options?: {
            image?: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
            repeat?: number[] | {
                x: number;
                y: number;
            };
            color?: Color | string;
            transparent?: boolean;
        });
        /**
         * 获取类型
         */
        get type(): string;
        /**
         * 获取材质
         * @private
         */
        get czmat(): any;
        /**
         * 获取颜色
         */
        get color(): Color;
        /**
         * 设置颜色
         */
        set color(val: Color);
        /**
         * 获取该材质使用的 Image,URL,Canvas,Video
         */
        get image(): any;
        /**
         * 设置该材质使用的 Image,URL,Canvas,Video
         */
        set image(img: any);
        /**
         * 获取图像重复显示的次数，默认值：[1, 1]
         */
        get repeat(): Vector2;
        /**
         * 设置图像重复显示的次数，默认值：[1, 1]
         */
        set repeat(repeat: Vector2);
        /**
         * 返回当前材质是否透明
         */
        get transparent(): boolean;
        /**
         * 设置当前材质是否透明
         */
        set transparent(val: boolean);
    }
}
/**
 * end of file
 */
declare namespace Cegore {
    interface TreeItem {
        /**
         * 获取名称
         */
        readonly name: string;
        /**
         * 获取父对象
         */
        readonly parent: TreeItem;
        /**
         * 是否叶子节点
         */
        readonly isLeaf: boolean;
        /**
         * 获取子对象列表
         */
        readonly children: TreeItem[];
        /**
         * 添加到节点上
         */
        onAdded(parent: TreeItem): any;
        /**
         * 被移除
         */
        onRemoved(): any;
        /**
         * 与根节点断开
         */
        onAttachRoot(): any;
        /**
         * 连接到根节点
         */
        onDetachRoot(): any;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 事件类
     *
     * 一个通用的工具类，用于管理一个特别的事件。
     *
     * @example
     *
     * 示例1
     *
     * function callback(arg1, arg2){
     * }
     *
     * var evt = new Event();
     * evt.on(callback);
     * evt.fire(1, 2);
     * evt.off(callback);
     *
     * 示例2
     * function MyObject(){
     * }
     *
     * MyObject.prototype.callback = function(arg1, arg2){
     *      this.mArg1 = arg1;
     *      this.mArg2 = arg2;
     * }
     *
     * var obj = new MyObject();
     * var evt = new Event();
     * evt.on(obj.callback, obj);
     * evt.fire(1, 2);
     * evt.off(obj.callback, obj);
     *
     */
    class Event {
        /**
         * 事件监听器列表
         */
        private _listeners;
        /**
         * 注册事件
         *
         * 当事件触发时，回调函数将会被调用，当指定self是，self将作为回调函数的<code>this</code>
         *
         * @param callback 事件回调函数，当事件触发时被调用
         * @param self 一个可选的对象，当回调函数被调用时，作为回调函数的 <code>this</code> 指针。
         */
        on(callback: (...args: any[]) => any, self?: any): void;
        /**
         * 反注册事件
         *
         * 移除之前注册的事件回调函数
         *
         * @param callback 使用 on 注册时传入的 callback
         * @param self 使用 on 注册时传入的 self
         */
        off(callback: (...args: any[]) => any, self?: any): void;
        /**
         * 触发事件，调用所有注册的回调函数
         *
         * @param args 传给事件回调函数的参数列表
         */
        fire(...args: any[]): void;
        /**
         * 同函数 <code>on</code>
         * @see
         * Event.on
         */
        addEventListener(callback: (...args: any[]) => any, self?: any): void;
        /**
         * 同函数 <code>off</code>
         * @see
         * Event.off
         */
        removeEventListener(callback: (...args: any[]) => any, self?: any): void;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 事件句柄
     */
    class EventHandle {
        private _events;
        /**
         * 构造函数
         * @param options
         */
        constructor(options?: any);
        /**
         * 注册事件
         * @param type 事件类型
         * @param callback 事件回调
         * @param self 回调的this
         */
        on(type: string, callback: any, self?: any): void;
        /**
         * 反注册事件
         * @param type 事件类型
         * @param callback 事件回调
         * @param self 回调的this
         */
        off(type: string, callback: any, self?: any): void;
        /**
         * 触发事件
         * @param type 事件类型
         * @param arg 事件参数
         */
        fire(type: string, ...args: any[]): void;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 自动名称
     *
     * 用于自动生成不重复的名称字符串
     */
    class AutoNames {
        /**
         * 下一个名称的序号
         */
        private static NextIndex;
        /**
         * 生成一个名称
         *
         * 如果指定了名称则使用该名称，未指定则自动使用前缀加序号生成名称
         *
         * @param name 如果指定了名称，则使用该名称
         * @param prefix 自动生成名称的前缀
         */
        static genName(name?: string, prefix?: string): string;
    }
}
declare namespace Cegore {
    /**
     * 一个简单的时钟类，用来模拟时间
     *
     * 该类还记录了一个时间区间，用来指导时间轴的显示
     */
    class Clock {
        private _czClock;
        private _onTick;
        /**
         * 构造一个新的时钟类
         * @param viewer
         */
        constructor(viewer: Viewer);
        /**
         * tick 事件，当时间改变时调用
         * @event
         */
        get onTick(): Event;
        /**
         * 获取当前时间
         */
        get currentTime(): Date;
        /**
         * 设置当前时间
         */
        set currentTime(value: Date);
        /**
         * 获取开始时间
         */
        get startTime(): Date;
        /**
         * 设置开始时间
         */
        set startTime(value: Date);
        /**
         * 获取停止时间
         */
        get stopTime(): Date;
        /**
         * 设置停止时间
         */
        set stopTime(value: Date);
    }
}
/**
 * End of file
 */ 
declare namespace Cegore {
    /**
     * 相机类
     *
     * 通过该接口可以控制相机的位置和方向
     *
     * @example
     * <pre>
     * 移动相机
     * camera.flyTo({
     *     position : [117.16, 32.71, 15000.0]
     * });
     *
     * 使用事件
     * camera.moveStart.on(function() { console.log('moveStart');  });
     * </pre>
     */
    class Camera {
        private _viewer;
        private _czData;
        private _czCamera;
        private _position;
        private _orientation;
        private _eventChanged;
        private _eventMoveStart;
        private _eventMoveEnd;
        /**
         * 构造函数
         *
         * 不要调用此构造函数，通过viewer对象获取相机类
         *
         * @param viewer
         */
        constructor(viewer: Viewer);
        /**
         * 获取当前相机的位置
         */
        get position(): Position;
        /**
         * 设置相机的当前位置
         */
        set position(pos: Position);
        /**
         * 获取相机的当前姿态
         */
        get orientation(): HeadingPitchRoll;
        /**
         * 设置相机的当前姿态
         */
        set orientation(hpr: HeadingPitchRoll);
        /**
         * 相机改变事件
         *
         * 该事件仅在相机发生一定变化后出发，如有其他需求，请使用 moveStart 和 moveEnd 事件
         * 事件原型 ```function (camera) {};```
         * @event
         */
        get changed(): Event;
        /**
         * 相机开始移动事件
         *
         * 事件原型 ```function (camera) {};```
         * @event
         */
        get moveStart(): Event;
        /**
         * 相机结束移动事件
         *
         * 事件原型 ```function (camera) {};```
         * @event
         */
        get moveEnd(): Event;
        /**
         * 设置相机的从当前位置飞行到目标点
         *
         * @param options 包含如下属性
         * @param options.position 指定飞行的目标位置
         * @param options.rect 指定飞行目标矩形范围信息
         * @param options.orientation 指定飞行时的姿态
         * @param options.duration 指定飞行的时长，单位：秒。如果不指定，则自动计算
         * @param options.complete 指定飞行完成后的回调函数
         * @param options.cancel 指定飞行取消后的回调函数
         *
         * @description
         * options.position 和 options.rect 任选一个，如果都没有指定则抛出异常
         *
         * @example
         *
         * ```ts
         * // 1. 飞行到一个位置
         * camera.flyTo({
         *     position : [117.16, 32.71, 15000.0]
         * });
         *
         * // 2. 飞行到一个矩形区域
         * camera.flyTo({
         *     rect : [west, south, east, north]
         * });
         *
         * // 3. 飞行到一个位置并带有角度
         * camera.flyTo({
         *     position : [117.16, 32.71, 15000.0],
         *     heading : Cesium.Math.toRadians(175.0),
         *     pitch : Cesium.Math.toRadians(-35.0),
         *     roll : 0.0
         * });
         * ```
         */
        flyTo(options: {
            position?: Position | number[];
            rect?: Rectangle | number[];
            orientation?: HeadingPitchRoll;
            duration?: number;
            complete?: () => void;
            cancel?: () => void;
        }): void;
        /**
         * 飞行到一个位置使当前视图刚好包含整个球
         * @param options 参数
         * @param options.center 球的中心点
         * @param options.radius 球的半径
         * @param options.offset 相机的相对方位
         * @param options.duration 指定飞行的时长，单位：秒。如果不指定，则自动计算
         * @param options.complete 指定飞行完成后的回调函数
         * @param options.cancel 指定飞行取消后的回调函数
         *
         */
        flyToSphere(options: {
            center: Position | number[];
            radius: number;
            offset?: HeadingPitchDistance;
            duration?: number;
            complete?: () => void;
            cancel?: () => void;
        }): void;
        /**
         * 停止飞行，相机停止在当前位置
         */
        stopFly(): void;
        /**
         * 设置相机的位置信息
         *
         * 该接口同flyTo类似，不过没有飞行过程
         *
         * @param options 包含如下属性
         * @param options.position 指定一个坐标位置 [lon, lat, height]，分别是经度（度），纬度（度），高度（米）
         * @param options.rect 指定一个矩形范围信息 [west,south,east,north]，单位：度
         * @param options.orientation 指定姿态
         *
         * @description
         * options.position 和 options.rect 任选一个，如果都没有指定则抛出异常
         *
         * @example
         * ```ts
         * // 1. 飞行到一个位置
         * camera.setView({
         *     position : [117.16, 32.71, 15000.0]
         * });
         *
         * // 2. 飞行到一个矩形区域
         * camera.setView({
         *     rect : [west, south, east, north]
         * });
         *
         * // 3. 飞行到一个位置并带有角度
         * camera.setView({
         *     position : [117.16, 32.71, 15000.0],
         *     heading : Cesium.Math.toRadians(175.0),
         *     pitch : Cesium.Math.toRadians(-35.0),
         *     roll : 0.0
         * });
         * ```
         */
        setView(options: {
            position?: Position | number[];
            rect?: Rectangle | number[];
            orientation?: HeadingPitchRoll;
        }): any;
        /**
         * 获取当前相机的位置信息
         */
        getView(): {
            position: Position;
            orientation: HeadingPitchRoll;
        };
        /**
         *
         * 通过目标点和相对位置设置相机的位置和方向
         *
         * lookAt操作会锁定交互中心为目标点，恢复地心交互请使用clearLookAt()
         *
         * @param target
         * @param offset
         */
        lookAt(target: Position, offset: HeadingPitchDistance): void;
        /**
         * 通过视点和目标点设置相机的位置和方向
         *
         * lookAt操作会锁定交互中心为目标点，恢复地心交互请使用clearLookAt()
         *
         * @param eye 视点
         * @param target 目标点
         */
        lookAtFromTo(eye: Position | Cesium.Cartographic, target: Position | Cesium.Cartographic): void;
        /**
         * 清除lookAt
         */
        clearLookAt(): void;
        /**
         * xyz 转 Cesium.Cartesian3
         * @param pos
         */
        private fromRectange;
        /**
         * Position 转 Cesium.Cartesian3
         * @param pos
         */
        private fromPosition;
        /**
         * @private
         * @param ori
         */
        private fromOrientation;
    }
}
declare namespace Cegore {
    /** 相机事件 */
    type CameraEventTypeLike = Cesium.CameraEventType | {
        eventType: Cesium.CameraEventType;
        modifier: Cesium.KeyboardEventModifier;
    };
    /** 相机事件聚合 */
    type CameraEventTypeAggrs = CameraEventTypeLike | CameraEventTypeLike[];
    /**
     * 相机控制器
     * @alias CameraController
     * @constructor
     *
     * @param scene The scene.
     */
    class CameraController {
        /**
         * 是否启用交互操作
         * @default true
         */
        enableInputs: boolean;
        /**
         * 是否启用平移操作
         * @default true
         */
        enableTranslate: boolean;
        /**
         * 是否启用缩放操作
         * @default true
         */
        enableZoom: boolean;
        /**
         * 是否启用旋转操作
         * @default true
         */
        enableRotate: boolean;
        /**
         * 是否启用倾斜操作
         * @default true
         */
        enableTilt: boolean;
        /**
         * 是否启用升降
         */
        enableUpDown: boolean;
        /**
         * 是否启用自由操作
         * @default true
         */
        enableLook: boolean;
        /**
         * 旋转惯性 `[0, 1)`
         * @default 0.9
         */
        inertiaSpin: number;
        /**
         * 平移惯性 `[0, 1)`
         * @default 0.9
         */
        inertiaTranslate: number;
        /**
         * 缩放惯性 `[0, 1)`
         * @default 0.8
         */
        inertiaZoom: number;
        /**
         * A parameter in the range `[0, 1)` used to limit the range
         * of various user inputs to a percentage of the window width/height per animation frame.
         * This helps keep the camera under control in low-frame-rate situations.
         * @default 0.1
         */
        maximumMovementRatio: number;
        /**
         * Sets the duration, in seconds, of the bounce back animations in 2D and Columbus view.
         * @default 3.0
         */
        bounceAnimationTime: number;
        /**
         * 缩放时的最小距离，单位：米
         * @default 1.0
         */
        minimumZoomDistance: number;
        /**
         * 缩放时的最大距离：单位：米
         * @default Number.POSITIVE_INFINITY
         */
        maximumZoomDistance: number;
        /**
         * 倾斜时最小弧度，单位：弧度
         * @default 1.0
         */
        minimumPitch: number;
        /**
         * 倾斜时最大弧度：单位：弧度
         * @default Number.POSITIVE_INFINITY
         */
        maximumPitch: number;
        /**
         * 倾斜时最小弧度，单位：弧度
         * @default 1.0
         */
        lookViewMinimumPitch: number;
        /**
         * 倾斜时最大弧度：单位：弧度
         * @default Number.POSITIVE_INFINITY
         */
        lookViewMaximumPitch: number;
        /**
         * 平移操作事件
         * @default Cesium.CameraEventType.LEFT_DRAG
         */
        translateEventTypes: CameraEventTypeAggrs;
        /**
         * 缩放操作事件
         * @default [Cesium.CameraEventType.WHEEL,Cesium.CameraEventType.PINCH]
         */
        zoomEventTypes: CameraEventTypeAggrs;
        /**
         * 旋转操作的事件
         * @default Cesium.CameraEventType.LEFT_DRAG
         */
        rotateEventTypes: CameraEventTypeAggrs;
        /**
         * 倾斜操作事件
         */
        tiltEventTypes: CameraEventTypeAggrs;
        /**
         * 升降事件
         */
        upDownEventTypes: CameraEventTypeAggrs;
        /**
         * 自由观看事件
         * @default {eventType:CameraEventType.LEFT_DRAG,modifier:KeyboardEventModifier.SHIFT}
         */
        lookEventTypes: CameraEventTypeAggrs;
        /**
         * Enables or disables camera collision detection with terrain.
         * @default true
         */
        enableCollisionDetection: boolean;
        /**
         * 是否启用平面模式
         */
        enableFlatMode: boolean;
        /**
         * 平面交互高程
         */
        flatModeHeight: number;
        /**
         * 交互平面偏移值
         */
        flatModeOffset: number;
        /** 视图范围 */
        private _viewRectange;
        private _viewCenter;
        set viewRectange(range: Cesium.Rectangle);
        get viewRectange(): Cesium.Rectangle;
        private _scene;
        private _aggregator;
        private _lastInertiaSpinMovement;
        private _lastInertiaZoomMovement;
        private _lastInertiaTranslateMovement;
        private _lastInertiaTiltMovement;
        private _horizontalRotationAxis;
        private _tiltCenterMousePosition;
        private _tiltCenter;
        private _zoomFactor;
        private _maximumRotateRate;
        private _minimumRotateRate;
        private _minimumZoomRate;
        private _maximumZoomRate;
        constructor(scene: Cesium.Scene);
        /**
         *
         */
        isDestroyed(): boolean;
        /**
         * @example
         * controller = controller && controller.destroy();
         */
        destroy(): undefined;
        /**
         * 更新交互状态
         */
        update(): void;
        onMap(): boolean;
        private _temp_view_p0;
        private _temp_view_p1;
        private _temp_view_c0;
        private _temp_view_c1;
        private _checkLimit;
        /**
         * 获取系统椭球体
         */
        private getEllipsoid;
        private update2D;
        private updateCV;
        private update3D;
        private reactToInput;
        private pickReal;
        private pickFlat;
        private pickPosition;
        private rotate3D;
        private spin3D;
        private pan3D;
        private zoom3D;
        private tilt3D;
        private look3D;
        private upDown;
    }
}
declare namespace Cegore {
    /**
     * 可绘制对象
     */
    abstract class Renderable {
        private _position;
        private _orientation;
        /**
         * 可设置的属性
         */
        private static RenderablePropList;
        /**
         * 构造函数
         * @param options
         */
        constructor();
        /**
         * 应用属性
         * @param o 设置属性的对象
         * @param keys 属性名列表
         * @param props 属性值对象
         */
        protected static applyProps(o: any, keys: any, props: any): void;
        /**
         * 应用属性给当前对象
         *
         * @param options 属性列表
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        protected applyProps(options: {
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        }): void;
        /**
         * @private
         */
        abstract get _czRenderable(): any;
        /**
         * 获取对象的类型
         */
        abstract get type(): string;
        /**
         * 获取对象的id
         */
        get id(): string;
        /**
         * 设置标准是否可见
         */
        set visible(visible: any);
        /**
         * 获取当前对象是否可见
         */
        get visible(): any;
        /**
         * 获取位置信息
         */
        get position(): Position;
        /**
         * 设置位置信息
         */
        set position(pos: Position);
        /**
         * 获取模型的方位
         */
        get orientation(): HeadingPitchRoll;
        /**
         * 设置模型的方位
         */
        set orientation(o: HeadingPitchRoll);
        /**
         * 更新模型的姿态信息
         * @private
         */
        private applyPose;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    interface ProviderFactory {
        /**
         * 创建实例
         */
        createProvider(options: any): any;
    }
    /**
     * Provide 提供器集合
     */
    class ProviderCollection {
        private mDefaultFac;
        private mFactories;
        constructor(def: string);
        /**
         * 注册提供器工厂
         * @param provider
         */
        regFactory(type: string, provider: ProviderFactory): void;
        /**
         * 反注册提供器工厂
         * @param provider
         */
        unregFactory(type: string): void;
        /**
         * 创建提供器
         * @param options
         */
        createProvider(type: string, options: any): any;
    }
    /**
     *
     */
    class Providers {
        /**
         * 地形提供器集合
         */
        static TerrainProviders: ProviderCollection;
        /**
         * 影像提供器集合
         */
        static ImageProviders: ProviderCollection;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 影像图层
     */
    class ImageLayer {
        private _name;
        private _type;
        private _czLayer;
        private _provider;
        /**
         * 构造影像图层
         *
         * @param options 包含如下属性
         * @param options.name 指定图层的名称
         * @param options.type 指定地形数据类型，包括（ZMapImage等）
         *
         * @example
         * ``` ts
         *  new ImageLayer({
         *  	name: 'GoogleLayer',
         *  	type: 'ZMapImage',
         *  	// 数据的地址
         *  	url :'http://localhost:9081/zs/data/tdtonline/image',
         *  	// 设置最大显示层级
         *  	minimumLevel: 0,
         *  	maximumLevel: 18
         *  });
         * ```
         */
        constructor(options?: {
            rectangle?: Rectangle | number[];
            name?: string;
            type?: string;
            visible?: boolean;
            alpha?: number;
            brightness?: number;
        });
        /**
         * @internal
         */
        get _czlayer(): Cesium.ImageryLayer;
        /**
         * 图层名称
         */
        get name(): string;
        /**
         * Provider的类型
         */
        get type(): string;
        /**
         * 图层可见性
         */
        set visible(value: boolean);
        /**
         * 设置图层可见性
         */
        get visible(): boolean;
        /**
         * 透明度
         */
        set alpha(value: number);
        /**
         * 设置透明度
         */
        get alpha(): number;
        /** 亮度 */
        set brightness(value: number);
        get brightness(): number;
        get provider(): Cesium.ImageryProvider;
        /**
         * 根据options 创建provider
         * @param options
         */
        private createProvider;
    }
}
declare namespace Cegore {
    /**
     * 影像图层集合
     */
    class ImageLayerCollection {
        private _globe;
        private _czLayers;
        private _layers;
        /**
         * 构造函数，构造一个新的图层管理器
         *
         * @param viewer 主视图
         */
        constructor(globe: Globe);
        /**
         * 获取影像图层的数量
         *
         * @return {Number}
         */
        get length(): any;
        /**
         * 添加影像图层
         *
         * @param {ImageLayer} layer 影像图层
         * @param {Number} [index] 索引
         */
        add(layer: ImageLayer, index?: number): void;
        /**
         * 获取影像图层
         * @param index 影像图层的索引
         */
        get(index: number): any;
        /**
         * 获取影像图层
         * @param name 影像图层的名称
         */
        get(name: string): any;
        /**
         * 移除影像图层
         *
         * @param index 图层的索引
         */
        remove(index: number): any;
        remove(name: string): any;
        remove(layer: ImageLayer): any;
        /**
         * 移除所有图层
         */
        removeAll(): void;
        /**
         * 移除所有图层
         */
        clear(): void;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 地球类
     */
    class Globe {
        private _scene;
        private _czData;
        private _czGlobe;
        private _images;
        private _tileLoadProgress;
        /**
         * 构造函数
         * @param scene
         */
        constructor(scene: Scene);
        /**
         * 设置地形数据源
         *
         * @param options 包含如下属性
         * @param options.type 指定地形数据类型，包括（ZMapTerrain等）
         * @param options.data 指定地形数据
         */
        setTerrain(options: any): void;
        /**
         * @private
         */
        get _czglobe(): Cesium.Globe;
        /**
         * 获取影像图层集合
         */
        get images(): ImageLayerCollection;
        /**
         * 地球上没有影像时的基本颜色
         */
        get baseColor(): Color;
        /**
         * 地球上没有影像时的基本颜色
         */
        set baseColor(val: Color);
        /**
         * 是否启用深度监测
         */
        get enableDepthTest(): boolean;
        /**
         * 设置是否启用深度监测
         */
        set enableDepthTest(val: boolean);
        /**
         * 获取是否启用光照
         */
        get enableLighting(): boolean;
        /**
         * 设置是否启用光照
         */
        set enableLighting(enable: boolean);
        /**
         * 获取是否启用水体效果
         */
        get enableWaterEffect(): boolean;
        /**
         * 设置是否启用水体效果
         */
        set enableWaterEffect(enable: boolean);
        /**
         * 瓦片缓存大小，默认值：100
         */
        get tileCacheSize(): number;
        /**
         * 瓦片缓存大小，默认值：100
         */
        set tileCacheSize(val: number);
        /**
         * 瓦片加载事件，当瓦片队列发生变化（增加或者减少）时触发事件。事件传递出瓦片队列的长度。
         * 事件原型 ``` function(length) {} ```
         */
        get tileLoadProgress(): Event;
        /**
         * 根据options 创建provider
         * @param options
         */
        private createProvider;
    }
}
declare namespace Cegore {
    /**
     * 抽象模型管理类，不能直接构造该对象
     */
    abstract class Model extends Renderable implements TreeItem {
        private _name;
        private _parent;
        /**
         * 模型可设置的属性
         */
        private static ModelPropList;
        /**
         * 构造函数，构造一个新的Model对象
         */
        constructor();
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * 获取模型的名称
         */
        get name(): string;
        /**
         * 设置模型的名称
         */
        set name(name: string);
        /**
         * 获取父对象
         */
        get parent(): ModelGroup;
        /**
         * 获取子对象列表，始终返回空数组
         */
        get children(): TreeItem[];
        /**
         * 是否叶子对象，始终返回ture
         */
        get isLeaf(): boolean;
        /**
         * 当被添加到ModelGroup中时调用，内部接口不要再外部调用
         * @private
         */
        onAdded(parent: ModelGroup): void;
        /**
         * 当被添从ModelGroup中移除时调用，内部接口不要再外部调用
         * @private
         */
        onRemoved(): void;
        /**
         * 当连接到根节点时调用，内部接口不要再外部调用
         * @private
         */
        onAttachRoot(): void;
        /**
         * 当与根节点断开时调用，内部接口不要再外部调用
         * @private
         */
        onDetachRoot(): void;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 模型组
     *
     * 管理模型分组
     */
    class ModelGroup implements TreeItem {
        private _name;
        private _parent;
        private _children;
        private _models;
        /**
         * 构造一个新的模型组
         * @param modelCollection
         */
        constructor(options?: any);
        /**
         * 获取模型集合
         */
        get models(): ModelCollection;
        /**
         * 获取模型名称
         */
        get name(): string;
        /**
         * 获取父节点
         */
        get parent(): ModelGroup;
        /**
         * 获取子节点列表
         */
        get children(): TreeItem[];
        /**
         * 返回是否叶子节点，对于模型组，该返回值总是 false
         */
        get isLeaf(): boolean;
        /**
         * 添加模型到该模型组中
         * @param m
         */
        add(m: Model | ModelGroup): void;
        /**
         * 从模型组中移除该模型
         * @param m
         */
        remove(m: Model | ModelGroup): void;
        /**
         * 移除该模型组中所有模型
         */
        removeAll(): void;
        /**
         * @private
         * @param modelCollection
         */
        setModelCollection(modelCollection: ModelCollection): void;
        /**
         * @private
         * @param parent
         */
        onAdded(parent: ModelGroup): void;
        /**
         * @private
         */
        onRemoved(): void;
        /**
         * @private
         * 与根节点断开
         */
        onAttachRoot(): void;
        /**
         * @private
         * 连接到根节点
         */
        onDetachRoot(): void;
        /**
         *
         * @param mg
         * @param ms
         */
        private static getAllModels;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 模型集合
     */
    class ModelCollection {
        private _models;
        private _czData;
        private _DataSource;
        private _entities;
        private _root;
        /**
         * 构造函数
         * @param scene
         */
        constructor(scene: Scene);
        /**
         * 获取根节点
         */
        get root(): ModelGroup;
        /**
         * 添加模型到根节点
         * @param m
         */
        add(m: Model | ModelGroup): void;
        /**
         * 从根节点删除模型
         */
        remove(m: Model | ModelGroup): void;
        /**
         * private
         * @param model
         */
        _onAddModel(model: Model): void;
        /**
         * private
         * @param model
         */
        _onRemoveModel(model: Model): void;
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * Gltf模型
     */
    class GltfModel extends Model {
        private _czEntity;
        private _czModel;
        private _uri;
        private _enablePcik;
        private _minPixelSize;
        private _color;
        private _outlineColor;
        private _outlineSize;
        /**
         * 模型可设置的属性
         */
        private static GltfModelPropList;
        /**
         * 构造函数，构造一个新的 GltfModel 对象
         * @param options 模型的参数
        
         * @param options.name 模型的名称，用户自定义，便于识别的标识符
         * @param options.uri 模型数据的uri，必须是gltf格式的
         * @param options.enablePick 是否允许拾取
         * @param options.minPixelSize 最小可见像素大小
         * @param options.color 模型显示的叠加颜色
         * @param options.outlineColor 轮廓线颜色
         * @param options.outlineSize 轮廓线宽度
         *
         * ///
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        constructor(options: {
            uri?: string;
            enablePick?: boolean;
            minPixelSize?: number;
            color?: Color;
            outlineColor?: Color;
            outlineSize?: number;
            name?: string;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * @private
         */
        get _czRenderable(): any;
        /**
         * 获取类型，返回 Model
         */
        get type(): string;
        /**
         * 获取模型的数据的URI
         */
        get uri(): string;
        /**
         * 指定模型数据的URI
         */
        set uri(uri: string);
        /**
         * 是否允许拾取
         */
        get enablePick(): boolean;
        /**
         * 允许拾取
         */
        set enablePick(enable: boolean);
        /**
         * 获取模型显示的最小像素大小，当模型在屏幕上小于该值后将不再显示
         */
        get minPixelSize(): number;
        /**
         * 设置模型显示的最小像素大小，当模型在屏幕上小于该值后将不再显示
         */
        set minPixelSize(size: number);
        /**
         * 获取模型颜色
         */
        get color(): Color;
        /**
         * 设置模型颜色
         */
        set color(color: Color);
        /**
         * 获取模型轮廓线颜色
         */
        get outlineColor(): Color;
        /**
         * 设置模型轮廓线颜色
         */
        set outlineColor(color: Color);
        /**
         * 获取模型轮廓线宽度
         */
        get outlineSize(): number;
        /**
         * 设置模型轮廓线宽度
         */
        set outlineSize(size: number);
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 图形的抽象基类，不能直接构造该对象
     */
    abstract class Shape extends Model {
        private _material;
        private _fill;
        private _outline;
        private _outlineColor;
        private _outlineWidth;
        private _shadows;
        private _displayDistance;
        private static ShapePropList;
        /**
         * 构造一个新的Shape对象
         */
        constructor();
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * 获取内部图形
         * @private
         */
        protected abstract get _czShape(): any;
        /**
         * 获取是否填充，默认值：true
         */
        get fill(): boolean;
        /**
         * 设置是否填充，默认值：true
         */
        set fill(fill: boolean);
        /**
         * 获取当前图形的材质
         */
        get material(): Material;
        /**
         * 设置当前图形的材质
         */
        set material(mat: Material);
        /**
         * 获取是否显示轮廓，默认值：false
         */
        get outline(): boolean;
        /**
         * 设置是否显示轮廓，默认值：false
         */
        set outline(val: boolean);
        /**
         * 获取轮廓线颜色，默认值：Color.BLACK
         */
        get outlineColor(): Color;
        /**
         * 设置轮廓线颜色，默认值：Color.BLACK
         */
        set outlineColor(val: Color);
        /**
         * 获取轮廓线宽度，默认值：1.0
         */
        get outlineWidth(): number;
        /**
         * 设置轮廓线宽度，默认值：1.0
         */
        set outlineWidth(val: number);
        /**
         * 获取阴影模式，指出模型是否产生或者接受阴影，默认值：ShadowMode.DISABLE
         */
        get shadows(): ShadowMode;
        /**
         * 设置阴影模式，指出模型是否产生或者接受阴影，默认值：ShadowMode.DISABLE
         */
        set shadows(mode: ShadowMode);
        get displayDistance(): number;
        set displayDistance(distance: number);
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 可以挤压成体的图形的抽象基类，不能直接构造该对象
     */
    abstract class ShapeExtruded extends Shape {
        private _height;
        private _extrudedHeight;
        private _rotation;
        private static ShapeExtrudedPropList;
        /**
         * 构造一个ShapeExtruded对象
         * @param options 一个可选的参数对象
         * @param options.height 距离地表的高度，默认值：0
         * @param options.extrudedHeight 挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         * @param options.rotation 从正北方向逆时针旋转的角度，默认值：0
         *
         * Shape
         * @param options.fill 是否填充显示，默认值：是
         * @param options.material 填充的材质，默认值：Color.WHITE
         * @param options.outline 是否显示轮廓线，默认值：不显示
         * @param options.outlineColor 轮廓线的颜色，默认值：黑色
         * @param options.outlineWidth 轮廓线的宽度，默认值：1.0
         * @param options.shadows 阴影模式，默认值：ShadowMode.DISABLE
         * @param options.displayDistance 显示距离，控制在多大范围内显示该模型
         *
         * Renderable 的参数
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        constructor(options?: {
            height?: number;
            extrudedHeight?: number;
            rotation?: number;
            fill?: boolean;
            material?: Material;
            outline?: boolean;
            outlineColor?: Color;
            outlineWidth?: number;
            shadows?: ShadowMode;
            displayDistance?: number;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * 获取椭圆距离地表的高度，默认值：0
         */
        get height(): number;
        /**
         * 设置椭圆距离地表的高度，默认值：0
         */
        set height(height: number);
        /**
         * 获取椭圆的挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         */
        get extrudedHeight(): number;
        /**
         * 设置椭圆的挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         */
        set extrudedHeight(exheight: number);
        /**
         * 获取椭圆从正北方向逆时针旋转的角度，默认值：0
         */
        get rotation(): number;
        /**
         * 设置椭圆从正北方向逆时针旋转的角度，默认值：0
         */
        set rotation(r: number);
    }
}
/**
 * end of file
 */ 
declare namespace Cegore {
    /**
     * 立方体模型对象
     */
    class BoxModel extends Shape {
        private _czEntity;
        private _czBox;
        private _dimensions;
        private static BoxPropList;
        /**
         * 构造一个立方体对象
         * @param options 一个可选的参数对象
         * @param options.dimensions 模型的尺寸，可以是数组`[x, y, z]`或者对象`{x: 1,y:1, z:1}`
         *
         * /// Shape 的参数
         * @param options.fill 是否填充显示，默认值：是
         * @param options.material 填充的材质，默认值：Color.WHITE
         * @param options.outline 是否显示轮廓线，默认值：不显示
         * @param options.outlineColor 轮廓线的颜色，默认值：黑色
         * @param options.outlineWidth 轮廓线的宽度，默认值：1.0
         * @param options.shadows 阴影模式，默认值：ShadowMode.DISABLE
         * @param options.displayDistance 显示距离，控制在多大范围内显示该模型
         *
         * /// Renderable 的参数
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        constructor(options?: {
            dimensions?: Vector3 | number[] | {
                x: number;
                y: number;
                z: number;
            };
            fill?: boolean;
            material?: Material;
            outline?: boolean;
            outlineColor?: Color;
            outlineWidth?: number;
            shadows?: ShadowMode;
            displayDistance?: boolean;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * @private
         */
        get _czRenderable(): any;
        /**
         * @private
         */
        protected get _czShape(): any;
        /**
         * 获取对象的类型
         */
        get type(): string;
        /**
         * 获取模型的尺寸，返回值是一个Vector3，分别是立方体的长宽高，不要再外部修改该对象
         */
        get dimensions(): Vector3;
        /**
         * 设置立方体的尺寸
         */
        set dimensions(dimensions: Vector3);
    }
}
/**
 * end of file
 */
declare namespace Cegore {
    /**
     * 圆柱模型对象
     */
    class CylinderModel extends Shape {
        private _czEntity;
        private _czCylinder;
        private _length;
        private _topRadius;
        private _bottomRadius;
        private _slices;
        private _verticalLines;
        private static CylinderPropList;
        /**
         * 构造一个圆柱体对象
         * @param options 一个可选的参数对象
         * @param options.length 圆柱体的长度
         * @param options.topRadius 圆柱体顶面半径
         * @param options.bottomRadius 圆柱体底面变径
         * @param options.slices 圆柱体边的数目，默认值：128,
         * @param options.verticalLines 垂直线的数目，该参数用于轮廓线显示，默认值：16
         *
         * ///
         * @param options.fill 是否填充显示，默认值：是
         * @param options.material 填充的材质，默认值：Color.WHITE
         * @param options.outline 是否显示轮廓线，默认值：不显示
         * @param options.outlineColor 轮廓线的颜色，默认值：黑色
         * @param options.outlineWidth 轮廓线的宽度，默认值：1.0
         * @param options.shadows 阴影模式，默认值：ShadowMode.DISABLE
         * @param options.displayDistance 显示距离，控制在多大范围内显示该模型
         *
         * /// Renderable 的参数
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        constructor(options?: {
            length?: number;
            topRadius?: number;
            bottomRadius?: number;
            slices?: number;
            verticalLines?: number;
            fill?: boolean;
            material?: Material;
            outline?: boolean;
            outlineColor?: Color;
            outlineWidth?: number;
            shadows?: ShadowMode;
            displayDistance?: boolean;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * @private
         */
        get _czRenderable(): any;
        /**
         * @private
         */
        protected get _czShape(): any;
        /**
         * 获取对象的类型
         */
        get type(): string;
        /**
         * 获取圆柱体的长度
         */
        get length(): number;
        /**
         * 设置圆柱体的长度
         */
        set length(length: number);
        /**
         * 获取圆柱体的顶面变径
         */
        get topRadius(): number;
        /**
         * 设置圆柱体的顶面半径
         */
        set topRadius(radius: number);
        /**
         * 获取圆柱体的底面变径
         */
        get bottomRadius(): number;
        /**
         * 设置圆柱体的底面半径
         */
        set bottomRadius(radius: number);
        /**
         * 获取圆柱体边的数量，默认值：128
         */
        get slices(): number;
        /**
         * 设置圆柱体边的数量，默认值：128
         */
        set slices(slices: number);
        /**
         * 获取垂直线的数目，该参数用于轮廓线显示，默认值：16
         */
        get verticalLines(): number;
        /**
         * 获取垂直线的数目，该参数用于轮廓线显示，默认值：16
         */
        set verticalLines(num: number);
    }
}
/**
 * end of file
 */
declare namespace Cegore {
    /**
     * 椭圆模型对象
     */
    class EllipseModel extends ShapeExtruded {
        private _czEntity;
        private _czEllipse;
        private _semiMajorAxis;
        private _semiMinorAxis;
        private _slices;
        private _verticalLines;
        private static EllipsePropList;
        /**
         * 构造一个椭圆对象
         * @param options 一个可选的参数对象
         * @param options.semiMajorAxis 椭圆长半轴长度
         * @param options.semiMinorAxis 椭圆短半轴长度
         * @param options.slices 椭圆边的数目，默认值：128,
         * @param options.verticalLines 垂直线的数目，该参数用于轮廓线显示，默认值：16
         *
         * Extruded
         * @param options.height 椭圆距离地表的高度，默认值：0
         * @param options.extrudedHeight 椭圆的挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         * @param options.rotation 椭圆从正北方向逆时针旋转的角度，默认值：0
         *
         * Shape
         * @param options.fill 是否填充显示，默认值：是
         * @param options.material 填充的材质，默认值：Color.WHITE
         * @param options.outline 是否显示轮廓线，默认值：不显示
         * @param options.outlineColor 轮廓线的颜色，默认值：黑色
         * @param options.outlineWidth 轮廓线的宽度，默认值：1.0
         * @param options.shadows 阴影模式，默认值：ShadowMode.DISABLE
         * @param options.displayDistance 显示距离，控制在多大范围内显示该模型
         *
         * Renderable 的参数
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        constructor(options?: {
            semiMajorAxis?: number;
            semiMinorAxis?: number;
            height?: number;
            extrudedHeight?: number;
            rotation?: number;
            slices?: number;
            verticalLines?: number;
            fill?: boolean;
            material?: Material;
            outline?: boolean;
            outlineColor?: Color;
            outlineWidth?: number;
            shadows?: ShadowMode;
            displayDistance?: number;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * @private
         */
        get _czRenderable(): any;
        /**
         * @private
         */
        protected get _czShape(): any;
        /**
         * 获取对象的类型
         */
        get type(): string;
        /**
         * 获取椭圆的长半轴长度
         */
        get semiMajorAxis(): number;
        /**
         * 设置椭圆的长半轴长度
         */
        set semiMajorAxis(len: number);
        /**
         * 获取椭圆的短半轴长度
         */
        get semiMinorAxis(): number;
        /**
         * 设置椭圆的短半轴长度
         */
        set semiMinorAxis(len: number);
        /**
         * 获取圆柱体边的数量，默认值：128
         */
        get slices(): number;
        /**
         * 设置圆柱体边的数量，默认值：128
         */
        set slices(slices: number);
        /**
         * 获取垂直线的数目，该参数用于轮廓线显示，默认值：16
         */
        get verticalLines(): number;
        /**
         * 获取垂直线的数目，该参数用于轮廓线显示，默认值：16
         */
        set verticalLines(num: number);
    }
}
/**
 * end of file
 */
declare namespace Cegore {
    /**
     * 椭球模型对象
     */
    class EllipsoidModel extends Shape {
        private _czEntity;
        private _czEllipsoid;
        private _semiMajorAxis;
        private _semiMinorAxis;
        private _height;
        private _extrudedHeight;
        private _rotation;
        private _slices;
        private _verticalLines;
        private static EllipsoidPropList;
        /**
         * 构造一个圆柱体对象
         * @param options 一个可选的参数对象
         * @param options.semiMajorAxis 椭圆长半轴长度
         * @param options.semiMinorAxis 椭圆短半轴长度
         * @param options.height 椭圆距离地表的高度，默认值：0
         * @param options.extrudedHeight 椭圆的挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         * @param options.rotation 椭圆从正北方向逆时针旋转的角度，默认值：0
         * @param options.slices 椭圆边的数目，默认值：128,
         * @param options.verticalLines 垂直线的数目，该参数用于轮廓线显示，默认值：16
         *
         * ///
         * @param options.fill 是否填充显示，默认值：是
         * @param options.material 填充的材质，默认值：Color.WHITE
         * @param options.outline 是否显示轮廓线，默认值：不显示
         * @param options.outlineColor 轮廓线的颜色，默认值：黑色
         * @param options.outlineWidth 轮廓线的宽度，默认值：1.0
         * @param options.shadows 阴影模式，默认值：ShadowMode.DISABLE
         * @param options.displayDistance 显示距离，控制在多大范围内显示该模型
         *
         * /// Renderable 的参数
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        constructor(options?: {
            semiMajorAxis?: number;
            semiMinorAxis?: number;
            height?: number;
            extrudedHeight?: number;
            rotation?: number;
            slices?: number;
            verticalLines?: number;
            fill?: boolean;
            material?: Material;
            outline?: boolean;
            outlineColor?: Color;
            outlineWidth?: number;
            shadows?: ShadowMode;
            displayDistance?: boolean;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * @private
         */
        get _czRenderable(): any;
        /**
         * @private
         */
        protected get _czShape(): any;
        /**
         * 获取对象的类型
         */
        get type(): string;
        /**
         * 获取椭圆的长半轴长度
         */
        get semiMajorAxis(): number;
        /**
         * 设置椭圆的长半轴长度
         */
        set semiMajorAxis(len: number);
        /**
         * 获取椭圆的短半轴长度
         */
        get semiMinorAxis(): number;
        /**
         * 设置椭圆的短半轴长度
         */
        set semiMinorAxis(len: number);
        /**
         * 获取椭圆距离地表的高度，默认值：0
         */
        get height(): number;
        /**
         * 设置椭圆距离地表的高度，默认值：0
         */
        set height(height: number);
        /**
         * 获取椭圆的挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         */
        get extrudedHeight(): number;
        /**
         * 设置椭圆的挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         */
        set extrudedHeight(exheight: number);
        /**
         * 获取椭圆从正北方向逆时针旋转的角度，默认值：0
         */
        get rotation(): number;
        /**
         * 设置椭圆从正北方向逆时针旋转的角度，默认值：0
         */
        set rotation(r: number);
        /**
         * 获取圆柱体边的数量，默认值：128
         */
        get slices(): number;
        /**
         * 设置圆柱体边的数量，默认值：128
         */
        set slices(slices: number);
        /**
         * 获取垂直线的数目，该参数用于轮廓线显示，默认值：16
         */
        get verticalLines(): number;
        /**
         * 获取垂直线的数目，该参数用于轮廓线显示，默认值：16
         */
        set verticalLines(num: number);
    }
}
/**
 * end of file
 */
declare namespace Cegore {
    /**
     * 多边形样式类型
     */
    enum PolylineStyle {
        /**
         * 普通样式
         */
        NONE = 0,
        /**
         * 炽热样式
         */
        GLOW = 1,
        /**
         * 轮库线样式
         */
        OUTLINE = 2,
        /**
         * 点划线样式
         */
        DASH = 3,
        /**
         * 箭头样式
         */
        ARROW = 4
    }
    /**
     * 折线对象
     */
    class PolylineModel extends Model {
        private _czEntity;
        private _czPolyline;
        private _positions;
        private _czPositions;
        private _dynamic;
        private _followSurface;
        private _color;
        private _color2;
        private _width;
        private _style;
        private _glow;
        private _outlineColor;
        private _outlineWidth;
        private _shadows;
        private _displayDistance;
        private static PolylinePropList;
        /**
         *
         * @param options 折线参数列表
         * @param options.positions 折线顶点列表
         * @param options.dynamic 是否动态线
         * @param options.followSuface 是否贴在地表
         * @param options.color 颜色
         * @param options.width 宽度
         * @param options.style 样式
         * @param options.glow 炽热度，仅用于GLOW样式
         * @param options.outlineWidth 轮廓线宽度，仅用于OUTLINE样式
         * @param options.outlineColor 轮廓线颜色，仅用于OUTLINE样式
         * @param options.shadows 阴影模式
         * @param options.displayDistance 显示距离
         */
        constructor(options?: {
            positions?: {}[];
            dynamic?: boolean;
            followSurface?: boolean;
            color?: Color;
            width?: number;
            style?: PolylineStyle;
            glow?: number;
            outlineWidth?: number;
            outlineColor?: Color;
            shadows?: ShadowMode;
            displayDistance?: boolean;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * @private
         */
        get _czRenderable(): any;
        /**
         * @private
         */
        protected get _czShape(): any;
        /**
         * 获取对象的类型
         */
        get type(): string;
        /**
         * 获取顶点列表
         */
        get positions(): any;
        /**
         * 设置顶点列表
         */
        set positions(points: any);
        /**
         * 获取是否贴附地表
         */
        get followSurface(): boolean;
        /**
         * 设置是否贴附地表
         */
        set followSurface(follow: boolean);
        /**
         * 获取颜色
         */
        get color(): Color;
        /**
         * 设置颜色
         */
        set color(color: Color);
        /**
         * 获取颜色
         */
        get color2(): Color;
        /**
         * 设置颜色
         */
        set color2(color: Color);
        /**
         * 设置线宽
         */
        get width(): number;
        /**
         * 获取线宽
         */
        set width(width: number);
        /**
         * 获取样式
         */
        get style(): PolylineStyle;
        /**
         * 设置样式
         */
        set style(style: PolylineStyle);
        /**
         * 获取炽热度
         */
        get glow(): number;
        /**
         * 设置炽热度
         */
        set glow(glow: number);
        /**
         * 获取轮廓线颜色，默认值：Color.BLACK
         */
        get outlineColor(): Color;
        /**
         * 设置轮廓线颜色，默认值：Color.BLACK
         */
        set outlineColor(val: Color);
        /**
         * 获取轮廓线宽度，默认值：1.0
         */
        get outlineWidth(): number;
        /**
         * 设置轮廓线宽度，默认值：1.0
         */
        set outlineWidth(val: number);
        /**
         * 获取阴影模式，指出模型是否产生或者接受阴影，默认值：ShadowMode.DISABLE
         */
        get shadows(): ShadowMode;
        /**
         * 设置阴影模式，指出模型是否产生或者接受阴影，默认值：ShadowMode.DISABLE
         */
        set shadows(mode: ShadowMode);
        get displayDistance(): number;
        set displayDistance(distance: number);
    }
}
declare namespace Cegore {
    /**
     * 多边形的结构
     */
    class PolygonHierarchy {
        private _positions;
        private _holes;
    }
    /**
     * 多边形对象
     */
    class PolygonModel extends ShapeExtruded {
        private _czEntity;
        private _czPolygon;
        private _positions;
        private _czPositions;
        private _dynamic;
        private _usePositionHeight;
        private _closeTop;
        private _closeBottom;
        private static PolygonPropList;
        /**
         * 构造一个多边形对象
         *
         * @param options 一个可选的参数对象
         * @param options.positions 多边形的顶点
         * @param options.dynamic 是否为动态对象，默认值：false
         * @param options.usePositionHeight 是否使用每一个顶点的高程信息，默认值：false
         * @param options.closeTop 是否封闭顶面，默认值：true
         * @param options.closeBottom 是否封闭底面，默认值：true
         *
         * ShapeExtruded
         * @param options.height 距离地表的高度，默认值：0
         * @param options.extrudedHeight 挤出高度，当设置这个参数后，椭圆将变成一个椭圆柱体
         * @param options.rotation 从正北方向逆时针旋转的角度，默认值：0
         *
         * Shape
         * @param options.fill 是否填充显示，默认值：是
         * @param options.material 填充的材质，默认值：Color.WHITE
         * @param options.outline 是否显示轮廓线，默认值：不显示
         * @param options.outlineColor 轮廓线的颜色，默认值：黑色
         * @param options.outlineWidth 轮廓线的宽度，默认值：1.0
         * @param options.shadows 阴影模式，默认值：ShadowMode.DISABLE
         * @param options.displayDistance 显示距离，控制在多大范围内显示该模型
         *
         * Renderable 的参数
         * @param options.visible 是否可见
         * @param options.position 位置
         * @param options.orientation 方向
         */
        constructor(options?: {
            positions?: {}[];
            dynamic?: boolean;
            usePositionHeight?: boolean;
            closeTop?: boolean;
            closeBottom?: boolean;
            height?: number;
            extrudedHeight?: number;
            rotation?: number;
            fill?: boolean;
            material?: Material;
            outline?: boolean;
            outlineColor?: Color;
            outlineWidth?: number;
            shadows?: ShadowMode;
            displayDistance?: number;
            visible?: boolean;
            position?: Position;
            orientation?: HeadingPitchRoll;
        });
        /**
         * 应用属性给当前对象
         */
        protected applyProps(props: any): void;
        /**
         * @private
         */
        get _czRenderable(): any;
        /**
         * @private
         */
        protected get _czShape(): any;
        /**
         * 获取对象的类型
         */
        get type(): string;
        /**
         * 获取顶点列表
         */
        get positions(): any;
        /**
         * 设置顶点列表
         */
        set positions(polygon: any);
        /**
         * 获取是否使用顶点的高程值，默认值：false
         */
        get usePositionHeight(): boolean;
        /**
         * 设置是否使用定点高程值
         */
        set usePositionHeight(use: boolean);
        /**
         * 获取是否封闭顶面
         */
        get closeTop(): boolean;
        /**
         * 设置是否封闭顶面
         */
        set closeTop(close: boolean);
        /**
         * 获取是否封闭底面
         */
        get closeBottom(): boolean;
        /**
         * 设置是否封闭底面
         */
        set closeBottom(close: boolean);
    }
}
declare namespace Cegore {
    abstract class PrimitiveModel extends Renderable {
    }
}
declare namespace Cegore {
    /**
     * 标注类
     */
    class Label extends Renderable {
        private _creator;
        private _layer;
        private _name;
        private _events;
        private _czEntity;
        private _czText;
        private _czIcon;
        private mAutoOffset;
        /**
         * 构建一个新的标注对象
         *
         * @param options
         */
        constructor(options: any);
        /**
         * 内部接口
         * @private
         */
        get _czRenderable(): any;
        /**
         * 返回类型，返回‘Type’
         */
        get type(): string;
        /**
         * 获取标注的名称
         */
        get name(): string;
        /**
         * 获取标注所在图层
         */
        get layer(): string;
        /**
         * 获取标注文本
         */
        get text(): any;
        /**
         * 设置标注文本
         */
        set text(value: any);
        /**
         * 获取图标
         */
        get icon(): any;
        /**
         * 设置图标
         */
        set icon(value: any);
        /**
         * 获取事件
         */
        get events(): EventHandle;
        /**
         * 应用属性
         * @param val 属性值
         * @param tar 目标
         * @param name 目标属性名
         * @param type 属性类型
         */
        private _applyProp;
        /**
         * 应用文本属性
         * @private
         *
         * @param val
         * @param name
         * @param type
         */
        private _applyTextProp;
        /**
         * 应用文本属性
         * @private
         *
         * @param val
         * @param name
         * @param type
         */
        private _applyIconProp;
        /**
         * 设置文字
         * @param text 文本信息
         */
        setText(text: {
            title?: string;
            font?: string;
            size?: number;
            color?: string;
            border?: any;
            unit?: any;
        }): void;
        /**
         * 设置图标
         * @param icon
         */
        setIcon(icon?: {
            img?: string;
            scale?: number;
            color?: string;
            unit?: {
                offset?: number[];
            };
        }): void;
    }
}
declare namespace Cegore {
    /**
     * 标注集合
     */
    class LabelCollection {
        private _layers;
        private _scene;
        private _czData;
        private _czDataSource;
        private _czEntities;
        private mLabelEvent;
        private mCZHandle;
        /**
         * 构造函数
         *
         * @param viewer
         */
        constructor(scene: Scene);
        private onLabelMoveEvent;
        private onLabelClickEvent;
        /**
         * 获取对象
         * @private
         */
        private _getOrCreateLayer;
        /**
         * 获取对象
         * @private
         */
        private _getLayer;
        /**
         * 获取全局标注事件
         */
        get events(): EventHandle;
        /**
         * 添加标注
         * @param label 标注对象
         */
        add(label: Label): Label;
        /**
         * 获取标注对象
         *
         * @param {String} name 标注的名称
         * @param {String} layer 标注的图层
         */
        get(name: string, layer?: string): Label;
        /**
         * 拾取标注
         *
         * @param {Number|Object} X屏幕坐标或者 坐标对象，或者数组
         * @param [Number] Y屏幕坐标
         */
        pick(xy: number[]): Label;
        pick(xy: {}): Label;
        /**
         * 删除标注
         * @param name 标注名称
         * @param layer 标注图层
         */
        remove(name: string, layer: string): any;
        /**
         * 删除标注
         * @param label 待删除的标注对象
         */
        remove(label: Label): any;
        /**
         * 根据名称和图层删除标注
         * @param {Object} label 标注的名称和图层
         */
        remove(label: {
            name: string;
            layer?: string;
        }): any;
        /**
         * 移除标注图层
         *
         * @param {String} layerName 图层的名称
         */
        removeLayer(layerName: any): void;
        /**
         * 移除所有标注
         */
        removeAll(): void;
        /**
         * 移除所有标注
         */
        clear(): void;
    }
}
/**
 * end of file LabelCollection
 */
declare namespace Cegore {
    /**
     * 场景的显示模式模式
     */
    enum SceneMode {
        /**
         * 哥伦布视图模式。
         * 一个2.5D透视视图。
         */
        COLUMBUS_VIEW = 1,
        /**
         * 正在变形中
         */
        MORPHING = 0,
        /**
         * 2D模式，使用从上向下的正射投影
         */
        SCENE2D = 2,
        /**
         * 3D模式，一个传统的三维透视视图和地球
         */
        SCENE3D = 3
    }
    /**
     * 阴影模式
     */
    enum ShadowMode {
        /**
         * 禁用阴影，不产生也不接受阴影
         */
        DISABLED = 0,
        /**
         * 启用阴影，产生和接受阴影
         */
        ENABLED = 1,
        /**
         * 仅产生阴影
         */
        CAST_ONLY = 2,
        /**
         * 仅接受阴影
         */
        RECEIVE_ONLY = 3
    }
    /**
     * 场景管理器
     *
     * 场景管理器负责管理所有的三维图形对象和状态，场景管理器不需要直接创建，通过 Viewer.scene 获取场景管理器对象
     *
     * @see
     * Viewer
     */
    class Scene {
        private _viewer;
        private _czData;
        private _czScene;
        private _globe;
        private _models;
        private _labels;
        /**
         * 构造函数，构造一个新的场景对象
         *
         * 不要自己构造 Scene 对象，通过Viewer.scene获取场景对象
         *
         * @param viewer 视图类
         */
        constructor(viewer: Viewer);
        /**
         * @private
         */
        get _czdata(): any;
        /**
         * 获取当前场景的显示模式
         */
        get mode(): SceneMode;
        /**
         * 设置当前场景的显示模式
         */
        set mode(mode: SceneMode);
        /**
         * 获取全球对象
         */
        get globe(): Globe;
        /**
         * 获取模型集合
         */
        get models(): ModelCollection;
        /**
         * 获取标注集合
         */
        get labels(): LabelCollection;
        /**
         * 是否启用雾效，默认值：true
         */
        get enableFog(): boolean;
        /**
         * 是否启用雾效，默认值：true
         */
        set enableFog(enable: boolean);
        /**
         * 雾的浓度，默认值：2.0e-4
         */
        get fogDensity(): number;
        /**
         * 雾的浓度，默认值：2.0e-4
         */
        set fogDensity(value: number);
        /**
         * 是否启用全屏抗锯齿，默认值：true
         */
        get enableFXAA(): boolean;
        /**
         * 是否启用全屏抗锯齿，默认值：true
         */
        set enableFXAA(enable: boolean);
        /**
         * 地形缩放系数
         */
        get terrainScale(): number;
        /**
         * 地形缩放系数
         */
        set terrainScale(scale: number);
        private _preRender;
        private _poseRender;
        /**
         * 准备绘制事件，事件传递出当前时间
         * 事件原型 `function(time) {}`
         * @event
         */
        get preRender(): Event;
        /**
         * 绘制后事件，事件传递出当前时间
         * 事件原型 `function(time) {}`
         * @event
         */
        get postRender(): Event;
        private _isUnderWater;
        private _UnderWaterMaterial;
        private static readonly _GlobeFog;
        /**
         * 获取是否水下模式
         */
        get underWater(): boolean;
        /**
         * 设置是否启用水下模式
         */
        set underWater(enable: boolean);
        /**
         * 拾取三维场景中位于指定屏幕坐标处的一个对象，
         *
         * @description
         * 该接口只返回一个最外层的对象，如果需要拾取多个对象，请使用 pickMulti() 接口
         *
         * @see
         * pickMulti()
         *
         * @param x 屏幕坐标x
         * @param y 屏幕坐标y
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pick(x: any, y: any): Renderable | undefined;
        /**
         * 拾取三维场景中位于指定屏幕坐标处的一个对象，
         *
         * @description
         * 该接口只返回一个最外层的对象，如果需要拾取多个对象，请使用 pickMulti() 接口
         *
         * @see
         * pickMulti()
         *
         * @param xyArray 屏幕坐标数组
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pick(xyArray: number[]): Renderable | undefined;
        /**
         * 拾取三维场景中位于指定屏幕坐标处的一个对象，
         *
         * @description
         * 该接口只返回一个最外层的对象，如果需要拾取多个对象，请使用 pickMulti() 接口
         *
         * @see
         * pickMulti()
         *
         * @param xyObj 屏幕坐标对象
         * @param xyObj.x x坐标
         * @param xyObj.y y坐标
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pick(xyObj: {
            x: number;
            y: number;
        }): Renderable | undefined;
        /**
         * 拾取三维场景中位于指定屏幕坐标处的一个对象，
         *
         * @description
         * 该接口只返回一个最外层的对象，如果需要拾取多个对象，请使用 pickMulti() 接口
         *
         * @see
         * pickMulti()
         *
         * @param vector2 屏幕坐标对象
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pick(vector2: Vector2): Renderable | undefined;
        /**
         * 返回位于屏幕坐标处的对象列表
         *
         * @description
         * 该接会返回多个对象，如果只需要一个对象，请使用 pick() 接口
         *
         * @see
         * pick()
         *
         * @param x 屏幕坐标x
         * @param y 屏幕坐标y
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pickMulti(x: any, y: any): Renderable[];
        /**
         * 返回位于屏幕坐标处的对象列表
         *
         * @description
         * 该接会返回多个对象，如果只需要一个对象，请使用 pick() 接口
         *
         * @see
         * pick()
         *
         * @param xyArray 屏幕坐标数组
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pickMulti(xyArray: number[]): Renderable[];
        /**
         * 返回位于屏幕坐标处的对象列表
         *
         * @description
         * 该接会返回多个对象，如果只需要一个对象，请使用 pick() 接口
         *
         * @see
         * pick()
         *
         * @param xyObj 屏幕坐标对象
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pickMulti(xyObj: {
            x: number;
            y: number;
        }): Renderable[];
        /**
         * 返回位于屏幕坐标处的对象列表
         *
         * @description
         * 该接会返回多个对象，如果只需要一个对象，请使用 pick() 接口
         *
         * @see
         * pick()
         *
         * @param vector2 屏幕坐标对象
         * @return 返回拾取到的Renderable对象或者undefined
         */
        pickMulti(vector2: Vector2): Renderable[];
        /**
         * 拾取屏幕位置处的空间坐标
         *
         * @param x 屏幕坐标x
         * @param y 屏幕坐标y
         * @return 返回空间坐标
         */
        pickPosition(x: number, y: number): Position;
        /**
         * 拾取屏幕位置处的空间坐标
         *
         * @param xyArray 屏幕坐标数组
         * @return 返回空间坐标
         */
        pickPosition(xyArray: number[]): Position;
        /**
         * 拾取屏幕位置处的空间坐标
         *
         * @param xyObj 屏幕坐标对象
         * @return 返回空间坐标
         */
        pickPosition(xyObj: {
            x: number;
            y: number;
        }): Position;
        /**
         * 拾取屏幕位置处的空间坐标
         *
         * @param vector2 屏幕坐标对象
         * @return 返回空间坐标
         */
        pickPosition(vector2: Vector2): Position;
        /**
         * 计算平面距离
         *
         * @param pts 点列表，数据格式：
         * ```
         *  [[x1,y1],[x2,y2],...]
         *  [{x:x1, y:y1}, {x:x2, y:y2}, ...]
         *  [Position, Position, Position]
         * ```
         *  等
         */
        calcDistance(pts: any[]): number;
        /**
         * 计算地球表面上多边形的投影面积
         * @param pts 多边形的点序列，数据格式：
         * ```
         *  [[x1,y1],[x2,y2],...]
         *  [{x:x1, y:y1}, {x:x2, y:y2}, ...]
         *  [Position, Position, Position]
         * ```
         *  等
         */
        calcArea(pts: any[]): number;
        /**
         * 解析二维坐标
         * @param p1
         * @param p2
         */
        private static asCartesian2;
    }
}
/**
 * End of file
 */ 
declare var CESIUM_BASE_URL: string;
declare var USE_CESIUM_CAMERA_CONTROLLER: boolean;
declare namespace Cegore {
    /**
     *
     */
    class CesiumData {
        private mViewer;
        constructor(viewer: Cesium.Viewer);
        get viewer(): Cesium.Viewer;
        get scene(): Cesium.Scene;
        get camera(): Cesium.Camera;
        get globe(): Cesium.Globe;
        get ellipsoid(): Cesium.Ellipsoid;
    }
    /**
     * 视图类
     *
     * 用来构建应用最基本的类
     *
     * @example
     * ```ts
     *  var viewer = new Cesium.Viewer('Container', {
     *      /// 指定地形数据
     *      terrain: {
     *          url: 'http://localhost:9081/zs/data/tdt/dem'
     *      },
     *      /// 指定影像数据
     *      images:[{
     *              name : 'TdtImage',
     *              url: 'http://localhost:9081/zs/data/tdtonline/image'
     *          }
     *      ],
     *      /// 指定当前的时间
     *      currentTime: new Date(2017,12,26,12,0,0),
     *      /// 指定是否显示全屏按钮
     *      fullscreenButton: true,
     *      /// 指定全屏显示的DOM
     *      fullscreenElement: 'Container',
     *  });
     * ```
     */
    class Viewer {
        private _czData;
        private _camera;
        private _scene;
        private _clock;
        private _controller;
        private _cesium_controller;
        /**
         * 获取版本信息
         */
        static get version(): string;
        /**
         *
         * @param container 用做显示的DOM对象的或者ID
         * @param options 可选的参数
         * @param options.terrain 地形数据源，具体定义参见 Globe.setTerrain()
         * @param options.images 地图影像图层数组，具体定义参见 Globe.addImage()
         * @param options.currentTime 当前时间，默认为系统时间
         * @param options.shadows 是否生成阴影，默认值：false
         * @param options.fullscreenButton 是否显示“全屏显示按钮”，默认值为true
         * @param options.fullscreenElement 用作全屏显示的DOM对象或者ID，默认值为container
         * @param
         */
        constructor(container: string | HTMLElement, options?: {
            terrain?: any;
            images?: ImageLayer[];
            currentTime?: Date;
            shadows?: boolean;
            fullscreenButton?: boolean;
            fullscreenElement?: HTMLElement;
            shouldAnimate?: boolean;
            animation?: boolean;
            baseLayerPicker?: boolean;
            homeButton?: boolean;
            geocoder?: boolean;
            navigationHelpButton?: boolean;
            imageryProvider?: boolean;
            timeline?: boolean;
            sceneModePicker?: boolean;
            selectionIndicator?: boolean;
            infoBox?: boolean;
            highDynamicRange?: boolean;
            czops?: any;
        });
        /**
         * @private
         * @inner
         */
        get _czdata(): CesiumData;
        /**
         * 获取相机
         */
        get camera(): Camera;
        /**
         * 获取场景管理器
         */
        get scene(): Scene;
        /**
         * 获取模型集合
         */
        get models(): ModelCollection;
        /**
         * 获取标注集合
         */
        get labels(): LabelCollection;
        /**
         * 获取球对象
         */
        get globe(): Globe;
        /**
         * 获取影像图层
         */
        get images(): ImageLayerCollection;
        /**
         * 获取时钟对象
         */
        get clock(): Clock;
        /**
         * 获取用于绘图的Canvas元素
         */
        get canvas(): HTMLCanvasElement;
        /**
         * 获取控制器
         */
        get cameraController(): CameraController;
        /**
         * 自定义cesium脚本路径，否则Cesium会初始化失败
         */
        private static cesiumScriptRegex;
        /**
         * 获取根url
         */
        static getBaseUrlFromScript(): string;
    }
}
declare namespace Cegore {
    /**
     * 抽象影像Provider
     */
    abstract class AbstractImageProvider {
        protected _ready: boolean;
        protected _readyPromise: any;
        protected _rectangle: any;
        protected _tileWidth: number;
        protected _tileHeight: number;
        protected _minimumLevel: number;
        protected _maximumLevel: number;
        protected _tilingScheme: any;
        protected _tileDiscardPolicy: any;
        protected _errorEvent: Cesium.Event;
        protected _credit: any;
        protected _proxy: any;
        protected _hasAlphaChannel: boolean;
        /**
         * 表示当前Provider是否准备好了
         */
        get ready(): boolean;
        /**
         * Gets a promise that resolves to true when the provider is ready for use.
         * @memberof ImageryProvider.prototype
         * @type {Promise.<Boolean>}
         * @readonly
         */
        get readyPromise(): any;
        /**
         * 获取数据的范围信息
         */
        get rectangle(): any;
        /**
         * 获取每个瓦片的像素宽度
         */
        get tileWidth(): number;
        /**
         * 获取每个瓦片的像素高度
         */
        get tileHeight(): number;
        /**
         * 获取当前Provider支持的最笑级别
         */
        get minimumLevel(): number;
        /**
         * 获取当前Provider支持的最大级别
         */
        get maximumLevel(): number;
        /**
         * 获取当前瓦片的切片方案
         */
        get tilingScheme(): any;
        get tileDiscardPolicy(): any;
        get errorEvent(): Cesium.Event;
        get credit(): any;
        /**
         * 获取代理信息
         */
        get proxy(): any;
        /**
         * 获取当前图层是否包含透明信息
         */
        get hasAlphaChannel(): boolean;
        getTileCredits(x: number, y: number, level: number): any;
        /**
         * 请求图像数据
         * @param x 列号
         * @param y 行号
         * @param level 等级
         * @param request 可以选的请求对象
         */
        abstract requestImage(x: number, y: number, level: number, request?: any): any;
        /**
         * 拾取要素数据
         * @param x
         * @param y
         * @param level
         * @param longitude
         * @param latitude
         */
        pickFeatures(x: number, y: number, level: number, longitude: number, latitude: number): any;
    }
}
declare namespace Cegore {
}
declare namespace Cegore {
}
/**
 * end of file
 */ 
declare namespace Cegore {
}
/**
 * end of file
 */ 
declare namespace Cegore {
}
/**
 * end of file
 */ 
declare namespace Cegore {
}
declare namespace Cegore {
    class ZMapModelLoader {
        private static LoadModel;
        /**
         * 加载发布的模型数据
         * @param name
         * @param url
         * @param options
         */
        static LoadFromPubModel(name: any, url: any, options?: {
            offset?: {};
        }): ModelGroup;
    }
}
/**
 * end of file
 */ 
declare namespace CZMAP {
    /**
     * 获取对象的唯一ID
     *
     * @param {Object} obj 获取唯一ID的对象
     * @return {string} 对象的唯一ID
     * @api
     */
    function getUid(obj: any): string;
    /**
     * Always returns true.
     * @returns {boolean} true.
     */
    function TRUE(): boolean;
    /**
     * Always returns false.
     * @returns {boolean} false.
     */
    function FALSE(): boolean;
    /**
     * A reusable function, used e.g. as a default for callbacks.
     *
     * @return {void} Nothing.
     */
    function VOID(): void;
    /**
     * 抽象函数
     */
    function abstract(...args: any): any;
    /**
     * 获取 [start,end)之间的随机整数
     * @param {*} start
     * @param {*} end
     */
    function randomInt(start: number, end: number): number;
    /**
     * 获取[start,end)之间的随机数
     * @param {*} start
     * @param {*} end
     */
    function randomFloat(start: number, end: number): number;
    /**
     * 深复制
     * @param o 要复制的对象
     * @param t 复制到的对象
     */
    function deepCopy<T>(o: T, t?: T): T;
    function asArray<T>(v: T | T[]): T[] | undefined;
    function deepAssign<T extends object, R extends object>(target: T, ...sources: R[]): T & R;
    /** 版本比较 */
    function compVersion(v1: string, v2: string): number;
    /**
     * 使用try catch调用函数
     * @param func 函数对象
     * @param args 函数参数
     * @returns
     */
    function tryCatchCall<T extends (...args: any) => any>(func: T, ...args: Parameters<T>): ReturnType<T>;
    /**
     * 使用try catch调用函数
     * @param bind_this this
     * @param func 函数对象
     * @param args 函数参数
     * @returns
     */
    function tryCatchCallByThis<T extends (...args: any) => any>(bind_this: any, func: T, ...args: Parameters<T>): ReturnType<T>;
    /**
     * 依次每前后相邻的两个成员的连续遍历数据
     * @param items 数组对象
     * @param callback 回调函数
     */
    function forEachSegment<T>(items: T[], callback: (t0: T, t1: T, i0: number, i1: number) => void): void;
    /**
     * 依次每前后相邻的两个成员的连续调用回调函数，并返回函数结果
     * @param items 数组对象
     * @param callback 回调函数
     */
    function mapEachSegment<T, U>(items: T[], callback: (t0: T, t1: T, i0: number, i1: number) => U): U[];
    /**
     * 转驼峰命名法
     * @param ss 输入参数
     * @returns 如果符合连字符规范，则返回驼峰格式
     */
    function toCamelCase(ss: string): string;
}
declare namespace CZMAP {
    /**
     * 判断一个变量是否定义
     *
     * @param value 代判断的值
     * @returns 是否定义
     */
    function defined(value: any): boolean;
    /**
     * 返回值或者默认值
     *
     * 判断一个值是否定义，如果定义则，返回这个值，否则返回默认值
     *
     * @param value 待判断的值
     * @param defaultVal 默认值
     */
    function defaultValue<T, V>(value: T, defaultVal: V): T | V;
    /**
     * 从多个输入值中按顺序返回最先定义的值
     * @param vals 待检测的值列表
     * @returns 最先定义的值或者`undefined`
     */
    function defaultValues<T>(...vals: T[]): T;
    /**
     * 生成一个随机字符串
     * @param option
     */
    function randomString(option?: {
        prefix?: string;
        postfix?: string;
        len?: number;
    }): string;
    /**
     * 类 Types
     *
     * 用于JavaScript 类型检查
     *
     */
    class Types {
        /**
         * @see {defaultValue}
         */
        static defaultValue: typeof defaultValue;
        /**
         * @see {defined}
         */
        static isDefined: typeof defined;
        /**
         * 判断一个变量是否为null
         */
        static isNull(value: any): boolean;
        /**
         * 这是一个修正的 typeof运算符
         *
         * Undefined 返回 'undefined'
         * null 返回 'null'
         * Boolean 返回 'boolean'
         * Number 返回 'number'
         * String 返回 'string'
         * Symbol 返回 'symbol'
         * 函数   返回  'function'
         * 数组   返回 'array'
         * Object 返回  'object'
         * @param value 带判断类型的值
         * @return 类型名称
         */
        static typeOf(value: any): string;
        /**
         * 判断是否为函数
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个函数，否则false.
         */
        static isFunction(value: any): boolean;
        /**
         * 判断是否为函数
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isString(value: any): boolean;
        /**
         * 判断是否为数字
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isNumber(value: any): boolean;
        /**
         * 判断是否为对象
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isObject(value: any): boolean;
        /**
         * 判断是否为布尔值
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isBool(value: any): boolean;
        /**
         * 判断是否为数组
         *
         * @param value 要测试的对象
         * @returns 返回true表测试对象是一个字符串对象，否则false.
         */
        static isArray(value: any): boolean;
        /**
         * 判断是否为某类型
         *
         * @param val
         * @param type
         */
        static isInstanceOf(val: any, type: any): boolean;
    }
}
declare namespace CZMAP {
    /**
     * Disposable
     *
     * @classdesc
     * 用于需要清理的对象
     */
    abstract class Disposable {
        /**
         * 是否已经丢弃
         */
        private _disposed;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 清理
         */
        dispose(): void;
        /**
         * 实现该接口以便清理资源
         */
        protected abstract _disposeInternal(): void;
    }
}
declare namespace CZMAP {
    /**
     * 事件的回调函数
     */
    type EventListener = (event: Event) => boolean | void;
    /**
     * 监听对象
     */
    class ListenerObject {
        /**
         * 事件目标
         */
        target: EventTarget;
        /**
         * 事件类型
         */
        type: string;
        /**
         * 事件响应函数
         */
        listener: EventListener;
        /**
         * 绑定对象
         */
        bindto: Object;
        /**
         * 构造函数
         */
        constructor(target: EventTarget, type: string, listener: EventListener, bindto: object);
    }
    /**
     * 事件对象
     *
     */
    class EventTarget extends Disposable {
        /**
         * 待移除的事件
         * @private
         */
        private _removing;
        /**
         * 正在派发的事件
         * @private
         */
        private _dispatching;
        /**
         * 事件监听表（回调函数）
         * @private
         */
        private _listeners;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 获取指定事件类型的监听对象列表
         *
         * @param {string} type 事件类型
         * @return {Array<function>} 监听对象列表
         */
        getListeners(type: string): ListenerObject[];
        /**
         * 是否有指定类型的事件监听器
         *
         * @param {string=} type 事件类型，可以不指定
         * @return {boolean}
         */
        hasListener(type: string): boolean;
        /**
         * 添加事件监听器
         * @param {string} type 事件类型
         * @param {function} listener 事件监听器（回调函数）
         * @param {*} opt_this 可选的this对象
         * @return 返回唯一的监听对象
         */
        addEventListener(type: string, listener: EventListener, opt_this?: object): ListenerObject;
        /**
         * 派发事件
         *
         * 事件参数可以是字符串或者包含type属性的对象
         *
         * @param {{type: string}|Event|string} event 事件对象.
         * @api
         */
        dispatchEvent(event: string | Event, optData?: any): boolean;
        /**
         * 移除指定的事件监听器
         * @param {string} type 类型
         * @param {function} listener 监听器（函数）
         */
        removeEventListener(type: string, listener: EventListener, opt_this?: object): void;
        /**
         * 查找事件监听对象
         * @param {*} listener
         * @param {*} opt_this
         */
        findListener(list: ListenerObject[], listener: EventListener, opt_this?: object): number;
        /**
         * 移除所有事件监听
         */
        removeAllEventListener(): void;
        /**
         * @inheritDoc
         * @override
         */
        protected _disposeInternal(): void;
    }
}
declare namespace CZMAP {
    /**
     * 事件
     *
     */
    class Event {
        /**
         * 停止事件转发
         */
        propagationStopped: boolean;
        /**
         * 事件类型
         * @api
         */
        type: string;
        /**
         * 事件的目标
         * @api
         */
        target: EventTarget;
        /**
         * 额外数据
         */
        data: any;
        /**
         * @param {string} type 类型.
         */
        constructor(type: string);
        /**
         * 停止事件传递
         * @api
         */
        preventDefault(): void;
        /**
         * 停止事件传递
         * @api
         */
        stopPropagation(): void;
    }
}
declare namespace CZMAP {
    class ObservableEvents {
        /**
         * ‘改变’事件
         */
        static CHANGE: string;
    }
    /**
     * @classdesc
     *
     * @fires
     * @api
     */
    class Observable extends EventTarget {
        /**
         * @private
         */
        private _revision;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 增加版本号并派发 'change' 事件
         * @api
         */
        protected changed(): void;
        /**
         * 获取当前对象的版本号，当对象修改后将版本号将增加
         * @return {number} Revision.
         * @api
         */
        getRevision(): number;
        /**
         * 监听指定类型的事件
         * @param {string|Array<string>} type 事件类型或者类型数组
         * @param {function(?): ?} listener 监听函数
         * @param {*} opt_this 可选的this对象
         * @return {} 当前监听键（Key），如果第一个参数是数组，则返回数组
         * @api
         */
        on(type: string, listener: EventListener, opt_this?: object): ListenerObject;
        on(type: string[], listener: EventListener, opt_this?: object): ListenerObject[];
        /**
         * 取消监听指定类型的事件
         * @param {string|Array<string>} type 事件类型或者类型数组
         * @param {function(?): ?} listener 监听函数
         * @api
         */
        un(type: string | string[], listener: EventListener, opt_this?: object): void;
        /**
         * 通过指定的key取消监听
         * @param {Object} key 函数`on()`的返回值
         */
        static unByKey(key: ListenerObject | ListenerObject[]): void;
    }
}
declare namespace CZMAP {
    /**
     * @classdesc
     */
    class ObjectEvent extends Event {
        /**
         * target
         * @override Event
         */
        target: BaseObject;
        /**
         * 属性名称
         * @api
         */
        key: string;
        /**
         * 改变前的值，获取新的值通过 `e.target.get(e.key)` 获取
         * @api
         */
        oldValue: any;
        /**
         * @param {string} type 事件类型.
         * @param {string} key 属性名称.
         * @param {*} oldValue 旧的属性值 `key`.
         */
        constructor(type: string, key: string, oldValue: any);
    }
    /**
     * 用于检查数据格式并自动调整的函数
     */
    type PropertyCheck = (value: any) => any;
    /**
     * 用于比较对象是否相同的函数
     */
    type PropertyEques = (v1: any, v2: any) => boolean;
    class BaseObjectProperty {
    }
    class BaseObjectEvents extends ObservableEvents {
        /**
         * 属性变化事件
         */
        static PROPERTYCHANGE: string;
    }
    /**
     * 事件的回调函数
     */
    type BaseObjectEventListener = (event: ObjectEvent) => boolean | void;
    /**
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Most non-trivial classes inherit from this.
     *
     * @fires ObjectEvent
     * @api
     */
    class BaseObject extends Observable {
        /**
         * @private
         */
        private _values;
        /**
         * 构造函数
         * @param values An object with key-value pairs.
         */
        constructor(values?: object);
        /**
         * 定义属性
         * @param {String} key 属性名称
         * @param {*} def 属性默认值
         * @param {Function=} check 属性检查函数
         */
        protected def(key: string, def?: any, check?: PropertyCheck, equals?: PropertyEques): void;
        /**
         * 获取属性值
         * @param {string} key 属性名称
         * @return {*} 属性值
         * @api
         */
        get(key: string): any;
        /**
         * 获取属性名称列表
         * @return {Array<string>} 属性名称列表
         * @api
         */
        getKeys(): string[];
        /**
         * 获取所有的属性名称和值
         * @return {Object<string, *>} 所有的属性名称和值
         * @api
         */
        getProperties(): object;
        /**
         * @param {string} key Key name.
         * @param {*} oldValue Old value.
         */
        notify(key: string, oldValue: any, optData?: any): void;
        /** 通知当前属性 */
        notifyCurrent(key: string): void;
        /**
         * 通知所有属性
         */
        notifyAll(): void;
        /**
         * 设置属性值
         * @param {string} key 属性名称
         * @param {*} value 属性值
         * @param {boolean=} opt_silent 不派发事件
         * @api
         */
        set(key: string, value: any, opt_silent?: boolean, opt_data?: any): void;
        /**
         * 设置一组属性，旧的属性不会被移除
         * @param {Object<string, *>} values 多个属性
         * @param {boolean=} opt_silent 不派发事件
         * @api
         */
        setProperties(values: object, opt_silent?: boolean): void;
        /**
         * 删除一个属性
         * @param {string} key 属性名称
         * @param {boolean=} opt_silent 不派发事件
         * @api
         */
        unset(key: string, opt_silent?: boolean): void;
        /**
         * 监听指定属性的changed事件
         * @param {string} key 属性名称
         * @param {BaseObjectEventListener} listener 监听函数
         * @param {object} opt_this 可选的this对象
         * @return 当前监听键（Key），如果第一个参数是数组，则返回数组
         * @api
         */
        onProperty(key: string, listener: BaseObjectEventListener, opt_this?: object): ListenerObject;
        /**
         * 取消监听指定属性的changed事件
         * @param {string} key 属性名称
         * @param {BaseObjectEventListener} listener 监听函数
         * @param {*} opt_this 可选的this对象
         * @api
         */
        unProperty(key: string, listener: BaseObjectEventListener, opt_this?: object): void;
        /**
         * 监听所有属性的changed事件
         * @param listener
         * @param opt_this
         * @returns
         */
        onAllProperty(listener: BaseObjectEventListener, opt_this?: object): ListenerObject;
        /**
         * 取消监听所有属性的changed事件
         * @param listener
         * @param opt_this
         * @returns
         */
        unAllProperty(listener: BaseObjectEventListener, opt_this?: object): void;
        /**
         * @param {string} key Key name.
         * @return {string} Change name.
         */
        static getChangeEventType(key: string): string;
        /**
         *
         * @param {BaseObject} o
         * @param {*} key
         * @param {*} create
         * @return {ObjectProperty}
         */
        private _getProperty;
        /** 初始化定义项 */
        protected _initDefines(): void;
    }
}
declare namespace CZMAP {
    interface ComMapOption {
        projection?: string;
    }
    /**
     * 地图类
     */
    class ComMap extends BaseObject {
        private _mapID;
        private _mapDOM;
        private _viewID;
        private _viewDOM;
        private _overlayRoot;
        private _overlayRootN;
        private _view;
        private _mode;
        private _projection;
        private _enableTip;
        private _dynData;
        private _options;
        constructor(mode: MapMode, dom: string | HTMLElement, options?: any);
        get mapID(): string;
        get mapDOM(): HTMLElement;
        get viewID(): string;
        get viewDOM(): HTMLElement;
        get overlayRoot(): HTMLDivElement;
        /** 获取根图层 */
        get rootLayer(): LayerManager;
        /**
         * 获取图层管理器
         * @deprecated
         * @see ComMap.rootLayer
         */
        get layers(): LayerManager;
        /** 获取投影系 */
        get projection(): string;
        /** 获取当前的显示模式 */
        get mode(): MapMode;
        /** 获取视图类 */
        get view(): MapView;
        /** 获取二维视图 */
        get view2d(): MapView2D;
        /** 获取三维视图 */
        get view3d(): MapView3D;
        /**
         * 缩放到指定范围
         * @param {*} extent
         */
        zoomTo(extent: Extent): void;
        /**
         * 飞行到指定范围
         * @param {*} extent
         */
        flyTo(extent: Extent): void;
        /**
         * 创建路径漫游工具
         * @param {Array} path
         */
        createPathRoam(): PathRoam<MapView>;
        /**
         * 测量距离
         */
        measureDistance(option: MeasureDistOption): void;
        /**
         * 测量面积
         */
        measureArae(option: MeasureAreaOption): void;
        /**
         * 清除测量
         */
        measureClear(): void;
        /**
         * 获取是否启用tip（提示事件）
         */
        get enableTip(): boolean;
        /**
         * 设置启动鼠标提示事件
         */
        set enableTip(enable: boolean);
        /**
         * 设置鼠标tip事件
         * @param {*} callback
         * @param {*} opt_this
         */
        setOnTip(callback: MapMouseEventCallback, opt_this?: any): void;
        /**
         * 设置点击事件
         * @param callback
         * @param opt_this
         */
        setOnClick(callback: MapMouseEventCallback, opt_this?: any): void;
        /**
         * 获取动态数据支持
         */
        get dynamiceDate(): DynamicData;
        /** 获取根元素 */
        get containerElement(): HTMLElement;
        /** 创建底图视图对象 */
        private _createMapView;
        private _createDOM;
        /** 销毁 */
        destroy(): void;
        protected _disposeInternal(): void;
    }
}
declare namespace CZMAP {
    /**
     * 投影系，参照系，空间参照系等
     */
    type ProjectionLike = string;
    /**
     * 投影变换支持
     */
    class Projection {
        /**
         * 定义投影系
         */
        static defs(...defs: any[]): void;
    }
    const Proj: typeof Projection;
}
declare namespace CZMAP {
    const urlSearchs: URLSearchParams;
}
declare namespace CZMAP {
    type DynamicStyleOptions = {
        url: string;
        originkey: string;
        dynamicekey: string;
        interval: number;
    };
    class DynamicStyle {
        map: ComMap;
        layer: VectorLayer;
        layerdef: any;
        url: string;
        originkey: string;
        dynamicekey: string;
        interval: number;
        handle: (e: any) => void;
        /**
         *
         * @param {VectorLayer} fc
         * @param {*} options
         */
        constructor(map: ComMap, fc: VectorLayer, layerdef: any, options?: DynamicStyleOptions);
        /**
         * 动态更新数据
         * @param data
         */
        private update;
        reg(): void;
        unreg(): void;
    }
}
declare namespace CZMAP {
    export interface LayerDefine {
        id?: string;
        name?: string;
        type: string;
        visible?: boolean;
    }
    /** 格式解析器定义 */
    type FormatterDefine = TableDataFormatOption | GeoJSONFormatOption;
    export interface FolderDefine extends LayerDefine {
        children: LayerDefine[];
    }
    interface UrlDefine {
        url: string;
    }
    export interface TerrainDefine extends LayerDefine, UrlDefine {
    }
    export interface TileDefine extends LayerDefine, UrlDefine {
        style?: {
            'map-type'?: string;
            extent?: number[];
            subdomains?: string | string[];
            scheme?: string;
            'min-level'?: number;
            'max-level'?: number;
        };
    }
    export interface VectorDefine extends LayerDefine, UrlDefine {
        /** 数据 */
        data: Record<string, any>;
        /** 格式器 */
        formatter?: FormatterDefine;
        style?: {};
        refLine?: {
            url?: string;
            data?: string | object;
            radius: number;
        };
        /** 距离聚合 */
        enableCluster?: boolean;
        /** 点更新动画 */
        pointAnimation?: PointAnimation;
        /** @deprecated @see {@linkcode PointAnimation.enable}  */
        enableAnimation?: boolean;
        /** @deprecated @see {@linkcode PointAnimation.duration} */
        animationTimes?: number;
        /** @deprecated @see {@linkcode PointAnimation.maxDistance} */
        maxAnimationDistance?: number;
        /** 多级聚合 */
        multiLevelCluster?: ClusterOption;
        dynamic?: DynamicStyleOptions;
    }
    export interface ModelDefine extends LayerDefine, UrlDefine {
        position?: Point;
        offset?: Point;
        pose?: Point;
        scale?: Point;
        enableCluster?: boolean;
        style?: {
            string?: boolean;
            expand?: boolean;
            expandTree?: boolean;
            expandLeaf?: boolean;
            flat?: boolean;
            merge?: string;
            label?: {};
        };
    }
    export interface VolumeDefine extends VolumeLayerOptions {
    }
    /**
     * 地图加载器
     */
    export class MapLoader {
        /**
         * 加载多个图层
         * @param cmap
         * @param layers
         */
        static loadMapLayers(cmap: ComMap, layers: LayerDefine | LayerDefine[]): Layer | Layer[];
        /**
         * 加载一个图层
         * @param parent
         * @param layerdef
         */
        static loadLayer<T extends LayerDefine>(parent: Folder, layerdef: T): Layer;
        static loadFolder(parent: Folder, layerdef: FolderDefine): Folder;
        static loadTerrain(parent: Folder, layerdef: TerrainDefine): TerrainLayer;
        static loadTileLayer(parent: Folder, layerdef: TileDefine): TileLayer;
        static loadFormatter(define: FormatterDefine): TableDataFormat<FormatterDefine> | GeoJSONFormat<FormatterDefine>;
        static loadVectorLayer(parent: Folder, layerdef: VectorDefine): VectorLayer;
        static loadModelLayer(parent: Folder, layerdef: ModelDefine): ModelLayer;
        static loadVolumeLayer(parent: Folder, layerdef: VolumeDefine): Layer;
        static loadTdtilesLayer(parent: Folder, layerdef: TDTilesLayerOptions): TDTilesLayer;
        static loadLayerOther(parent: Folder, layerdef: LayerDefine): Layer;
    }
    export {};
}
declare namespace CZMAPAPP {
    type MapLoader = CZMAP.MapLoader;
    const MapLoader: typeof CZMAP.MapLoader;
    type DynamicStyle = CZMAP.DynamicStyle;
    const DynamicStyle: typeof CZMAP.DynamicStyle;
}
declare namespace ZMap3D {
    class Map {
        constructor(dom: string, options?: any, options2?: any);
    }
}
declare namespace Cesium {
    interface Entity {
        _czmap_obj?: CZMAP.Layer;
    }
    interface Polyline {
        _czmap_obj?: CZMAP.Layer;
    }
    interface TerrainProvider {
        _czmap_obj?: CZMAP.Layer;
    }
    var VERSION: string;
    interface PerspectiveFrustumV62 {
        getPixelDimensions(drawingBufferWidth: number, drawingBufferHeight: number, distance: number, result: Cartesian2): Cartesian2;
    }
}
/**
 * 统一 ZMap 地图控件
 */
declare namespace CZMAP {
}
declare namespace CZMAP {
    export interface ActionOption {
        type: string;
    }
    export abstract class Action {
        readonly id: number;
        private _view;
        private _czviewer?;
        constructor(view: CZMAP.MapView, option: ActionOption);
        get view(): MapView;
        get czviewer(): Cesium.Viewer;
        /** 初始化 */
        init(): Promise<void>;
        /** 开始 */
        abstract start(): void;
        /** 暂停 */
        abstract pause(): void;
        /** 结束 */
        abstract finish(): void;
        /** 销毁 */
        destroy(): void;
        protected cancelFlight(): void;
    }
    interface LoopOption {
        duration?: number;
        skip?: number;
        callback?: (percent: number, time: number) => void;
        finish?: () => void;
    }
    export class Loop {
        readonly id: number;
        duration: number;
        skip: number;
        callback: (percent: number, time: number, deltaTime: number) => void;
        finish: () => void;
        private handle;
        constructor(option?: LoopOption);
        start(start?: number): void;
        pause(): void;
        stop(): void;
        private skipNum;
        private lastTime;
        private currentTime;
        private loop;
        private requestNext;
        private cancelNext;
    }
    export {};
}
declare namespace CZMAP {
    interface ActionGroupOption {
        start: number;
        end: number;
        actions: ActionOption[];
    }
    class ActionGroup {
        private _start;
        private _end;
        private _actions;
        constructor(view: CZMAP.MapView, option: ActionGroupOption);
        get begin(): number;
        get end(): number;
        get duration(): number;
        get actions(): Action[];
        /** 开始 */
        start(): void;
        pause(): void;
        /** 结束 */
        finish(): void;
        destroy(): void;
    }
}
declare namespace CZMAP {
    interface AudioPlayerEventMap {
        "play": globalThis.Event;
        "pause": globalThis.Event;
        "ended": globalThis.Event;
    }
    type AudioPlayerListener<K extends keyof AudioPlayerEventMap> = (this: AudioPlayer, ev: AudioPlayerEventMap[K]) => any;
    /**
     * 音频播放器。基于AudioContext
     */
    export class AudioPlayer extends globalThis.EventTarget {
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
}
declare namespace CZMAP {
    interface ActionPlayerOption {
        groups: ActionGroupOption[];
        audio: string;
    }
    class ActionPlayer {
        private _view;
        private _groups;
        private _loopHandle;
        private _current;
        private _paused;
        private _currents;
        private _audioPlayer;
        private _inited;
        private _ready;
        private _readyResolve;
        constructor(view: CZMAP.MapView);
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
}
declare namespace CZMAP {
    type ActionCreator = {
        new (view: CZMAP.MapView, option: ActionOption): Action;
    };
    export function createAction<T extends ActionOption>(view: CZMAP.MapView, option: T): Action;
    export function registerAction(name: string, creator: ActionCreator): void;
    export {};
}
declare namespace CZMAP {
    type FeatureLike = {
        id?: string;
        properties: object;
        geometry: Geometry | GeometryLike;
    };
    /**
     * 要素的属性
     */
    enum FeatureProperty {
        ID = "id",
        PROPERTIES = "properties",
        GEOMETRY = "geometry"
    }
    /**
     * 要素
     */
    class Feature extends BaseObject {
        /**
         * 构造一个新的要素
         * @param {Object} feature
         */
        constructor(feature?: FeatureLike);
        /**
         * ID
         */
        get id(): any;
        set id(v: any);
        /**
         * 属性
         */
        get properties(): any;
        set properties(v: any);
        /**
         * 几何对象
         */
        get geometry(): Geometry;
        set geometry(v: Geometry);
        /**
         *
         * @param geo
         */
        private static checkGeometry;
    }
}
declare namespace CZMAP {
    type GeometryLike = {
        type: string;
        coordinates: Coordinates;
        /**
         * 圆的圆心
         */
        center?: Point;
        /**
         * 圆的半径
         */
        radius?: number;
    };
    /**
     * 坐标变化回调函数
     */
    type TransformProc = (src: Point, dest: Point) => void;
    /**
     * 几何对象的基类
     */
    abstract class Geometry {
        /**
         * 包围盒
         */
        protected readonly _box: BoundingBox;
        /**
         * 构造一个几何对象
         * @param geo
         */
        constructor();
        /**
         * 获取几何的类型
         */
        get type(): GeometryType;
        /**
         * 获取几何的坐标
         */
        get coordinates(): Coordinates;
        /**
         * 获取当前对象的box
         */
        get box(): BoundingBox;
        /**
         * 计算包围盒
         * @protected
         */
        protected computeBox(): void;
        /**
         * 克隆当前对象
         */
        abstract clone(): Geometry;
        /**
         * 获取几何的坐标点
         */
        abstract getCoordinates(): Coordinates;
        /**
         * 获取几何类型
         */
        abstract getGeometryType(): GeometryType;
        /**
         * 对当前对象应用坐标变换
         * @abstract
         * @param {TransformProc} proc Transform.
         */
        abstract applyTransform(proc: TransformProc, opt_this?: object): void;
    }
}
declare namespace CZMAP {
    /**
     * 要素格式类型
     */
    enum FeatureFormatType {
        ARRAY_BUFFER = "arraybuffer",
        JSON = "json",
        TEXT = "text",
        XML = "xml"
    }
    interface FeatureFormatOption {
        /** 类型 */
        type?: string;
        /** 坐标偏移 */
        coordinateOffset?: Point;
    }
    /**
     * 要素格式化
     */
    abstract class FeatureFormat<Option extends FeatureFormatOption = FeatureFormatOption> {
        protected _option: Option;
        constructor(option?: Option);
        /**
         * 获取要素格式的类型
         */
        abstract getType(): FeatureFormatType;
        /**
         * Read a single feature from a source.
         */
        abstract readFeature(source: string | object, options?: object): Feature;
        /**
         * Read all features from a source.
         */
        abstract readFeatures(source: ArrayBuffer | object | string, options?: object): Feature[];
        /**
         * Read a single geometry from a source.
         */
        abstract readGeometry(source: object | string, options?: object): Geometry;
        /**
         * Read the projection from a source.
         */
        abstract readProjection(source: object | string, options?: object): ProjectionLike;
        protected applyOffset(geometry: Geometry): void;
    }
}
declare namespace CZMAP {
    /**
     * 几何类型
     */
    enum GeometryType {
        /**
         * 点类型
         */
        POINT = "point",
        /**
         * 折线
         */
        POLYLINE = "polyline",
        /**
         * 多边形
         */
        POLYGON = "polygon",
        /**
         * 多点
         */
        MULTI_POINT = "multipoint",
        /**
         * 多线
         */
        MULTI_POLYLINE = "multipolyline",
        /**
         * 多多边形
         */
        MULTI_POLYGON = "multipolygon",
        /**
         * 圆
         */
        CIRCLE = "circle",
        /**
         * 矩形
         */
        RECTANGLE = "rectange"
    }
}
declare namespace CZMAP {
    /**
     * 几何工厂
     */
    class GeometryFactory {
        /**
         * 创建几何对象
         * @param geo
         */
        static create(geo: GeometryLike | Geometry): Geometry;
    }
}
declare namespace CZMAP {
    interface JSONFeatureFormatOption extends FeatureFormatOption {
    }
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Base class for JSON feature formats.
     */
    abstract class JSONFeatureFormat<Option extends JSONFeatureFormatOption = JSONFeatureFormatOption> extends FeatureFormat<Option> {
        constructor(option?: Option);
        /**
         * 获取要素格式的类型
         */
        getType(): FeatureFormatType;
        /**
         * @inheritDoc
         */
        readFeature(source: object, options?: object): Feature;
        /**
         * @inheritDoc
         */
        readFeatures(source: string | object, options?: object): Feature[];
        /**
         * @inheritDoc
         */
        readProjection(source: string | object, options?: object): ProjectionLike;
        /**
         * @inheritDoc
         */
        readGeometry(source: string | object, options?: object): Geometry;
        /**
         * 从对象中读取要素
         */
        abstract readFeatureFromObject(object: object, options?: object): Feature;
        /**
         * 从对象中读取多个要素
         */
        abstract readFeaturesFromObject(object: object, options?: object): Feature[];
        /**
         * 从对象中读取几何对象
         */
        abstract readGeometryFromObject(object: object, options?: object): Geometry;
        /**
         * 从对象中读取投影信息
         */
        abstract readProjectionFromObject(object: object, options?: object): ProjectionLike;
    }
}
declare namespace CZMAP {
    interface GeoJSONFormatOption extends JSONFeatureFormatOption {
    }
    /**
     * @classdesc
     * Feature format for reading and writing data in the GeoJSON format.
     *
     * @api
     */
    class GeoJSONFormat<Option extends GeoJSONFormatOption = GeoJSONFormatOption> extends JSONFeatureFormat<Option> {
        /**
         * @param opt_options Options.
         */
        constructor(option?: Option);
        /**
         * @inheritDoc
         */
        readFeatureFromObject(object: object): Feature;
        /**
         * @inheritDoc
         */
        readFeaturesFromObject(object: object): Feature[];
        /**
         * @inheritDoc
         */
        readGeometryFromObject(object: object): Geometry;
        /**
         * @inheritDoc
         */
        readProjectionFromObject(object: object): ProjectionLike;
        /**
         *
         * @param {*} object
         */
        private _readGeometry;
    }
}
declare namespace CZMAP {
    /** 坐标数据的布局 */
    enum GeometryLayout {
        /** [x,y] */
        XY = "xy",
        /** [x,y,z] */
        XYZ = "xyz",
        /** [x,y,m] */
        XYM = "xym",
        /** [x,y,z,m] */
        XYZM = "xyzm"
    }
    /** 表格数据定义 */
    interface TableMeta {
        /** 数据类型 */
        type?: GeometryType;
        /** 数据投影系 */
        epsg: string;
        /** 坐标字段 */
        x?: string;
        y?: string;
        z?: string;
        /** 数据路径 */
        datapath: string[];
        /** 坐标字段 */
        coordinates?: string;
        /** 坐标布局 */
        layout?: GeometryLayout;
    }
    interface TableDataFormatOption extends JSONFeatureFormatOption {
        option?: TableMeta;
    }
    /**
     *
     * @api
     */
    class TableDataFormat<Option extends TableDataFormatOption = TableDataFormatOption> extends JSONFeatureFormat<Option> {
        private _meta;
        /**
         */
        constructor(option?: Option);
        /**
         * @inheritDoc
         */
        readFeatureFromObject(data: object, options?: object): Feature;
        /**
         * @inheritDoc
         */
        readFeaturesFromObject(data: object): Feature[];
        /**
         * @inheritDoc
         */
        readGeometryFromObject(object: object, option?: object): Geometry;
        /**
         * @inheritDoc
         */
        readProjectionFromObject(object: object, option?: object): string;
        private getTableMeta;
        private getDataList;
        private _readGeometry;
    }
}
declare namespace CZMAP {
    /**
     * 包围盒
     */
    class BoundingBox {
        minx: number;
        miny: number;
        minz: number;
        maxx: number;
        maxy: number;
        maxz: number;
        static Empty: Readonly<BoundingBox>;
        static formString(sbox: string, result?: BoundingBox): BoundingBox;
        static formCenterSize(center: Point, size: Point, result?: BoundingBox): BoundingBox;
        static fromExtent(extent: number[]): BoundingBox;
        constructor();
        normalMinMax(): void;
        setMin(pt: Point): void;
        setMax(pt: Point): void;
        setMinMax(min: Point, max: Point): void;
        /**
         * 获取中心点
         * @param {Point} opt_point 可选的输出目标
         */
        getCenter(opt_point?: Point): Point;
        /**
         * 获取宽度
         */
        getWidth(): number;
        /**
         * 获取高度
         */
        getHeight(): number;
        /**
         * 获取深度
         */
        getDepth(): number;
        /**
         * 获取最小点
         */
        getMin(opt_point?: Point): Point;
        /**
         * 获取最大点
         * @param opt_point 可选的输出对象
         */
        getMax(opt_point?: Point): Point;
        /**
         * 获取box的尺寸
         * @param {Point} opt_size 可选的输出目标
         */
        getSize(opt_size?: Point): Point;
        /** 获取包围半径 */
        getBoundRadius(): number;
        /** 获取角点坐标 */
        getCorners(): Point[];
        /**
         * 是否为空
         * @return {boolean} Is empty.
         * @api
         */
        isEmpty(): boolean;
        /**
         * 设置为空
         */
        setEmtpty(): void;
        /**
         * 外扩或者缩小当前box
         * @param value 扩大或者缩小的尺寸
         */
        inflate(value: number): void;
        /**
         * 外扩或者缩小当前box
         * @param multiple 倍数
         */
        inflateMultiple(multiple: number): void;
        /**
         * 外扩或者缩小当前box
         * @param x 扩大或者缩小的尺寸
         * @param y 扩大或者缩小的尺寸
         * @param z 扩大或者缩小的尺寸
         */
        inflateXYZ(x: number, y: number, z: number): void;
        /**
         * 是否包含点坐标
         * @param point 点坐标
         */
        containsPoint(point: Point): boolean;
        /**
         * 是否包含是xyz坐标
         */
        containsXYZ(x: number, y: number, z?: number): boolean;
        /**
         * 克隆对象
         * @param {Box} opt_box 可选的输出对象
         */
        clone(opt_box?: BoundingBox): BoundingBox;
        /**
         * 合并box到当前对象
         * @param {Box} box
         */
        mergeBox(box: BoundingBox): void;
        /**
         * 合并点到当前box中
         * @param {Point} pt
         */
        mergePoint(pt: Point): void;
        /**
         * 合并xyz坐标到box中
         * @param {number} x
         * @param {number} y
         * @param {number} z
         */
        mergeXYZ(x: number, y: number, z: number): void;
        /**
         * 从坐标串到当前box中
         * @param {Coordinates} coordinates
         */
        mergeCoordinates(coordinates: Coordinates): void;
    }
}
declare namespace CZMAP {
    /**
     * 表示一个矩形范围
     */
    type Extent = [number, number, number, number];
    /**
     * `Extent` 的操作函数
     */
    class Extents {
        /**
         * 创建一个空的 Extent
         * @return {Extent}.
         * @api
         */
        static createEmpty(): Extent;
        /**
         * 创建一个新的 `Extent` 或者更新提供的 `Extent`
         * @param {number} minX 最小的 X.
         * @param {number} minY 最小的 Y.
         * @param {number} maxX 最大的 X.
         * @param {number} maxY 最大的 Y.
         * @param {Extent=} opt_extent
         * @return {Extent}
         */
        static createOrUpdate(minX: number, minY: number, maxX: number, maxY: number, opt_extent?: Extent): Extent;
        /**
         * 创建一个新的空 `Extent` 或者使上一个 `extent` 为空
         * @param {Extent=} opt_extent Extent.
         * @return {Extent} Extent.
         */
        static createOrUpdateEmpty(opt_extent?: Extent): Extent;
        /**
         * @param {Array<[x,y]>} coordinates 坐标串.
         * @param {Extent=} opt_extent Extent.
         * @return {Extent} Extent.
         */
        static createOrUpdateFromCoordinates(coordinates: Coordinates, opt_extent?: Extent): Extent;
        /**
         * 计算所有坐标点的外包框
         *
         * @param {Array<[x,y]>} coordinates Coordinates.
         * @return {Extent} Bounding extent.
         * @api
         */
        static boundingExtent(coordinates: Coordinates): Extent;
        /**
         * 计算缓冲区
         * @param {Extent} extent Extent.
         * @param {number} value The amount by which the extent should be buffered.
         * @param {Extent=} opt_extent Extent.
         * @return {Extent} Extent.
         * @api
         */
        static buffer(extent: Extent, value: number, opt_extent?: Extent): Extent;
        /**
         * 克隆当前对象
         *
         * @param {Extent} extent Extent to clone.
         * @param {Extent=} opt_extent Extent.
         * @return {Extent} The clone.
         */
        static clone(extent: Extent, opt_extent?: Extent): Extent;
        /**
         * 是否包含坐标，内部或者边上
         *
         * @param {Extent} extent Extent.
         * @return {boolean} The coordinate is contained in the extent.
         * @api
         */
        static containsCoordinate(extent: Extent, coordinate: Point): boolean;
        /**
         * 是否包含
         *
         * @param {Extent} extent1 Extent 1.
         * @param {Extent} extent2 Extent 2.
         * @return {boolean} The second extent is contained by or on the edge of the
         *     first.
         * @api
         */
        static containsExtent(extent1: Extent, extent2: Extent): boolean;
        /**
         * 是否包含，内部或者边界上
         *
         * @param {Extent} extent Extent.
         * @param {number} x X coordinate.
         * @param {number} y Y coordinate.
         * @return {boolean} The x, y values are contained in the extent.
         * @api
         */
        static containsXY(extent: Extent, x: number, y: number): boolean;
        /**
         * 是否相同
         * @param {Extent} extent1 Extent 1.
         * @param {Extent} extent2 Extent 2.
         * @return {boolean} The two extents are equivalent.
         * @api
         */
        static equals(extent1: Extent, extent2: Extent): boolean;
        /**
         * 合并 extent2 到 extent1
         * @param {Extent} extent1 The extent to be modified.
         * @param {Extent} extent2 The extent that will be included in the first.
         * @return {Extent} A reference to the first (extended) extent.
         * @api
         */
        static extend(extent1: Extent, extent2: Extent): Extent;
        /**
         * @param {Extent} extent Extent.
         */
        static extendCoordinate(extent: any, coordinate: any): void;
        /**
         * 合并坐标到当前Extent
         * @param {Extent} extent Extent.
         * @return {Extent} Extent.
         */
        static extendCoordinates(extent: any, coordinates: any): any;
        /**
         * @param {Extent} extent Extent.
         * @param {number} x X.
         * @param {number} y Y.
         */
        static extendXY(extent: any, x: any, y: any): void;
        /**
         * Get the size of an extent.
         * @param {Extent} extent Extent.
         * @return {number} Area.
         * @api
         */
        static getArea(extent: Extent): number;
        /**
         * 获取中心
         * @param {Extent} extent Extent.
         * @return {[x,y]} Center.
         * @api
         */
        static getCenter(extent: Extent): Point;
        /**
         * 求交集
         * @param {Extent} extent1 Extent 1.
         * @param {Extent} extent2 Extent 2.
         * @param {Extent=} opt_extent Optional extent to populate with intersection.
         * @return {Extent} Intersecting extent.
         * @api
         */
        static getIntersection(extent1: Extent, extent2: Extent, opt_extent?: Extent): Extent;
        /**
         * 获取尺寸
         * @api
         */
        static getSize(extent: Extent): Point;
        /**
         * @api
         */
        static getTopLeft(extent: Extent): Point;
        /**
         * @api
         */
        static getTopRight(extent: Extent): Point;
        /**
         * @api
         */
        static getBottomLeft(extent: Extent): Point;
        /**
         * @api
         */
        static getBottomRight(extent: Extent): Point;
        /**
         * @param {Extent} extent Extent.
         * @return {number} Width.
         * @api
         */
        static getWidth(extent: Extent): number;
        /**
         * @param {Extent} extent Extent.
         * @return {number} Height.
         * @api
         */
        static getHeight(extent: Extent): number;
        /**
         * 是否相交
         * @param {Extent} extent1 Extent 1.
         * @param {Extent} extent2 Extent.
         * @return {boolean} The two extents intersect.
         * @api
         */
        static intersects(extent1: Extent, extent2: Extent): boolean;
        /**
         * 是否为空
         * @param {Extent} extent Extent.
         * @return {boolean} Is empty.
         * @api
         */
        static isEmpty(extent: Extent): boolean;
        /**
         * @param {Extent} extent Extent.
         * @param {Extent=} opt_extent Extent.
         * @return {Extent} Extent.
         */
        static returnOrUpdate(extent: Extent, opt_extent?: Extent): Extent;
        /**
         * @param {Extent} extent Extent.
         * @param {number} value Value.
         */
        static scaleFromCenter(extent: Extent, value: number): void;
    }
}
declare namespace CZMAP {
    /**
     * 几何————圆
     */
    class GeoCircle extends Geometry {
        private _center;
        private _radius;
        /**
         * 构造一个圆形
         * @param {*} center
         * @param {*} radius
         */
        constructor(center: Point, radius: number);
        constructor(circle: GeoCircle);
        constructor(circle: GeometryLike);
        /**
         * 获取圆的中心点
         */
        get center(): Point;
        /**
         * 获取圆的半径
         */
        get radius(): number;
        /**
         * 克隆当前对象
         */
        clone(): Geometry;
        /**
         * 获取几何的坐标点
         */
        getCoordinates(): Coordinates;
        /**
         * 获取几何类型
         */
        getGeometryType(): GeometryType;
        /**
         * 对当前对象应用坐标变换
         * @abstract
         * @param {TransformProc} proc Transform.
         */
        applyTransform(proc: TransformProc, opt_this?: object): void;
        /**
         * 计算包围盒
         * @override
         * @abstract
         */
        protected computeBox(): void;
    }
}
declare namespace CZMAP {
    /**
     * 几何————点对象
     */
    class GeoPoint extends Geometry {
        x: number;
        y: number;
        z: number;
        /**
         * 坐标串
         */
        private readonly _coordinates;
        /**
         * 构造一个点
         * @param {Point} point
         */
        constructor(point: Point);
        /**
         * 构造一个点
         * @param {Point} point
         */
        constructor(point: GeoPoint);
        /**
         *
         * @param point
         */
        constructor(point: GeometryLike);
        /**
         * 构造一个点对象
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        constructor(x: number, y: number, z: number);
        /**
         * 克隆当前对象
         */
        clone(): GeoPoint;
        /**
         * 获取几何的坐标点
         */
        getCoordinates(): Coordinates;
        /**
         * 获取几何类型
         */
        getGeometryType(): GeometryType;
        /**
         * 对当前对象应用坐标变换
         * @abstract
         * @param {TransformProc} proc Transform.
         */
        applyTransform(proc: TransformProc, opt_this?: object): void;
        /**
         * 计算包围盒
         * @override
         * @abstract
         */
        protected computeBox(): void;
    }
}
declare namespace CZMAP {
    /**
     * 几何————多边形对象
     */
    class GeoPolygon extends Geometry {
        private _coordinates;
        /**
         * 构造一个多边形对象
         * @param {Polygon} polygon 多边形坐标
         */
        constructor(polygon: Polygon);
        /**
         * 构造一个多边形对象
         * @param {GeoPolygon} polygon
         */
        constructor(polygon: GeoPolygon);
        /**
         * 构造一个多边形对象
         * @param polygon
         */
        constructor(polygon: GeometryLike);
        get coordinates(): Polygon;
        /**
         * 克隆当前对象
         */
        clone(): Geometry;
        /**
         * 获取几何的坐标点
         */
        getCoordinates(): Polygon;
        /**
         * 获取几何类型
         */
        getGeometryType(): GeometryType;
        /**
         * 对当前对象应用坐标变换
         * @abstract
         * @param {TransformProc} proc Transform.
         */
        applyTransform(proc: TransformProc, opt_this?: object): void;
    }
}
declare namespace CZMAP {
    /**
     * 几何————线对象
     */
    class GeoPolyline extends Geometry {
        /**
         * 坐标序列
         */
        private _coordinates;
        /**
         * 构造一个线对象
         * @param {Polyline} polyline
         */
        constructor(polyline: Polyline);
        /**
         * 构造一个线对象
         * @param polyline
         */
        constructor(polyline: GeoPolyline);
        /**
         * 构造一个线对象
         * @param polyline
         */
        constructor(polyline: GeometryLike);
        get coordinates(): Polyline;
        /**
         * 克隆当前对象
         */
        clone(): Geometry;
        /**
         * 获取几何的坐标点
         */
        getCoordinates(): Polyline;
        /**
         * 获取几何类型
         */
        getGeometryType(): GeometryType;
        /**
         * 对当前对象应用坐标变换
         * @abstract
         * @param {TransformProc} proc Transform.
         */
        applyTransform(proc: TransformProc, opt_this?: object): void;
    }
}
declare namespace CZMAP {
    /**
     * 几何————圆
     */
    class GeoRectangle extends Geometry {
        private _min;
        private _max;
        private static _coords;
        /**
         * 通过最小值和最大值构造一个矩形
         * @param min
         * @param max
         */
        constructor(min: Point, max: Point);
        constructor(rect: GeoRectangle);
        constructor(rect: GeometryLike);
        /**
         * 自动翻转最大最小值
         */
        fitMinMax(): void;
        /**
         * 获取圆的中心点
         */
        get min(): Point;
        /**
         * 获取圆的半径
         */
        get max(): Point;
        /**
         * 克隆当前对象
         */
        clone(): Geometry;
        /**
         * 获取几何的坐标点
         */
        getCoordinates(): Coordinates;
        /**
         * 获取几何类型
         */
        getGeometryType(): GeometryType;
        /**
         * 对当前对象应用坐标变换
         * @abstract
         * @param {TransformProc} proc Transform.
         */
        applyTransform(proc: TransformProc, opt_this?: object): void;
        /**
         * 计算包围盒
         * @override
         * @abstract
         */
        protected computeBox(): void;
    }
}
declare namespace CZMAP {
    /**
     * 一些简单数据对象
     */
    /**
     * 点
     */
    type Point = [number, number, number];
    type MultiPoint = Point[];
    /**
     * 折线
     */
    type Polyline = Point[];
    type MultiPolyline = Polyline[];
    /**
     * 环
     */
    type Ring = Point[];
    /**
     * 多边形
     */
    type Polygon = Ring[];
    type MultiPolygon = Polygon[];
    /**
     * 坐标串
     */
    type Coordinates = Point | Polyline | Polygon | MultiPolygon;
    /**
     * 复制点
     * @param src 待复制的对象
     * @param opt 输出目标
     */
    function copyPoint(src: Point, opt?: Point): Point;
    function comparePoint(src: Point, tar: Point): boolean;
    function createEmptyPoint(): Point;
    function createOrUpdatePoint(x: number, y: number, z: number, opt_point?: Point): Point;
    function forEachPoints<T extends Coordinates>(coordinates: T, callback: (pt: Point) => void): void;
    function mapCoordinates<F>(coordinates: Point, callback: (pt: Point) => F): F;
    function mapCoordinates<F>(coordinates: Polyline, callback: (pt: Point) => F): F[];
    function mapCoordinates<F>(coordinates: Polygon, callback: (pt: Point) => F): F[][];
    function mapCoordinates<F>(coordinates: MultiPolygon, callback: (pt: Point) => F): F[][][];
}
interface Array<T> {
    x: T;
    y: T;
    z: T;
    minx: T;
    miny: T;
    maxx: T;
    maxy: T;
}
declare namespace CZMAP {
    class GraphArc {
        private mStart;
        private mEnd;
        private mLength;
        mEnable: boolean;
        constructor(start: number, end: number, length: number);
        get isEnable(): boolean;
        set isEnable(enable: boolean);
        get length(): number;
        get startVertex(): number;
        get endVertex(): number;
    }
    class GraphVertex<T extends PointLike> {
        private mPoint;
        mStartArcs: number[];
        mEndArcs: number[];
        constructor(pt: T);
        get startArcs(): number[];
        get endArcs(): number[];
        get point(): T;
    }
    class Graph<T extends PointLike> {
        private mPoints;
        private mVertices;
        private mArcs;
        constructor(t: number);
        init(tol: number): void;
        /**
        * add vertex to a grap
        */
        addVertex(pt: T): ExistAddResult;
        /**
        * add edge to a graph
        */
        addArc(startVertex: number, endVertex: number, length: number): number;
        enableArc(arc: number, enable: boolean): void;
        enableVertex(pt: number, enable: boolean): void;
        vertexCount(): number;
        vertex(idx: number): GraphVertex<T>;
        arcCount(): number;
        arc(idx: number): GraphArc;
        /**
        * find vertex by point
        * \return vertex index
        */
        findVertex(pt: PointLike): number;
        clear(): void;
    }
}
declare namespace CZMAP {
    class GraphAnalyzer<T extends PointLike> {
        mPassPoints: PointLike[];
        setStartEnd(start: PointLike, end: PointLike): void;
        setPassPoints(pts: PointLike[]): void;
        doAnalysis(g: Graph<T>): {
            path: T[];
            distance: number;
        };
        static dijkstra<T extends PointLike>(src: Graph<T>, abortArc: Set<number>, start: number): number[];
        static shortestTree<T extends PointLike>(src: Graph<T>, abortArc: Set<number>, start: number): Graph<T>;
        static shortestPath<T extends PointLike>(src: Graph<T>, abortArc: Set<number>, start: number, end: number): {
            arcs: number[];
            cost: number;
        };
        static shortestPath2<T extends PointLike>(src: Graph<T>, abortArc: Set<number>, pts: number[]): {
            arcs: number[];
            cost: number;
        };
    }
}
declare namespace CZMAP {
    export enum GraphDirection {
        ForwardDirection = 1,
        ReverseDirection = 2,
        DoubleDirection = 3
    }
    export class GraphBuilder<T extends PointLike> {
        private mGraph;
        private mIsLongLat;
        constructor(tolerance?: number, isLonglat?: boolean);
        setParam(tolerance?: number, isLonglat?: boolean): void;
        pushLine(p1: T, p2: T, dt?: GraphDirection, weight?: number): void;
        pushLines(points: T[], dt?: GraphDirection, weight?: number): void;
        tieds(point: T, maxDistance?: number): {
            id: number;
            vertex: GraphVertex<T>;
        };
        tiePoint(option: {
            point: T;
            maxDistance?: number;
            attachPoint?: boolean;
        }): {
            id: number;
            vertex: GraphVertex<T>;
        };
        tieds2(pts: T[], maxDistance?: number): void;
        setAvoidPoints(pt: PointLike, distance: number): void;
        get graph(): Graph<T>;
        private findNearestArc;
    }
    interface LineItem extends PointLike {
        properties: Record<string, any>;
    }
    export class FeatureGraphBuilder extends GraphBuilder<LineItem> {
        private mDirectionField;
        private mWeightField;
        private mForwardDirectionValue;
        private mReverseDirectionValue;
        private mDoubleDirectionValue;
        private mDefaultDirection;
        constructor(tolerance?: number, isLonglat?: boolean);
        setDirectionFeild(name: string): void;
        setWeightField(name: string): void;
        setDirectionValue(doubleDir: any, forwardDir: any, reverseDir: any): void;
        setDefaultDirection(dt: GraphDirection): void;
        pushFeature(f: GeoJSON.Feature): void;
        pushLineString(pts: Point[], props: Record<string, any>): void;
    }
    export {};
}
declare namespace CZMAP {
}
declare namespace CZMAP {
    /**
     * 图层的构造参数
     */
    interface LayerOptions {
        /** 图层的名称 */
        name?: string;
        /** 图层是否可见 */
        visible?: boolean;
        /** 图层的不透明度 */
        opacity?: number;
        /** 图层的颜色 */
        color?: string;
        /** @deprecated 图层的定义 */
        define?: any;
    }
    /**
     * 图层对象的事件类型
     */
    class LayerEvents extends BaseObjectEvents {
        static INIT: string;
        static DESTROY: string;
    }
    class LayerProperty extends BaseObjectProperty {
        static VISIBLE: string;
        static OPACITY: string;
        static COLOR: string;
    }
    /**
     * 图层
     * @abstract
     */
    abstract class Layer extends BaseObject {
        /** 图层ID */
        private _id;
        /** 图层名称 */
        private _name;
        /** 父图层 */
        private _parent;
        /** 图层管理器 */
        private _owner;
        /** 是否初始化 */
        private _inited;
        /** 图层是否就绪 */
        private _ready;
        protected _readyResolve: () => void;
        protected _readyReject: (reason?: any) => void;
        define: any;
        /**
         * 构造函数
         * @param parent 父图层
         * @param option 图层的定义
         */
        constructor(parent: Folder, option?: LayerOptions);
        /** 获取图层ID */
        get id(): number;
        /** 获取地图对象 */
        get map(): ComMap;
        /** 获取视图对象 */
        get view(): MapView;
        /** 图层的所有者 */
        get owner(): LayerManager;
        /** 父图层 */
        get parent(): Folder;
        /** 图层的名称 */
        get name(): string;
        /** 获取图层类型名称 */
        get type(): string;
        /** 图层是否就绪 */
        get ready(): Promise<void>;
        /** 返回图层是否可见 */
        get visible(): boolean;
        /**
         * 设置图层是否可见
         * @param {bool} visible
         */
        set visible(visible: boolean);
        /** 获取图层透明度 */
        get opacity(): number;
        /** 设置图层透明度 */
        set opacity(value: number);
        /** 获取图层的颜色 */
        get color(): string;
        /** 设置图层的颜色 */
        set color(value: string);
        /** 返回子图层 */
        get children(): Layer[];
        /**
         * 返回图层包围盒
         * @return
         */
        abstract get boundBox(): BoundingBox;
        /** 是否文件夹图层 */
        isFolder(): boolean;
        /**
         * 设置是否可见
         * @param visible
         */
        setVisible(visible: boolean): void;
        /** 缩放到模型 */
        zoomTo(option?: ZoomToOption): void;
        /** 飞到模型 */
        flyTo(option?: FlyToOption): void;
        /** 初始化图层 */
        private _init;
        /** 准备ready */
        protected _prepReady(): void;
        /** 销毁图层 */
        destroy(): void;
        /** 移除从节点上移除图层 */
        remove(): void;
        /**
         * 查找图层
         * @param name
         * @returns
         */
        findLayer(name: string | ((layer: Layer) => boolean)): Layer;
        /** 遍历所有图层 */
        forEachLayers(callback: (layer: Layer) => void): void;
        /**
         * 遍历指定类型的所有图层
         * @param type
         * @param callback
         */
        forEachTypeLayers<T extends Layer, O extends LayerOptions>(type: LayerCreatorType<T, O>, callback: (layer: T) => void): void;
        /** 创建内部资源 */
        protected abstract _createInner(): void;
        /** 销毁内部资源 */
        protected abstract _destroyInner(): void;
        /** @override */
        protected _disposeInternal(): void;
        /**
         * visible 事件
         * @param event
         */
        private _handleVisibleChange;
        /** visible发生改变 */
        protected _onVisible(v: boolean): void;
    }
}
declare namespace CZMAP {
    interface MoveableLayerOptions extends LayerOptions {
        position?: Point;
        pose?: Point;
        scale?: Point;
    }
    interface RelativeValue<T> {
        /** 值 */
        value?: T;
        /** true：绝对的，false：相对的 */
        absolute?: boolean;
    }
    /** 移动动作 */
    interface MoveAction {
        /** 位置 */
        position?: RelativeValue<Point>;
        /** 姿态HPR */
        pose?: RelativeValue<Point>;
        /** 缩放比 */
        scale?: RelativeValue<Point>;
        /** 延时 */
        delay?: number;
        /** 持续时间 */
        duration?: number;
    }
    class MoveableLayerProperty extends LayerProperty {
        static POSITION: string;
        static POSE: string;
        static SCALE: string;
    }
    /**
     * 体数据图层
     */
    abstract class MoveableLayer extends Layer {
        constructor(parent: Folder, option: MoveableLayerOptions);
        /** 位置属性 */
        get position(): Point;
        set position(position: Point);
        /** 姿态属性 */
        get pose(): Point;
        set pose(pose: Point);
        /** 缩放比 */
        get scale(): Point;
        set scale(scale: Point);
        /** 移动图层 */
        move(actions: MoveAction | MoveAction[]): void;
        /**  */
        private _handlePositionChange;
        private _handlePoseChange;
        private _handleScaleChange;
        /** */
        private _updateHandle;
        protected _notifyTransformChange(): void;
        protected _onTransformChange(): void;
    }
}
declare namespace CZMAP {
    interface DecalWaterOption {
        waveSizeA?: number;
        waveSizeB?: number;
        waveSpeed?: number;
        waveStrength?: number;
    }
    interface DecalLayerOption extends MoveableLayerOptions {
        uri?: string;
        url?: string;
        points?: Ring;
        polygon?: Polygon;
        polygons?: Polygon[];
        decalType?: string;
        decalSize?: number;
        decalWater?: DecalWaterOption;
        image?: {
            uri: string;
            size: Point;
        };
        height?: number;
        thickness?: number;
    }
    abstract class DecalLayer extends MoveableLayer {
        constructor(parent: Folder, option: DecalLayerOption);
    }
}
declare namespace CZMAP {
    abstract class LayerRender extends Disposable {
        private _visible;
        private _view;
        private _parent;
        constructor(parent: Layer);
        /**
         * 获取父对象
         */
        get parent(): Layer;
        /** 获取视图对象 */
        get view(): MapView;
        /** 获取地图对象 */
        get map(): ComMap;
        /** 是否可见 */
        get visible(): boolean;
        /** 设置可见 */
        set visible(visible: boolean);
        /** 缩放图层 */
        zoomTo(option?: ZoomToOption): void;
        /** 飞到图层 */
        flyTo(option?: FlyToOption): void;
        /** 包围盒 */
        abstract get box(): BoundingBox;
        /** 销毁对象 */
        destroy(): void;
        /** */
        protected _disposeInternal(): void;
        protected abstract _onVisibleChangle(): void;
    }
}
declare namespace CZMAP {
    abstract class FeatureRender extends LayerRender {
        /**
         */
        constructor(parent: FeatureLayer);
        /** 获取要素对象 */
        get featureLayer(): FeatureLayer;
        /** 获取矢量图层 */
        get vectorLayer(): VectorLayer;
        /**
         * 获取要素
         * @see FeatureLayer.feature
         */
        get feature(): Feature;
        /**
         * 获取几何对象
         * @see FeatureLayer.geometry
         */
        get geometry(): Geometry;
        /**
         * 获取样式
         * @see FeatureLayer.style
         */
        get style(): FeatureStyle;
        /** 销毁对象 */
        destroy(): void;
        /** 初始化工作 */
        protected abstract _init(): void;
        /** 销毁工作 */
        protected abstract _release(): void;
        /** 初始化属性绑定 */
        private _initPropHandle;
        /** 释放事件句柄 */
        private _releasePropHandle;
        /** 要素改变 */
        private _handleFeatureChange;
        /** 样式改变 */
        protected _handleStyleChange(event: ObjectEvent): void;
        /** 几何改变回调 */
        protected abstract _handleGeometryChange(event: ObjectEvent): void;
        private _handleFeature;
        /** 监听要素 */
        private _listenFeature;
        /** 结束监听要素 */
        private _unlistenFeature;
        private _handleStyle;
        /** 监听样式 */
        private _listenStyle;
        private _unlistenStyle;
        protected _handleLabelStyle(event: ObjectEvent): void;
        protected _handleIconStyle(event: ObjectEvent): void;
        protected _handleModelStyle(event: ObjectEvent): void;
        protected _handleStrokeStyle(event: ObjectEvent): void;
        protected _handleWallStyle(event: ObjectEvent): void;
        /** 通知样式 */
        protected _notifyStyle(): void;
        /** 投影坐标到当前地图坐标 */
        protected _transformCoordinates(pts: Coordinates): Coordinates;
    }
}
declare namespace CZMAP {
    interface FeatureOptions extends LayerOptions {
        feature: Feature | FeatureLike;
        style?: FeatureStyle;
    }
    enum FeatureLayerProperty {
        FEATURE = "feature",
        STYLE = "style"
    }
    /**
     * 要素对象
     */
    abstract class FeatureLayer extends Layer {
        private _box;
        /**
         * 构造一个新的要素
         * @param parent 父对象，FeatureCollectionLayer
         * @param data 数据
         * @param data.name 图层的名称
         * @param data.feature 要素
         * @param data.style
         */
        constructor(parent: VectorLayer, options: FeatureOptions);
        /**
         * 获取图层类型名称
         */
        get type(): string;
        /**
         * 图层的父对象
         */
        get parent(): VectorLayer;
        /**
         * 返回图层包围盒
         * @return
         */
        get boundBox(): BoundingBox;
        abstract get render(): FeatureRender;
        /**
         * 显示隐藏标注
         * @param {*} enable
         * @api
         */
        set enableLabel(enable: boolean);
        /**
         * 是否显示图标
         * @return {Boolean}
         */
        get enableLabel(): boolean;
        /**
         * 显示隐藏图标
         * @param {Boolean} enable
         * @api
         */
        set enableIcon(enable: boolean);
        /**
         * 是否显示图标
         */
        get enableIcon(): boolean;
        /**
         *
         */
        get feature(): Feature;
        set feature(feature: Feature);
        /**
         * 是否启用聚合
         */
        get enableCluster(): boolean;
        /**
         * 获取图层的投影
         */
        get projection(): string;
        /**
         * 要素的样式
         */
        get style(): FeatureStyle;
        set style(style: FeatureStyle);
        /**
         * 获取要素的属性表
         * @api
         */
        get properties(): object;
        /**
         * 获取要素的几何
         * @api
         */
        get geometry(): Geometry;
        protected _onVisible(v: boolean): void;
        /**
         * 将当前图层坐标系坐标转换为地图坐标系
         * @param pts 待投影的坐标
         * @returns 投影后的坐标
         */
        transformCoordinates<T extends Coordinates>(pts: T): T;
    }
}
declare namespace CZMAP {
    interface FlowsParam {
        /** 路径 */
        path?: Point[];
        /** 线路循环 */
        pathLoop?: boolean;
        /** 车道数 */
        pathLanes?: number;
        /** 车道宽度 */
        laneWidth?: number;
        /** 前后间距 */
        interval?: number;
        /** 移动速度 */
        speed?: number;
        /** 是否贴地 */
        onground?: boolean;
        /** 是否双向 */
        twoSide?: boolean;
        /** 双向间距 */
        twoSideGap?: number;
        /** 随机布放 */
        random?: boolean;
        /** 随机偏移 */
        randomOffset?: number;
        /** 模型缩放 */
        scale?: Point;
        /** 模型旋转 */
        rotation?: number;
        /** 自定义颜色 */
        customColor?: boolean | string;
    }
    interface FlowsLayerOption extends MoveableLayerOptions {
        flows: FlowsParam;
        flowsType: 'man' | 'arrow';
    }
    abstract class FlowsLayer extends MoveableLayer {
        constructor(parent: Folder, option: FlowsLayerOption);
        abstract setFlowsParam(param: FlowsParam): void;
        /**
         * 获取图层类型名称
         * @override
         */
        get type(): string;
    }
}
declare namespace CZMAP {
    interface FolderOptions extends LayerOptions {
    }
    class FolderEvent extends Event {
        layer: Layer;
        constructor(type: string, layer: Layer);
    }
    class FolderEvents extends LayerEvents {
        static CHILD_ADDED: string;
        static CHILD_REMOVED: string;
    }
    interface LayerTypeMap {
        'folder': Folder;
        'point': VectorLayer;
        'vector': VectorLayer;
        'tile': TileLayer;
        'map': TileLayer;
        '3dtiles': TDTilesLayer;
        'terrain': TerrainLayer;
        'model': ModelLayer;
        'volmue': VolumeLayer;
        'feature': FeatureLayer;
        'foliage': FoliageLayer;
    }
    interface LayerOptionsMap {
        'folder': FolderOptions;
        'point': VectorLayerOptions;
        'vector': VectorLayerOptions;
        'tile': TileLayerOptions;
        'map': TileLayerOptions;
        '3dtiles': TDTilesLayerOptions;
        'terrain': TerrainOptions;
        'model': ModelLayerOptions;
        'volmue': VolumeLayerOptions;
        'feature': FeatureOptions;
        'foliage': FoliageLayerOption;
    }
    /**
     * 目录图层
     */
    class Folder extends Layer {
        protected _children: Layer[];
        /**
         * 构造函数
         * @param {Folder} parent
         * @param {String} define.name 图层名称
         */
        constructor(parent: Folder, options?: FolderOptions);
        /**
         * 创建图层
         * @param type 图层类型
         * @param options 图层参数
         */
        createLayer<Type extends keyof LayerTypeMap, Options extends LayerOptionsMap[Type]>(type: Type, options: Options): LayerTypeMap[Type];
        /**
         * 创建图层
         * @param type 图层类型
         * @param options 图层参数
         */
        createLayer<Define extends LayerOptions>(type: string, options: Define): Layer;
        /**
         * 创建图层
         * @param creator 图层工厂
         * @param options 图层参数
         */
        createLayer<LayerType extends Layer, Options extends LayerOptions>(creator: LayerCreator<LayerType, Options>, options: Options): LayerType;
        /**
         * 删除图层
         */
        removeLayer(lyr: Layer | number): void;
        /**
         * 移除所有图层
         */
        removeAllLayer(): void;
        /**
         * 获取图层类型名称
         */
        get type(): string;
        /**
         * 是否文件夹图层
         */
        isFolder(): boolean;
        /**
         * 返回子图层
         * @override
         */
        get children(): Layer[];
        /**
         * 返回图层包围盒
         * @return
         */
        get boundBox(): BoundingBox;
        /** @override */
        protected _createInner(): void;
        /** @override */
        protected _destroyInner(): void;
        /** 图层可见性发生改变 */
        private _handleFolderVisibleChanged;
        /** 子图层可见性发生改变 */
        private _handleChildVisibleChanged;
    }
}
declare namespace CZMAP {
    interface FoliageItem {
        position: Point;
        pose: Point;
        scale: Point;
    }
    interface FoliageInfo {
        mesh: string;
        items: FoliageItem[];
    }
    interface FoliageItemID {
        id?: number;
        mesh: string;
    }
    interface FoliageItemDetail extends FoliageItem, FoliageItemID {
    }
    interface FoliageLayerOption extends LayerOptions {
        foliages: FoliageInfo[];
    }
    abstract class FoliageLayer extends Layer {
        protected _foliages: FoliageInfo[];
        protected _box: BoundingBox;
        constructor(parent: Folder, option: FoliageLayerOption);
        /**
         * 获取图层类型名称
         */
        get type(): string;
        get boundBox(): BoundingBox;
        addItem(mesh: string, item: FoliageItem): void;
        updateItem(mesh: string, id: number, item: FoliageItem): void;
        removeItem(mesh: string, id: number): void;
        getItems(mesh: string): FoliageItem[];
        getFoliages(): FoliageInfo[];
        private _getFoliage;
        private _updateBoundBox;
        protected abstract _addItems(items: FoliageItemDetail[]): void;
        protected abstract _updateItems(items: FoliageItemDetail[]): void;
        protected abstract _removeItems(items: FoliageItemID[]): void;
        static asItemDetail(mesh: string, id: number, items: FoliageItem[]): FoliageItemDetail[];
    }
}
declare namespace CZMAP {
    type LayerEventCallback = (e: Layer) => void;
    class LayerManagerEvents extends FolderEvents {
        static LAYER_ADDED: string;
        static LAYER_REMOVED: string;
        static LAYER_VISIBLE_CHANGED: string;
    }
    /** 图层构造函数 */
    type LayerCreator<T extends Layer, O extends LayerOptions> = new (parent: Folder, options: O) => T;
    /** 通用构造 */
    type LayerCreatorComm = LayerCreator<Layer, LayerOptions>;
    /** 构造函数类型 */
    type LayerCreatorType<T extends Layer, O extends LayerOptions> = abstract new (parent: Folder, options: O) => T;
    /**
     * 图层管理器
     */
    abstract class LayerManager extends Folder {
        /** 地图对象 */
        private _map;
        /** 图层构建器 */
        private _creators;
        /** 地形图层列表 */
        private _terrains;
        /** 当前地形图层 */
        private _terrain;
        private _onLayerAdded;
        private _onLayerRemoved;
        private _onLayerVisible;
        protected _next_id: number;
        /**
         *
         */
        constructor(map: ComMap);
        /**
         * 获取地图对象
         */
        get map(): ComMap;
        /**
         * 获取视图对象
         */
        get view(): MapView;
        /**
         * 获取图层类型名称
         */
        get type(): string;
        /**
         * 获取地形图层
         */
        get terrains(): TerrainLayer[];
        /**
         * 获取激活的地形
         */
        get activeTerrain(): TerrainLayer;
        /**
         * 下一个图层ID
         */
        nextID(): number;
        /** 获取图层创建器 */
        getCreator(type: string): LayerCreatorComm;
        /** 注册图层创建器 */
        protected _register(type: string, creator: LayerCreatorComm): void;
        /** @deprecated */
        get onLayerAdded(): LayerEventCallback;
        /** @deprecated */
        get onLayerRemoved(): LayerEventCallback;
        /** @deprecated */
        get onLayerVisible(): LayerEventCallback;
        /** @deprecated */
        set onLayerAdded(cb: LayerEventCallback);
        /** @deprecated */
        set onLayerRemoved(cb: LayerEventCallback);
        /** @deprecated */
        set onLayerVisible(cb: LayerEventCallback);
        private _handleEvents;
        private _unhandleEvents;
        private _handleLayerAdded;
        private _handleLayerRemoved;
        private _handleLayerVisibleChange;
        /**
         * 地形图层可见性改变事件
         * @param event
         * @returns
         */
        private _handleTerrainChange;
        protected _clearTerrain(): void;
        protected _applyTerrain(terrain: TerrainLayer): void;
    }
}
declare namespace CZMAP {
    /**
     * 合并结果
     */
    type MergeResult = {
        name: string;
        index: number[];
    };
    /**
     * 合并函数
     */
    type MergeSubModel = (names: string[]) => MergeResult[];
    /** 模型炸开参数 */
    interface ModelExplodeOption {
        /** 模型炸开动画时长，单位：毫秒，默认值：1000 */
        duration?: number;
        /** 炸开倍数，默认值：5 */
        explodeMultiple?: number;
    }
    class ModelNode {
        box: BoundingBox;
        node: number;
        constructor(item?: TDFeatureInfo);
        static fromPoint(point: Point): ModelNode;
    }
    interface ModelLayerOptions extends FolderOptions {
        url: string;
        position?: Point;
        offset?: Point;
        pose?: Point;
        scale?: Point;
        label?: LabelStyle;
        /** 加载平面模型或者球面模型 */
        flat?: boolean;
        /** 是否聚合 */
        enableCluster?: boolean;
        /** 展开模型 */
        expandChild?: boolean;
        /** 展开模型树 */
        expandChildTree?: boolean;
        /** 展开叶子节点 */
        expandLeafChild?: boolean;
        /** 合并子模型 */
        mergeChild?: MergeSubModel;
    }
    interface BoundingBoxOption {
        color?: string;
    }
    enum ModelDataFormat {
        GLTF = 0,
        OBJ = 1,
        ZFCLS = 2,
        TDTILES = 3
    }
    /**
     * 3维模型类
     */
    class ModelLayer extends Folder {
        /**
         * 三维视图
         */
        private view3d;
        private scene;
        /**
         * 数据地址
         */
        private _url;
        private _url2;
        /**
         * 位置
         */
        private _position;
        /** 偏移信息 */
        private _offset;
        /** 姿态 */
        private _pose;
        private _box;
        private _boxEntity;
        private _boxOption;
        private _gridEntity;
        private _gridOption;
        /**
         * 缩放比
         */
        private _scale;
        private _flat;
        private _enableCluster;
        /**
         * 数据格式
         */
        private _format;
        private _expandChild;
        private _expandChildTree;
        private _expandLeafChild;
        private _mergeChild;
        private _enableLabel;
        private _labelStyle;
        private _show_child;
        /**
         * 模型列表
         */
        private _models;
        private _labels;
        private _zfclsInfo;
        /**
         * @param {*} options
         */
        constructor(parent: Folder, options: ModelLayerOptions);
        /**
         * 添加模型
         * @param url 模型的URL
         */
        private _addModel;
        /**
         * 创建子图层
         * @param name
         * @param model
         * @param center
         */
        private _createSubLayer;
        protected _createInner(): void;
        /** 初始化模型的ready */
        private _initModelReady;
        private _createOriginalModel;
        private _createObjModel;
        /**
         * 加载zfcls模型数据
         * @param url
         */
        private _createZfclsModel;
        private _createModelTreeItem;
        /**
         * 获取图层类型名称
         */
        get type(): string;
        /**
         * 返回图层包围盒
         * @return
         */
        get boundBox(): BoundingBox;
        /** 获取要素类信息 */
        get zfclsInfo(): TDFeatureClsInfo;
        /** @override */
        flyTo(option?: FlyToOption): void;
        private _explodes;
        /** 模型炸开 */
        doExplode(option?: ModelExplodeOption): void;
        /** 模型复原 */
        restoreExplode(): void;
        /**
         * 显示或者隐藏包围盒
         * @param show
         * @param color
         */
        showBoxEntity(show?: boolean, option?: BoundingBoxOption): void;
        switchBoxEntity(option?: BoundingBoxOption): void;
        private _updateBoxEntity;
        /**
         * 显示坐标网格
         * @param show
         * @param option
         */
        showCoordGrid(show: boolean, option?: GridOption): void;
        switchCoordGrid(option?: GridOption): void;
        private _updateCoordGrid;
        /**
         *
         * @param zoomOrFly
         */
        private zoomOrFlyto;
        /**
         * 显示隐藏标注
         * @param {*} enable
         */
        showLabel(enable: boolean): void;
        get enableLabel(): boolean;
        set enableLabel(enable: boolean);
        /** 位置属性 */
        set position(pos: Point);
        get position(): Point;
        set pose(pose: Point);
        /** 姿态属性 */
        get pose(): Point;
        set scale(scale: Point);
        get scale(): Point;
        set offset(offset: Point);
        get offset(): Point;
        /**
         * 是否启用聚合
         */
        get enableCluster(): boolean;
        set enableCluster(enable: boolean);
        /** 获取模型数据的格式 */
        get format(): ModelDataFormat;
        get url2(): string;
        /** */
        private _clips;
        private _clipModel;
        /**
         * 设置剖切面
         * @param axis 坐标轴
         * @param distance
         */
        setClip(axis: 'x' | 'y' | 'z' | '+x' | '+y' | '+z' | '-x' | '-y' | '-z', distance: number): void;
        clearClip(): void;
        /** 同步其他地址模型和当前模型同高度 */
        syncScaleHeight(others: ModelLayer[]): Promise<void>;
        private _modelOrientation;
        private _labelOrientation;
        private _modelMatrix4;
        private _labelMatrix4;
        /**
         * 更新模型的位置和方位
         */
        private _updatePositionAndPose;
        private _updateHandle;
        private _updatePositionAndPoseImpl;
        private _requestUpdateBoundBox;
        private _updateBoundBoxZfcls;
        private _updateBoundBoxCommon;
        private _updateBoundBox;
        /**
         * 销毁图层
         */
        protected _destroyInner(): void;
        /**
         * 设置显示和隐藏
         * @param {*} v
         * @override
         */
        protected _onVisible(v: boolean): void;
        get models(): Cesium.Model[];
    }
    function calcModelBoundBox(model: Cesium.Model, nodes?: number[]): BoundingBox;
}
declare namespace CZMAP {
    interface StaticImageLayerOptions extends LayerOptions {
        url: string;
        minLevel?: number;
        maxLevel?: number;
        extent?: number[];
    }
    /**
     * 瓦片图层
     */
    abstract class StaticImageLayer extends Layer {
        protected options: StaticImageLayerOptions;
        /**
         *
         */
        constructor(parent: Folder, options: StaticImageLayerOptions);
        /**
         * 获取图层类型名称
         */
        get type(): string;
    }
}
declare namespace CZMAP {
    /**
     *
     */
    interface SubModelOptions extends LayerOptions {
        model: Cesium.Model;
        nodes?: ModelNode[];
        label?: Cesium.Entity;
    }
    /**
     * 子模型图层
     */
    class SubModelLayer extends Folder {
        private _model;
        private _nodes;
        private _label;
        private _flashHandle;
        private _nodecmds;
        private view3d;
        static defaultFlashColor: string;
        /**
         * 构造函数
         * @param parent 父图层
         * @param define 图层的定义
         * @param define.name 图层名称
         */
        constructor(parent: ModelLayer, options: SubModelOptions);
        flyTo(option?: FlyToOption & {
            flashColor: string;
        }): void;
        private _getBoundingSphere;
        private zoomOrFly;
        protected _onVisible(v: boolean): void;
        get enableLabel(): boolean;
        set enableLabel(v: boolean);
        get enableCluster(): boolean;
        /**
         * 获取属性列表
         */
        get properties(): any[];
        /** 开始闪烁 */
        startFlash(option?: {
            flashColor?: string;
            flashCount?: number;
            flashInterval?: number;
        }): void;
        /** 取消闪烁 */
        cancelFlash(): void;
    }
}
declare namespace CZMAP {
    /**
     * 3DTileset图层选项
     */
    interface TDTilesLayerOptions extends MoveableLayerOptions {
        /** 3dtileset数据地址 */
        url: string;
        /** 3dtileset 最大屏幕空间误差 */
        maxSSE?: number;
    }
    /**
     * 3DTileset图层
     */
    abstract class TDTilesLayer extends MoveableLayer {
        constructor(parent: Folder, options: TDTilesLayerOptions);
        abstract maxSSE: number;
    }
}
declare namespace CZMAP {
    /**
     * 地形开挖选项
     */
    interface TerrainLayerClipOption {
        clip?: Point[];
        height?: number;
        inner?: boolean;
        wall?: boolean;
        floor?: boolean;
    }
    /**
     * 地形数据选项
     */
    interface TerrainDataOptions {
        /** 地形服务地址 */
        url: string;
        /** 地形最大场景空间误差 */
        maxSSE?: number;
        /** 地形高程偏移 */
        heightOffset?: number;
        /** 地形缩放 */
        heightScale?: number;
        /** 地形缩放偏移 */
        heightScaleOffset?: number;
        /** 地形开发参数 */
        clip?: TerrainLayerClipOption;
    }
    /**
     * 地形图层现象
     */
    interface TerrainOptions extends LayerOptions, TerrainDataOptions {
    }
    /**
     * 地形图层
     */
    class TerrainLayer extends Layer {
        private _option;
        constructor(parent: Folder, options: TerrainOptions);
        setClip(option: TerrainLayerClipOption): void;
        /** 设置地形夸张 */
        setExaggeration(scale: number, scaleOffset?: number, heightOffset?: number): void;
        setMaxSSE(maxSSE: number): void;
        /**
         * 返回图层包围盒
         * @return
         */
        get boundBox(): BoundingBox;
        protected _createInner(): void;
        /**
         * 销毁图层
         */
        protected _destroyInner(): void;
        /**
         * 获取图层类型名称
         */
        get type(): string;
        get url(): string;
        get option(): TerrainOptions;
    }
}
declare namespace CZMAP {
    interface TileLayerOptions extends LayerOptions {
        mapType: string;
        url: string;
        minLevel?: number;
        maxLevel?: number;
        extent?: number[];
        scheme?: TileLayerScheme | string;
        subdomains?: string | string[];
    }
    /**
     * 瓦片图层
     */
    abstract class TileLayer extends Layer {
        private options;
        /**
         *
         */
        constructor(parent: Folder, options: TileLayerOptions);
        /**
         * 获取图层类型名称
         */
        get type(): string;
        static parseScheme(scheme: string): TileLayerScheme;
    }
}
declare namespace CZMAP {
    /**
     * 瓦片图层方案
     */
    enum TileLayerScheme {
        /** 经纬度 */
        Geographic = "GEOGRAPHIC",
        /** Web摩卡托 */
        WebMercator = "WEBMERCATOR"
    }
}
declare namespace CZMAP {
    /**
     * 数据源基类
     */
    abstract class Source extends BaseObject {
        /**
         * 空间投影系
         */
        private _projection;
        /**
         * 数据源状态
         */
        private _state;
        /**
         * 构造新的数据源
         * @param options
         */
        constructor(options: {
            projection?: ProjectionLike;
            state?: SourceState;
        });
        /**
         * 获取数据源的投影系
         */
        get projection(): string;
        /**
         * 获取数据源的状态
         */
        get state(): SourceState;
        /**
         * 刷新数据源
         */
        refresh(): void;
        protected _setProjection(projection: ProjectionLike): void;
        /**
         * 设置数据源状态
         * @protected
         * @param state
         */
        protected _setState(state: SourceState): void;
    }
}
declare namespace CZMAP {
    /**
     * 要素数据源事件
     * @enum {string}
     */
    enum VectorSourceEventType {
        /**
         * 添加要素
         */
        ADDFEATURE = "addfeature",
        /**
         * 要素改变
         */
        CHANGEFEATURE = "changefeature",
        /**
         * 移除要素
         */
        REMOVEFEATURE = "removefeature",
        /**
         * 移除所有要素
         */
        CLEAR = "clear"
    }
    /**
     * 矢量数据源事件，包含触发该事件的“要素”
     */
    class VectorSourceEvent extends Event {
        /** 触发事件的要素 */
        feature: Feature;
        /**
         * @param type Type.
         * @param opt_feature Feature.
         */
        constructor(type: string | VectorSourceEventType, opt_feature?: Feature);
    }
    /** 矢量数据源参数 */
    interface VectorSourceOption {
        url?: string;
        format?: FeatureFormat;
        loader?: FeatureLoader;
        features?: Feature[];
        projection?: ProjectionLike;
        /** 坐标偏移 */
        coordinateOffset?: Point;
    }
    /**
     * 矢量数据源
     */
    class VectorSource extends Source {
        /**
         * 要素加载器
         */
        private _loader;
        /**
         * 格式化器
         */
        private _format;
        /**
         * 数据源
         */
        private _url;
        /**
         * 包围盒
         */
        private _box;
        /**
         * 要素列表
         */
        private _keysmap;
        private _fidsmap;
        /**
         *
         */
        private _hasload;
        /**
         * @param opt_options Vector source options.
         */
        constructor(opt_options?: VectorSourceOption);
        /**
         * 添加一个要素到数据源中
         * @param feature 要素
         */
        addFeature(feature: Feature): void;
        /**
         * 添加要素，不触发`change`事件
         * @param feature 要素
         */
        protected addFeatureInternal(feature: Feature): void;
        /**
         * 初始化`change`事件
         * @param fi 要素
         */
        private _setupChangeEvents;
        /**
         * 批量添加要素到数据源中
         * @param features 要素列表
         */
        addFeatures(features: Feature[]): void;
        /**
         * 移除所有要素
         * @param opt_fast 是否快速移除
         */
        clear(opt_fast?: boolean): void;
        /**
         * 遍历所有要素，该遍历不能中断
         * @param callback 回调函数
         * @param opt_this 回调函数的this
         */
        forEachFeature(callback: (feature: Feature) => void, opt_this?: object): void;
        /**
         * 遍历指定范围内的要素
         *
         * @param extent 范围.
         * @param callback 回调函数
         * @param opt_this 回调函数的this
         * @alpha
         */
        forEachFeatureInExtent(extent: Extent, callback: (feature: Feature) => void, opt_this?: object): void;
        /**
         * 遍历指定范围内精确相交的要素
         * @param extent 范围.
         * @param callback 回调函数
         * @param opt_this 回调函数的this
         * @alpha
         */
        forEachFeatureIntersectingExtent(extent: Extent, callback: (feature: Feature) => void, opt_this?: object): void;
        /**
         * 获取所有要素
         * @return Features.
         */
        getFeatures(opt_features?: Feature[]): Feature[];
        /**
         * 获取指定范围所有要素
         * @param  extent 范围.
         * @return 范围内的要素.
         * @alpha
         */
        getFeaturesInExtent(extent: Extent): any;
        /**
         * 获取数据源的几何范围
         * @param opt_extent 可选的返回对象
         * @return 几何范围
         */
        getExtent(opt_extent?: Extent): Extent;
        /**
         * 获取数据源的三维几何范围
         * @param opt_box 可选的返回对象
         * @return 三维几何范围
         */
        getBox(opt_box?: BoundingBox): BoundingBox;
        /** 更新数据包围盒 */
        protected _updateBox(): void;
        /**
         * 通过ID获取要素
         *
         * @param id 要素的ID
         * @return 找到的要素或者undefined.
         * @api
         */
        getFeatureById(id: number | string): Feature | undefined;
        /**
         * 获取数据源的格式
         * @return 数据源的格式
         */
        getFormat(): FeatureFormat;
        /**
         * 获取数据源的URL
         * @return 数据源的URL
         * @api
         */
        getUrl(): string;
        /**
         * 要素改变事件
         */
        private _handleFeatureChange;
        /**
         * 返回是否包含指定的要素
         * @param feature 要素.
         * @return 是否包含要素
         */
        hasFeature(feature: Feature): boolean;
        /**
         * @return 数据源是否为空
         */
        isEmpty(): boolean;
        /**
         * 加载要素
         * @param extent Extent.
         * @param resolution Resolution.
         * @param projection Projection.
         */
        loadFeatures(extent: Extent, resolution: number, projection: ProjectionLike): void;
        /**
         * 移除指定要素
         * @param feature 待移除的要素
         */
        removeFeature(feature: Feature): void;
        /**
         * 移除指定要素，不触发`change`事件
         * @param feature 待移除的要素
         */
        protected removeFeatureInternal(feature: Feature): void;
    }
}
declare namespace CZMAP {
    class Math2D {
        /**
         * 计算三角形abc的面积
         * @param a
         * @param b
         * @param c
         */
        static TriArea2D(a: Point, b: Point, c: Point): number;
        /**
         * 计算多边形的面积
         */
        static PolygonArea(pts: Point[]): number;
        /**
         * 点乘(点积)
         */
        static Dot2D(p1: Point, p2: Point): number;
        /**
         * 检测点p是不在三角形abc内部
         */
        static IsInTri(a: Point, b: Point, c: Point, p: Point): boolean;
        /**
         * 求线段ab和cd的交点e，segment为true表示线段，false表示直线
         */
        static Intersect2D(a: Point, b: Point, c: Point, d: Point, e?: Point, segment?: boolean): boolean;
        /**
         * 点是否在简单多边形内部
         * @param pts
         * @param pt
         */
        static IsInSimplePolygon2D(pts: Point[], pt: Point): boolean;
        /**
         * 点是否在多边形内部
         * @param pts
         * @param pt
         */
        static IsInPolygon2D(pts: Point[][], pt: Point): boolean;
        static ProjPointToLine(a: Point, b: Point, p: Point, r?: Point): Point;
    }
}
declare namespace CZMAP {
    class NearestPointInLine {
        private _cellPrecent;
        private _data;
        private _radius;
        private _ids;
        private _box;
        private _width;
        private _height;
        private _cellNumX;
        private _cellNumY;
        private _cellSize;
        private _findRadius;
        constructor(option: {
            url?: string;
            data?: string | object;
            radius?: number;
        });
        private _init;
        private _drawLine;
        private _copyID;
        findNearestPoint(pt: Point): Point;
    }
}
declare namespace CZMAP {
    enum VectorLayerProperty {
        SOURCE = "source",
        STYLE = "style"
    }
    /** 点动画 */
    interface PointAnimation {
        /** 是否启用动画 */
        enable?: boolean;
        /** 动画时长 */
        duration?: number;
        /** 最大动画距离 */
        maxDistance?: number;
        /** 显示动画拖尾 */
        showTail?: boolean;
        /** 拖尾宽度 */
        tailWidth?: number;
        /** 拖尾样式 */
        tailStyle?: StrokeDetail;
        /** 最大拖尾时长 */
        maxTailSeconds?: number;
        /** 最大拖尾长度 */
        maxTailLength?: number;
    }
    interface VectorLayerOptions extends FolderOptions {
        source: VectorSource;
        style: FeatureStyleLike;
        /** 是否启用聚合 */
        enableCluster?: boolean;
        /** 点更新动画 */
        pointAnimation?: PointAnimation;
        /**
         * @deprecated
         * @see {@link PointAnimation.enable}
         */
        enableAnimation?: boolean;
        /**
         * @deprecated
         * @see {@link PointAnimation.duration}
         */
        animationTimes?: number;
        /** @deprecated @see {@link PointAnimation.maxDistance} */
        maxAnimationDistance?: number;
        /** 多级聚合 */
        multiLevelCluster?: ClusterOption;
        /**
         * 参考线
         */
        referenceLine?: NearestPointInLine;
    }
    /**
     * 要素图层
     */
    class VectorLayer extends Folder {
        /**
         * 要素和图层的映射
         */
        private _loaded;
        /**
         * 是否启用聚合
         */
        private _enableCluster;
        private _pointAnimation;
        /** 聚合对象 */
        private _multiLevelCluster;
        private _refLine;
        /**
         * @param parent
         * @param options
         */
        constructor(parent: Folder, options: VectorLayerOptions);
        private _processDeprecated;
        /**
         * 获取图层类型名称
         */
        get type(): string;
        /**
         * 返回图层包围盒
         * @return
         */
        get boundBox(): BoundingBox;
        get source(): VectorSource;
        set source(src: VectorSource);
        get style(): FeatureStyleLike;
        set style(style: FeatureStyleLike);
        /** 是否启用聚合 */
        get enableCluster(): boolean;
        /** 获取点动画定义 */
        get pointAnimation(): PointAnimation;
        /** 多级聚合管理器 */
        get multiLevelCluster(): MultiLevelCluster;
        /** 获取参考线 */
        get refLine(): NearestPointInLine;
        /**
         * 获取图层的投影
         */
        get projection(): string;
        showLabel(enable: boolean): void;
        showIcon(enable: boolean): void;
        /**
         * 创建要素
         */
        createFeatureLayer(featruelike: Feature | FeatureLike, options?: {
            name?: string;
            style?: FeatureStyle;
        }): FeatureLayer;
        /**
         * 移除要素图层
         * @param feature
         */
        removeFeatureLayer(feature: Feature): void;
        protected _createInner(): void;
        /** 飞到模型 */
        flyTo(option?: FlyToOption): void;
        private static events;
        private _handleSourceChange;
        private _handleStyleChange;
        private _handleSourceEvents;
        private _getStyle;
        private _handleVectorVisibleChanged;
    }
}
declare namespace CZMAP {
    interface VolumeGridOption extends Omit<GridOption, 'name' | 'min' | 'max' | 'dataBox' | 'displayBox'> {
    }
    interface VolumeDataOptions {
        /** 体数据 */
        volumeData?: string;
        /** 色表 */
        volumeColorMap?: string;
        /** 覆盖层 */
        volumeOverlay?: string;
        /** 空间范围 */
        volumeMin?: [number, number, number];
        volumeMax?: [number, number, number];
        /** 缩放比例 */
        volumeScale?: [number, number, number];
        /** 偏移 */
        volumeOffset?: [number, number, number];
        /** 体数据切片 */
        volumeSliceNum?: [number, number];
        /** 体数据模式 */
        volumeMode?: ZMapVolume.VolumeMode;
        /** 射线 */
        volumeRayDir?: ZMapVolume.VolumeRayDir;
        /** 过滤器 */
        volumeFilterParam?: ZMapVolume.FilterOption;
        /** 反转 */
        volumeTurn?: [number, number, number];
        volumeElement?: any;
        /** 数据范围 */
        volumeDataValueRange?: [number, number];
        /** 采样数 */
        volumeSampleNum?: number;
    }
    interface VolumeLayerOptions extends LayerOptions {
        /** 体数据 */
        volumeOptions?: VolumeDataOptions;
        /** 网格 */
        gridOptions?: VolumeGridOption;
    }
    /**
     * 体数据图层
     */
    abstract class VolumeLayer extends Layer {
        protected _option: VolumeLayerOptions;
        protected _box: BoundingBox;
        protected _vbox: BoundingBox;
        constructor(parent: Folder, options?: VolumeLayerOptions);
        /**
         * 获取图层类型名称
         * @override
         */
        get type(): string;
        /**
         * 返回图层包围盒
         * @return
         */
        get boundBox(): BoundingBox;
        /** 设置显示模式 */
        abstract setMode(mode: 'slice' | 'volume'): void;
        /** 设置切面位置 */
        abstract setSlices(slices: {
            x?: number;
            y?: number;
            z?: number;
        }): void;
        /** 设置色表图片 */
        abstract setColorMap(colorMap: string): void;
        /** 显示或者隐藏坐标网格 */
        abstract showGrids(show: boolean): void;
        abstract isShowGrids(): boolean;
        /** @override */
        flyTo(option?: FlyToOption): void;
        /**
         *
         * @param option
         */
        private _zoomOrFlyto;
    }
}
declare namespace CZMAP {
    /** @internal */
    class LayerManager2D extends LayerManager {
    }
}
declare namespace CZMAP {
    /** @internal */
    class Point2D {
        /**
         *
         * @param parent
         */
        constructor(parent: any);
        set visible(v: any);
        _destroyInner(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class TileLayer2D extends TileLayer {
        /**
         *
         */
        constructor(parent: Folder, options?: any);
        get boundBox(): BoundingBox;
        protected _onVisible(): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    abstract class Feature3D extends FeatureRender {
        /** 快捷方式到 map.view3d */
        get view3d(): MapView3D;
    }
}
declare namespace CZMAP {
    /** @internal */
    class FeatureLayer3D extends FeatureLayer {
        private _render;
        protected _createInner(): void;
        protected _destroyInner(): void;
        get render(): FeatureRender;
    }
}
declare namespace CZMAP {
    function creatImageyLayer(): void;
}
declare namespace CZMAP {
    /** @internal */
    class LayerManager3D extends LayerManager {
        constructor(map: ComMap);
        protected _clearTerrain(): void;
        protected _applyTerrain(terrain: TerrainLayer): void;
    }
}
declare namespace CZMAP {
    /**
     * 三维点对象
     * @internal
     */
    class Point3D extends Feature3D {
        private _box;
        private _entity;
        private _temp_hpr;
        private _temp_ori;
        private _temp_pos1;
        private _temp_pos2;
        private _temp_date0;
        private _temp_date1;
        private _temp_date2;
        private _clusterItem;
        private _pathTail;
        /**
         */
        constructor(parent: FeatureLayer);
        get box(): BoundingBox;
        get entity(): Cesium.Entity;
        protected _onVisibleChangle(): void;
        protected _init(): void;
        protected _release(): void;
        protected _handleGeometryChange(): void;
        protected _handleStyleChange(event: ObjectEvent): void;
        private _getLabel;
        private _getIcon;
        private _getModel;
        private _applyBillStyle;
        /**
         */
        protected _handleLabelStyle(event: ObjectEvent): void;
        protected _handleIconStyle(event: ObjectEvent): void;
        protected _handleModelStyle(event: ObjectEvent): void;
        static fullrange: Cesium.TimeInterval;
        private _updatePositionAndPose;
    }
}
declare namespace CZMAP {
    /** @internal */
    class Polyline3D extends Feature3D {
        private _items;
        private _box;
        constructor(parent: FeatureLayer);
        get box(): BoundingBox;
        protected _init(): void;
        private _clearWall;
        private _clearPolyline;
        protected _release(): void;
        protected _onVisibleChangle(): void;
        private _updateWalls;
        private _createWalls;
        private _createPoylines;
        private _updateGeometryImpl;
        private _updateHandle;
        private _updateGeometry;
        protected _handleGeometryChange(event: ObjectEvent): void;
        protected _handleStyleChange(event: ObjectEvent): void;
        protected _handleStrokeStyle(event: ObjectEvent): void;
        protected _handleWallStyle(event: ObjectEvent): void;
        static getStrokeMaterial(detail: StrokeDetail): Cesium.Material;
        static getStrokeMaterialProperty(detail: StrokeDetail): Cesium.Color | Cesium.PolylineGlowMaterialProperty | Cesium.PolylineDashMaterialProperty | Cesium.PolylineArrowMaterialProperty | Cesium.PolylineOutlineMaterialProperty;
    }
}
declare namespace CZMAP {
    /** @internal */
    class StaticImageLayer3D extends StaticImageLayer {
        private _ins;
        private _bb;
        /**
         *
         */
        constructor(parent: Folder, options: StaticImageLayerOptions);
        get view3d(): MapView3D;
        get layer(): Cegore.ImageLayer;
        get boundBox(): BoundingBox;
        protected _onVisible(): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
        protected _handleColorOpacity(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class TDTilesLayer3D extends TDTilesLayer {
        private _view3d;
        private _3dtiles;
        private _option;
        constructor(parent: Folder, options?: TDTilesLayerOptions);
        /** @override */
        protected _createInner(): void;
        protected _destroyInner(): void;
        /**
         * 获取图层类型名称
         * @override
         */
        get type(): string;
        /**
         * 返回图层包围盒
         * @return
         */
        get boundBox(): BoundingBox;
        get maxSSE(): number;
        set maxSSE(maxSSE: number);
        /** @override */
        flyTo(option?: FlyToOption): void;
        get tdtiles(): Cesium.Cesium3DTileset;
        /**
         * 设置显示和隐藏
         * @param {*} v
         * @override
         */
        protected _onVisible(v: boolean): void;
        /**
         *
         * @param option
         */
        private _zoomOrFlyto;
        protected _onTransformChange(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class TileLayer3D extends TileLayer {
        private _ins;
        /**
         *
         */
        constructor(parent: Folder, options: TileLayerOptions);
        get view3d(): MapView3D;
        get layer(): Cegore.ImageLayer;
        get boundBox(): BoundingBox;
        protected _onVisible(): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
        protected _handleColorOpacity(): void;
    }
}
declare namespace CZMAP {
    /**
     * 体数据图层
     */
    class VolumeLayer3D extends VolumeLayer {
        private _view3d;
        private _volumeRender;
        private _volumeSliceTool;
        private _volumeGridTool;
        private _volumeRectTool;
        constructor(parent: Folder, options?: VolumeLayerOptions);
        /** @override */
        protected _createInner(): void;
        protected _destroyInner(): void;
        /**
         * 获取体数据对象
         */
        get volumeRender(): ZMapVolume.VolumeRender;
        get volumeSlice(): ZMapVolume.SliceTool;
        get volumeGrid(): ZMapVolume.GridLine;
        get volumeRect(): ZMapVolume.RectPlane;
        /**
         * 设置显示和隐藏
         * @param {*} v
         * @override
         */
        protected _onVisible(v: boolean): void;
        setMode(mode: 'volume' | 'slice'): void;
        setColorMap(colorMap: string): void;
        setSlices(slices: {
            x: number;
            y: number;
            z: number;
        }): void;
        showGrids(show: boolean): void;
        isShowGrids(): boolean;
    }
}
declare namespace CZMAP {
    /**
     * 可以移动的图层
     * @internal
     */
    abstract class MoveableLayerUE<Type extends keyof RtcLayerDefineMap, MovableDefineType extends MoveableRtcLayerDefine<Type> = RtcDefineTraits<Type>> extends MoveableLayer {
        protected _uvlayer: UELayerProxy<Type, MovableDefineType>;
        constructor(parent: Folder, options: MoveableLayerOptions);
        /**
         * 获取包围盒
         */
        get boundBox(): BoundingBox;
        flyTo(option?: FlyToOption): void;
        move(actions: MoveAction | MoveAction[]): void;
        setOpacity(opacity: number, color?: string): void;
        protected _onVisible(v: boolean): void;
        protected _destroyInner(): void;
        protected _onTransformChange(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    interface ActorLayerOption extends MoveableLayerOptions {
        path: string;
    }
    /** @internal */
    class DynActorLayerUE extends MoveableLayerUE<'dynActor'> {
        private _option;
        constructor(parent: Folder, option: ActorLayerOption);
        protected _createInner(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class DecalLayerUE extends DecalLayer {
        private _option;
        private _uvlayer;
        private _decalType;
        private _decalSize;
        private _decalWater;
        private _image;
        private _imageReady;
        private _size;
        private _box;
        constructor(parent: Folder, option: DecalLayerOption);
        private _fetchPolygon;
        private _buildByPolygon;
        private _build;
        get boundBox(): BoundingBox;
        protected _onVisible(v: boolean): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
        protected _onTransformChange(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class FeatureLayerUE extends FeatureLayer {
        private _render;
        protected _createInner(): void;
        protected _destroyInner(): void;
        get render(): FeatureRender;
        /** 飞到模型 */
        flyTo(option?: FlyToOption): void;
    }
}
declare namespace CZMAP {
    /**
     * 基于UnrealView的要素对象
     * @internal
     */
    abstract class FeatureUE<Type extends string, TLayerDefine extends RtcLayerDefine<Type> = RtcDefineTraits<Type>> extends FeatureRender {
        protected _uvlayer: UELayerProxy<Type, TLayerDefine>;
        constructor(parent: FeatureLayer, type: Type);
        /** 快捷方式到 map.view3d */
        get viewue(): MapViewUE;
        protected _onVisibleChangle(): void;
        protected _release(): void;
        private _cachedUpdate;
        private _cachedHandle;
        /**
         * 请求更新图层
         * @param style 图层样式
         */
        protected _requestUpdate(style: Partial<TLayerDefine>): void;
        protected _preUpdateLayer(cachedUpdate: Partial<TLayerDefine>): void;
        /** 飞到模型 */
        flyTo(option?: FlyToOption): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class FlowsLayerUE extends FlowsLayer {
        private _option;
        private _uvlayer;
        private _box;
        private _flows;
        constructor(parent: Folder, option: FlowsLayerOption);
        get boundBox(): BoundingBox;
        setFlowsParam(param: FlowsParam): void;
        protected _onVisible(v: boolean): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
        protected _onTransformChange(): void;
        protected _setFlows(flows: FlowsParam): void;
    }
}
declare namespace CZMAP {
    class FoliageLayerUE extends FoliageLayer {
        private _uelayer;
        constructor(parent: Folder, option: FoliageLayerOption);
        protected _addItems(items: FoliageItemDetail[]): void;
        protected _updateItems(items: FoliageItemDetail[]): void;
        protected _removeItems(items: FoliageItemID[]): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
        protected _onVisible(v: boolean): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class LayerManagerUE extends LayerManager {
        constructor(map: ComMap);
        get viewue(): MapViewUE;
        get uview(): UnrealViewer;
        get uvapi(): UnrealViewerAPI;
        protected _clearTerrain(): void;
        protected _applyTerrain(terrain: TerrainLayer): void;
    }
}
declare namespace CZMAP {
}
declare namespace CZMAP {
    class LabelRender {
        private _canvas;
        private _ctx;
        static instance(): LabelRender;
        static render2Image(label: LabelStyleOption): {
            src: string;
            width: number;
            height: number;
        };
        constructor();
        get canvas(): HTMLCanvasElement;
        render(label: LabelStyleOption): this;
        toDataURL(): string;
        toImage(): {
            src: string;
            width: number;
            height: number;
        };
    }
}
declare namespace CZMAP {
    /** @internal */
    class PointUE extends FeatureUE<'point'> {
        private _box;
        /**
         */
        constructor(parent: FeatureLayer);
        get box(): BoundingBox;
        get position(): Point;
        /** 飞到模型 */
        flyTo(option?: FlyToOption): void;
        protected _init(): void;
        protected _handleGeometryChange(): void;
        protected _handleStyleChange(event: ObjectEvent): void;
        /**
         */
        protected _handleLabelStyle(event: ObjectEvent): void;
        protected _handleIconStyle(event: ObjectEvent): void;
        protected _handleModelStyle(event: ObjectEvent): void;
        private _updatePositionAndPose;
        protected _preUpdateLayer(cachedUpdate: Partial<PointRtcLayerDefine>): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class PolylineUE extends FeatureUE<'polyline'> {
        private _items;
        private _box;
        constructor(parent: FeatureLayer);
        get box(): BoundingBox;
        setAnimationPos(pos: number): void;
        startAnimation(seconds: number): void;
        protected _init(): void;
        private _updateGeometryImpl;
        private _updateHandle;
        private _updateGeometry;
        protected _handleGeometryChange(event: ObjectEvent): void;
        protected _handleStyleChange(event: ObjectEvent): void;
        protected _handleStrokeStyle(event: ObjectEvent): void;
        protected _handleWallStyle(event: ObjectEvent): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    interface TDTilesLayerUEOptions extends TDTilesLayerOptions {
        material?: any;
    }
    /** @internal */
    export class TDTilesLayerUE extends TDTilesLayer {
        private _option;
        private _uvlayer;
        constructor(parent: Folder, option: TDTilesLayerUEOptions);
        get ready(): Promise<void>;
        get boundBox(): BoundingBox;
        get uvapi(): UnrealViewerAPI;
        get maxSSE(): number;
        set maxSSE(maxSSE: number);
        flyTo(option?: FlyToOption): void;
        setMaterial(material: any): void;
        protected _onVisible(v: boolean): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
        protected _onTransformChange(): void;
    }
    export {};
}
declare namespace CZMAP {
    /** @internal */
    class TileLayerUE extends TileLayer {
        private _options;
        private _uvlayer;
        constructor(parent: Folder, options: TileLayerOptions);
        get ready(): Promise<void>;
        get boundBox(): BoundingBox;
        protected _onVisible(v: boolean): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class UnrealViewerHelp {
        private _view;
        constructor(view: MapView);
        get uview(): UnrealViewer;
        get uvapi(): UnrealViewerAPI;
    }
}
declare namespace CZMAP {
    type RtcDefineTraits<T extends string> = T extends keyof RtcLayerDefineMap ? RtcLayerDefineMap[T] : RtcLayerDefine<T>;
    /**
     * UE图层包装器
     * @internal
     */
    class UELayerProxy<Type extends string, DefineType extends RtcLayerDefine<Type> = RtcDefineTraits<Type>> extends UnrealViewerHelp {
        private _id;
        private _ready;
        private _layer?;
        private _bbox;
        private _created;
        private _type;
        private _resolve;
        constructor(view: MapView, type: Type, layer?: Layer);
        get ready(): Promise<void>;
        /** 获取UE图层ID */
        get id(): number;
        /** 获取图层对象 */
        get layer(): Layer;
        get box(): BoundingBox;
        /** 根据ID获取图层 */
        static getWrapperByID(id: number): UELayerProxy<any, any>;
        static getLayerByID(id: number): Layer;
        /** 是否有效 */
        isValid(): boolean;
        /** 创建图层 */
        createLayer(define: DefineType): Promise<void>;
        /** 飞行到图层 */
        flyTo(option?: FlyToOption): Promise<void>;
        move(actions?: MoveAction[]): Promise<void>;
        /** 设置图层显示或者隐藏 */
        setVisible(visible: boolean): Promise<void>;
        setOpacity(opacity: number, color?: string): Promise<void>;
        /** 切换显示隐藏 */
        switchVisible(): Promise<void>;
        /** 更新图层 */
        updateLayer(option: Partial<DefineType>): Promise<void>;
        executeLayer(param: any): Promise<void>;
        /** 移除图层 */
        removeLayer(): Promise<void>;
        /**
         * @inner
         * @param min 最小值
         * @param max 最大值
         */
        notify_setBoundBox(min: Point, max: Point): void;
        protected _processColorOpacity(): void;
        protected _handleColorOpacity(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class VolumeDataLayerUE extends VolumeLayer {
        private _uvlayer;
        private _grids;
        private _gridVisible;
        constructor(parent: Folder, option: VolumeLayerOptions);
        protected _onVisible(v: boolean): void;
        protected _createInner(): void;
        protected _destroyInner(): void;
        setMode(mode: 'volume' | 'slice'): void;
        setSlices(slices: {
            x: number;
            y: number;
            z: number;
        }): void;
        setColorMap(colorMap: string): void;
        showGrids(show: boolean): void;
        isShowGrids(): boolean;
    }
}
declare namespace CZMAP {
    /** @internal */
    interface WrappedLayerOption extends MoveableLayerOptions {
        wrappedLayer: string;
    }
    /** @internal */
    class WrappedLayerUE extends MoveableLayerUE<'wrapped'> {
        private _option;
        constructor(parent: Folder, option: WrappedLayerOption);
        get wrappedLayer(): string;
        protected _createInner(): void;
    }
}
declare namespace CZMAP {
    /**
     * 解析字符串为对应对象的工具
     */
    class Parse {
        /**
         * 解析Boolean值
         * @param {*} v
         * @return {boolean}
         */
        static parseBoolean(v: string | boolean, def?: boolean): boolean;
        /**
         * 解析数字，如果输入参数不是数字则返回0
         * @param {*} v
         * @return {Number}
         */
        static parseNumber(v: string | number, defVal?: number): number;
        /**
         * 解析整数，如果输入参数不是数字则返回0
         * @param {*} v
         */
        static parseInteger(v: string | number, defVal?: number): number;
        /**
         * 解析字符串为数值数组
         * @param {string} v 字符串
         * @param {string} s 分隔符
         * @param {number} num 数字的最小长度
         */
        static parseArray(v: string | any[], s: string, num?: number): number[];
        /**
         * 构建指定类型的解析函数
         * @param {*} s 字符串分隔符
         * @param {*} num 数组长度
         * @return 解析函数
         */
        static createParseArray(s: string, num: number): (x: string) => number[];
        /**
         * 解析点位
         * @param p
         * @param def
         * @returns
         */
        static parsePoint(p: string | {} | Point, def?: Point): Point;
    }
}
declare namespace CZMAP {
    /**
     * 三维要素信息
     */
    interface TDFeatureInfo {
        id: number;
        name: string;
        /**
         * 原始坐标系下的包围盒，格式："minx,miny,minz,maxx,maxy,maxz"
         */
        box: string;
        /**
         * 地理坐标系下的包围盒
         */
        cbox: string;
        /**
         * 地理坐标的中心位置，格式："x,y,z"
         */
        center: string;
        /**
         * 是否复杂对象
         */
        complex: boolean;
        /**
         * 子节点
         */
        children?: TDFeatureInfo[];
    }
    /**
     * 三位要素类信息
     */
    interface TDFeatureClsInfo extends TDFeatureInfo {
        /**
         * 偏移信息
         */
        offset: string;
        /**
         * 要素类的位置，地理坐标系
         */
        position: string;
        /**
         * 原始坐标系下的包围盒
         */
        boxd: string;
    }
    /**
     * 合并结果
     */
    interface MergedModel {
        /**
         * 合并的名称
         */
        name: string;
        /**
         * 合并列表
         */
        items: TDFeatureInfo[];
    }
    class ZFclsModel {
        /**
         * 要素树转要素列表
         * @param features
         * @param items
         */
        static tree2map(features: TDFeatureInfo[], items?: Map<number, TDFeatureInfo>): Map<number, TDFeatureInfo>;
        /**
         * 合并子模型
         * @param items
         * @param mergef
         */
        static merge(items: Map<number, TDFeatureInfo>, mergef: MergeSubModel): MergedModel[];
        static filterSimpleModel(fea: TDFeatureInfo, simples: TDFeatureInfo[]): void;
        static parsePosition: typeof Parse.parsePoint;
    }
}
declare namespace CZMAP {
    class Cluster {
        private _clusterPixel;
        get clusterPixel(): number;
        set clusterPixel(pixel: number);
    }
}
declare namespace CZMAP {
    enum MapEventsType {
        /** 鼠标悬停事件 */
        MOUSE_OVER = "mouseover",
        /** 鼠标移出事件 */
        MOUSE_OUT = "mouseout",
        /** 鼠标点击事件 */
        MOUSE_CLICK = "click",
        /** 鼠标右键点击事件 */
        MOUSE_RCLICK = "rclick",
        /** 鼠标双击事件 */
        MOUSE_DBLCLICK = "dblclick"
    }
    /**
     * 地图鼠标事件
     */
    class MapMouseEvent extends Event {
        x: number;
        y: number;
        object?: any;
        ext?: any;
        constructor(type: string, x: number, y: number, object: any, ext?: any);
    }
    type MapMouseEventCallback = (e: MapMouseEvent) => void;
    /**
     * 地图事件
     *
     * @description
     *
     */
    class MapEvents extends BaseObject {
        map: ComMap;
        view: MapView;
        /**
         *
         */
        constructor(view: MapView);
    }
}
declare namespace CZMAP {
    /**
     * 地图模式
     */
    enum MapMode {
        /** 二维模式 */
        Mode2D = 1,
        /** 三维（WebGL）模式 */
        Mode3D = 2,
        /** 云渲染模式 */
        ModeCloud = 3
    }
}
declare namespace CZMAP {
    /**
     * 视图信息
     */
    interface ViewInfo {
        position: Point;
        heading?: number;
        pitch?: number;
        roll?: number;
    }
    interface ZoomToOption {
        /** 方位角 */
        heading?: number;
        /** 俯仰角 */
        pitch?: number;
        /** 距离 */
        distance?: number;
        /** 距离缩放 */
        distanceScale?: number;
    }
    interface FlyToOption extends ZoomToOption {
        /** 飞行时间，单位：秒 */
        duration?: number;
    }
    interface RotateAtOption {
        /** 飞行参数 */
        flyOption: FlyOption;
        /** 旋转速度，度/秒 */
        speed: number;
        /** 旋转时长 */
        duration?: number;
    }
    interface PickInfo {
        /** 鼠标像素坐标 */
        pixel?: [number, number];
        /** 拾取到的三维坐标 */
        position?: Point;
        /** 拾取到的图层对象 */
        layer?: Layer;
    }
    /** 飞行参数 */
    interface FlyOption extends FlyToOption {
        /** 目标点点位坐标 */
        position: Point | Cegore.Position;
    }
    interface DateTime {
        year: number;
        month: number;
        day: number;
        hour: number;
        minite: number;
        second: number;
    }
    function initDateTime(datetime: Partial<DateTime>): DateTime;
    enum WeatherType {
        Sunny = "Sunny",
        Cloudy = "Cloudy",
        Partly_Cloudy = "Partly_Cloudy",
        Foggy = "Foggy",
        Overcast = "Overcast",
        Rain = "Rain",
        Rain_Light = "Rain_Light",
        Rain_Thunderstorm = "Rain_Thunderstorm",
        Sand_Dust_Calm = "Sand_Dust_Calm",
        Sand_Dust_Storm = "Sand_Dust_Storm",
        Snow = "Snow",
        Snow_Blizzard = "Snow_Blizzard",
        Snow_Light = "Snow_Light"
    }
    interface SceneLight {
        /** 太阳光颜色 */
        sunColor: string;
        /** 太阳光强度 */
        sunIntensity: number;
        /** 天光（环境光） */
        skyIntensity: number;
    }
    interface WeaterDetail {
        /** 云量 0 - 10 */
        cloud?: number;
        /** 雾 0 - 10 */
        fog?: number;
        /** 风 0 - 10 */
        wind?: number;
        /** 雨 0 - 10 */
        rain?: number;
        /** 雪 0 - 10 */
        snow?: number;
        /** 闪电 [0, 10] */
        thunder?: number;
        /** 沙尘 [0, 10] */
        dust?: number;
        /** 地面积水 [0, 1] */
        land_rain?: number;
        /** 地面积学 [0, 1] */
        land_snow?: number;
        /** 地面尘土 [0, 1] */
        land_dust?: number;
    }
    /** 天气选项 */
    interface WeatherOption {
        /** 天气类型 */
        weatherType: WeatherType | WeaterDetail;
        /** 天气切换时间（秒） */
        duration?: number;
    }
    /** 场景设置 */
    interface CloudOption {
        /** 云的方向 */
        direction?: number;
        /** 速度倍速 */
        speedScale?: number;
        /** 云的高度 */
        height?: number;
        /** 云的缩放比 */
        scale?: number;
    }
    abstract class MapView extends BaseObject {
        /**
         */
        protected _dom: string;
        /**
         */
        protected _map: ComMap;
        /**
         *
         */
        constructor(map: ComMap, dom: string);
        /**
         * 获取地图对象
         */
        get map(): ComMap;
        get dom(): string;
        /** 获取图层管理器 */
        abstract get layerManager(): LayerManager;
        protected _disposeInternal(): void;
        /**
         */
        get events(): MapEvents;
        /**  */
        get gridTool(): GridTool<MapView>;
        /**  */
        get drawTool(): DrawTool<MapView>;
        /**
         * 测量功能
         */
        get measureTool(): MeasureTool<MapView>;
        /**
         * 测量距离
         */
        measureDistance(option?: MeasureDistOption): void;
        /**
         * 测量面积
         * @deprecated 拼写错误
         */
        measureArae(option?: MeasureAreaOption): void;
        /**
         * 测量面积
         */
        measureArea(option?: MeasureAreaOption): void;
        /** 测量角度 */
        measureAngle(option?: MeasureAngleOption): void;
        /** 取消测量 */
        measureCancel(): void;
        /**
         * 清除测量
         */
        measureClear(): void;
        /** 启用/禁用地图交互 */
        abstract eanbleInput(enable: boolean): void;
        /**
         * 拾取指定坐标的模型
         * @param x 屏幕坐标X
         * @param y 屏幕坐标Y
         */
        abstract pick(x: number, y: number): PickInfo;
        /**
         * 缩放到指定地点
         */
        zoomTo(extent: Extent, options?: ZoomToOption): void;
        /**
         * 飞行到指定地点
         */
        flyTo(extent: Extent, options?: FlyToOption): void;
        /** 飞行到包围球 */
        flyToSphere(sphere: Cesium.BoundingSphere, option?: FlyToOption): void;
        /** 飞行到包围矩形 */
        flyToBox(box: BoundingBox, option?: FlyToOption): void;
        /**
         * 查看目标点
         * @param target 目标点
         */
        lookAt(target: Point): void;
        private _rotateHandle;
        /**
         * 飞行到目标点并旋转
         * @param option 选项
         */
        rotateAt(option: RotateAtOption): void;
        /** 取消旋转 */
        cancelRotate(): void;
        /** 飞行到目标点 */
        abstract fly(option: FlyOption): void;
        /** 立即完成飞行 */
        abstract completeFly(): void;
        /** 取消飞行 */
        abstract cancelFly(): void;
        /**
         * 锁定指定图层
         */
        abstract lockTo(layer: Layer): void;
        abstract unlockTo(): void;
        /**
         * 获取视图信息
         */
        abstract getViewInfo(): ViewInfo;
        /**
         * 设置视图信息
         * @param info
         */
        abstract setViewInfo(info: ViewInfo, options?: {
            duration?: number;
        }): void;
        /**
         * 获取当前范围
         */
        abstract getExtend(): Extent;
        /**
         */
        abstract getEvents(): MapEvents;
        /** 设置场景光照 */
        abstract setSceneLight(scene: Partial<SceneLight>): void;
        /** 设置云的参数 */
        abstract setCloud(scene: CloudOption): void;
        /** 设置时间 */
        abstract setDateTime(datetime: Partial<DateTime>): void;
        /** 设置天气 */
        abstract setWeather(weather: WeatherOption): void;
        /** 设置季节，值域：0-1 */
        abstract setSeason(season: number): void;
        /** 设置植被风速 */
        setFoliageWind(wind: number): void;
        /** */
        abstract getGridTool(): GridTool<MapView>;
        /**
         * 绘图工具
         */
        abstract getDrawTool(): DrawTool<MapView>;
        /**
         * 测量功能
         */
        abstract getMeasureTool(): MeasureTool<MapView>;
        /**
         * 创建路径漫游工具
         */
        abstract createPathRoam(): PathRoam<MapView>;
        /**
         * 创建轴向平面
         */
        abstract createClipPlane(option: ClipPlaneOption): ClipPlaneBase<MapView>;
        /**
         * 创建巷道效果工具
         */
        abstract createTunnelEffct(): TunnelEffct<MapView>;
        /**
         * 创建巷道透明工具
         */
        abstract createTunnelTransparent(): TunnelTransparent<MapView>;
        /**
         * 创建地形开挖
         */
        abstract createTerrainClips(options: ClipTerrainOption): ClipTerrain;
        /**
         * 清除地形开挖
         */
        abstract clearTerrainClips(): void;
        /** 创建信息窗口 */
        abstract createInfoWindow(option: InfoWindowOption): InfoWindow<MapView>;
        /** 移除信息窗口 */
        removeInfoWindow(infoWindow: InfoWindow<MapView>): boolean;
    }
}
declare namespace CZMAP {
    /** @internal */
    class MapEvent2D extends MapEvents {
        constructor(map: any);
        set enableTip(enable: any);
    }
}
declare namespace CZMAP {
    /** @internal */
    class MapView2D extends MapView {
        private _events;
        private _layerManager;
        getEvents(): MapEvents;
        getGridTool(): GridTool<MapView2D>;
        getDrawTool(): DrawTool<MapView2D>;
        getMeasureTool(): MeasureTool<MapView2D>;
        createTunnelEffct(): TunnelEffct<MapView2D>;
        createTunnelTransparent(): TunnelTransparent<MapView2D>;
        createTerrainClips(options: any): ClipTerrain;
        clearTerrainClips(): void;
        constructor(map: ComMap, dom: string);
        get layerManager(): LayerManager2D;
        get cluster(): Cluster;
        /**
         * 获取事件管理类
         */
        get envents(): MapEvent2D;
        /** 启用/禁用地图交互 */
        eanbleInput(enable: boolean): void;
        /** 设置场景光照 */
        setSceneLight(scene: Partial<SceneLight>): void;
        /** 设置时间 */
        setDateTime(datetime: Partial<DateTime>): void;
        /** 设置天气 */
        setWeather(weather: WeatherOption): void;
        /** 设置季节 */
        setSeason(weather: number): void;
        setCloud(scene: CloudOption): void;
        /**
         * 拾取指定坐标的模型
         * @param x 屏幕坐标X
         * @param y 屏幕坐标Y
         */
        pick(x: number, y: number): PickInfo;
        fly(): void;
        completeFly(): void;
        cancelFly(): void;
        lockTo(layer: Layer): void;
        unlockTo(): void;
        /**
         * 获取视图信息
         */
        getViewInfo(): ViewInfo;
        /**
         * 设置视图信息
         * @param info
         */
        setViewInfo(info: ViewInfo): void;
        getExtend(): Extent;
        createPathRoam(): PathRoam<MapView2D>;
        createClipPlane(option: ClipPlaneOption): ClipPlaneBase<MapView2D>;
        /** 创建信息窗口 */
        createInfoWindow(option: InfoWindowOption): InfoWindow<MapView2D>;
        /**
         * ZMap2D.Map 对象
         */
        get zmap2d(): any;
        /**
         * OpenLayers Map 对象
         */
        get olmap(): any;
        /**
         * OpenLayers View 对象
         */
        get olview(): any;
    }
}
declare namespace CZMAP {
    interface ClipTerrainOption {
        points?: Point[];
        extent?: Extent;
        depth: number;
        inner?: boolean;
        border?: {
            width?: number;
            color?: string;
        };
        floor?: {
            color?: string;
            image?: string;
        };
        wall?: {
            color?: string;
            image?: string;
        };
        useServerCut?: boolean;
        useServerDEM?: boolean;
    }
    /**
     * 地形开挖
     * @internal
     */
    class ClipTerrain extends BaseObject {
        private map;
        /**
         * 三维视图
         */
        private view3d;
        private _wall;
        private _floor;
        private _clips;
        /**
         * 当前区域的包围球
         */
        private _sphere;
        private _lonlats;
        private _points;
        private _depth;
        private _enable;
        private _enableWall;
        private _enableFloor;
        private _floor_color;
        private _floor_image;
        private _border_width;
        private _border_color;
        private _wall_color;
        private _wall_image;
        private _useServerCut;
        private _useServerDEM;
        private _wallListener;
        /**
         *
         */
        constructor(map: ComMap);
        /**
         *
         * @param {Object} options
         * @param {Array<>} options.points 地形开挖点数组
         * @param {Number} options.depth 开挖深度
         * @param {Object} options.border 边界
         * @param {Number} options.border.width 边界宽度
         * @param {String} options.border.color 边界颜色
         * @param {Object} options.floor 地板贴图
         * @param {String} options.floor.color 地板颜色
         * @param {String} options.floor.image 地板贴图
         * @param {String} options.wall 墙壁贴图
         * @param {String} options.wall.color 墙壁颜色
         * @param {String} options.wall.image 墙壁贴图
         * @param options.useServerCut=false  使用服务端开挖
         * @param options.useServerDEM=false  使用服务端高程
         */
        create(options: ClipTerrainOption): void;
        close(): void;
        set enabled(v: boolean);
        get enabled(): boolean;
        set enabledWall(v: boolean);
        get enabledWall(): boolean;
        set enabledFloor(v: boolean);
        get enabledFloor(): boolean;
        /**
         * 创建地形开挖
         */
        private _createClips;
        /**
         * 创建地形开挖的侧面（墙壁）
         */
        private _createWall;
        private _updateWall;
        /**
         * 创建地形开挖地面（地板）
         */
        private _createFloor;
        /**
         *
         * @param {Array<>} pts
         */
        private _preperPoints;
    }
}
declare namespace CZMAP {
    class MapMouseEvent3D extends MapMouseEvent {
        pickInfo: PickInfo3D;
        constructor(type: string, x: number, y: number, object: any, ext?: any);
    }
    /**
     * 三维地图事件
     * @internal
     */
    class MapEvent3D extends MapEvents {
        view3d: MapView3D;
        private _handler;
        private _timer;
        private _last;
        constructor(view: MapView3D);
        private _onMouseMoved;
        private _onClickEvent;
        private _onLeftClick;
        private _onRightClick;
        private _onDoubleClick;
        private _fire;
        protected _disposeInternal(): void;
    }
}
declare namespace CZMAP {
    interface PickInfo3D extends PickInfo {
        pickedObject?: any;
        cartesian?: Cesium.Cartesian3;
    }
    /** @internal */
    class MapView3D extends MapView {
        private _layerManager;
        private _zmap3d;
        private _cegore;
        private _cesium;
        private _czviewer;
        private _measure;
        private _events;
        private _gridTool;
        private _drawTool;
        private _clips;
        private _czsource;
        private _clusterSource;
        private _cluster3D;
        private _polylines;
        private _pathTails;
        /**
         *
         */
        constructor(map: ComMap, dom: string, option: object);
        get layerManager(): LayerManager;
        protected _disposeInternal(): void;
        /** 启用/禁用地图交互 */
        eanbleInput(enable: boolean): void;
        /**
         * 拾取指定坐标的模型
         * @param x 屏幕坐标X
         * @param y 屏幕坐标Y
         */
        pick(x: number, y: number, option?: {
            pickPosition?: boolean;
            pickObject?: boolean;
        }): PickInfo3D;
        /**
         * 飞行到指定地点
         */
        fly(options: FlyOption): void;
        completeFly(): void;
        cancelFly(): void;
        lockTo(layer: Layer): void;
        unlockTo(): void;
        /**
         * 获取视图信息
         */
        getViewInfo(): ViewInfo;
        /**
         * 设置视图信息
         * @param info
         */
        setViewInfo(info: ViewInfo, options?: {
            duration?: number;
        }): void;
        /** @override */
        getExtend(): Extent;
        /** @override */
        getEvents(): MapEvent3D;
        /** 设置场景光照 */
        setSceneLight(scene: Partial<SceneLight>): void;
        /** 设置时间 */
        setDateTime(datetime: Partial<DateTime>): void;
        /** 设置天气 */
        setWeather(weather: WeatherOption): void;
        /** 设置季节 */
        setSeason(weather: number): void;
        setCloud(cloud: CloudOption): void;
        /** @override */
        getGridTool(): GridTool3D;
        /** @override */
        getDrawTool(): DrawTool3D;
        /** @override */
        getMeasureTool(): MeasureTool3D;
        /** @override */
        createPathRoam(): PathRoam3D;
        /** @override */
        createClipPlane(option: ClipPlaneOption): ClipPlaneBase<MapView3D>;
        /** @override */
        createTunnelEffct(): TunnelEffct3D;
        /**
         * 创建巷道透明工具
         * @override
         */
        createTunnelTransparent(): TunnelTransparent3D;
        /**
         * 切割地形
         * @override
         */
        createTerrainClips(options: ClipTerrainOption): ClipTerrain;
        clearTerrainClips(): void;
        /**
         * 计算目标点像素大小
         * @param position 目标点
         * @returns 一个像素的大小（米单位）
         */
        calcPixelSize(position: Cesium.Cartesian3): number;
        /** 创建信息窗口 */
        createInfoWindow(option: InfoWindowOption): InfoWindow<MapView3D>;
        /**
         * ZMap3D.Map 对象
         */
        get zmap3d(): any;
        /**
         * cegore viewer 对象
         */
        get cegore(): Cegore.Viewer;
        /**
         * Cesium 接口
         */
        get cesium(): Cegore.CesiumData;
        /**
         * Cesium Viewer 对象
         */
        get czviewer(): Cesium.Viewer;
        /** 获取场景对象 */
        get czscene(): Cesium.Scene;
        /**
         *
         */
        get entities(): Cesium.EntityCollection;
        /**
         *
         */
        get clusterEntities(): Cesium.EntityCollection;
        /** 获取多边形集合 */
        get polylines(): Cesium.PolylineCollection;
        /** 获取路径尾迹 */
        get pathTails(): PathTailCollection;
    }
}
declare namespace CZMAP {
    /** @internal */
    class MapMouseEventUE extends MapMouseEvent {
        pickInfo: PickInfoUE;
        constructor(type: string, x: number, y: number, layer: Layer, pickInfo: PickInfoUE);
    }
    /** @internal */
    class MapEventsUE extends MapEvents {
        constructor(view: MapViewUE);
        private _on_mouse_event;
    }
}
declare var webRtcPlayer: any;
declare namespace CZMAP {
    /** @internal */
    interface PickInfoUE extends PickInfo {
        pickedObject?: any;
        cartesian?: Cesium.Cartesian3;
    }
    /** @internal */
    interface MapViewUEOption extends UnrealViewerOption {
        center?: Point;
        autoCenter?: boolean;
        sceneLight?: SceneLight;
        /** 交互模式 */
        inputMode?: UEInputMode;
        /** 拖动键 */
        dragButton?: MouseEventBindLike;
        /** 附拖动键 */
        rightDragButton?: MouseEventBindLike;
    }
    /** @internal */
    class MapViewUE extends MapView {
        private _uview;
        private _uvapi;
        private _layerManager;
        private _events;
        private _gridTool;
        private _drawTool;
        private _measureTool;
        constructor(map: ComMap, dom: string, option: MapViewUEOption);
        get uview(): UnrealViewer;
        get uvapi(): UnrealViewerAPI;
        get layerManager(): LayerManagerUE;
        protected _disposeInternal(): void;
        /**
         * 设置交互模式
         * @param mode 交互模式
         */
        setInputMode(mode: UEInputMode): void;
        /** 启用/禁用地图交互 */
        eanbleInput(enable: boolean): void;
        pick(x: number, y: number): PickInfo;
        fly(option: FlyOption): void;
        completeFly(): void;
        cancelFly(): void;
        lookAt(target: Point): void;
        lockTo(layer: Layer): void;
        unlockTo(): void;
        getViewInfo(): ViewInfo;
        setViewInfo(info: ViewInfo, options?: {
            duration?: number;
        }): void;
        getExtend(): Extent;
        getEvents(): MapEvents;
        /** 设置场景光照 */
        setSceneLight(scene: Partial<SceneLight>): void;
        /** 设置场景的时间 */
        setDateTime(datetime: Partial<DateTime>): void;
        /** 设置场景的天气 */
        setWeather(weather: WeatherOption): void;
        setSeason(season: number): void;
        /** 设置植被风速 */
        setFoliageWind(wind: number): void;
        setCloud(cloud: CloudOption): void;
        getGridTool(): GridTool<MapViewUE>;
        getDrawTool(): DrawTool<MapViewUE>;
        getMeasureTool(): MeasureTool<MapViewUE>;
        createPathRoam(): PathRoam<MapViewUE>;
        createClipPlane(option: ClipPlaneOption): ClipPlaneBase<MapViewUE>;
        createTunnelEffct(): TunnelEffct<MapViewUE>;
        createTunnelTransparent(): TunnelTransparent<MapViewUE>;
        createTerrainClips(options: ClipTerrainOption): ClipTerrain;
        clearTerrainClips(): void;
        /** 创建信息窗口 */
        createInfoWindow(option: InfoWindowOption): InfoWindow<MapViewUE>;
    }
}
declare namespace CZMAP {
    /**
     * Rtc请求
     * @internal
     */
    interface RtcRequest<ResponseT> {
        response?: ResponseT;
    }
    type TemplateRtcRequest<T, R = never> = T & RtcRequest<R>;
    /**
     * 场景初始化请求
     * @internal
     */
    interface RtcInitSceneRequest extends RtcRequest<never> {
        center: Point;
        autoCenter?: boolean;
        time: string;
        zone: number;
        inputMode: string;
        weather: {
            name?: string;
            detail?: WeaterDetail;
            duration?: number;
        };
        season: number;
        sceneLight: SceneLight;
    }
    /**
     * 地形设置请求
     * @internal
     */
    interface RtcSetTerrainRequest extends RtcRequest<never> {
        url?: string;
        maxSSE?: number;
        opacity?: number;
    }
    /**
     * 图层定义
     * @internal
     */
    export interface RtcLayerDefine<Type extends string> {
        /** 图层是否显示 */
        visible?: boolean;
    }
    /**
     * 影像图层定义
     * @internal
     */
    export interface ImageRtcLayerDefine extends RtcLayerDefine<'image'> {
        /** 数据地址 */
        url: string;
    }
    /**
     * 3DTileset 图层定义
     * @internal
     */
    export interface TDTilesetRtcLayerDefine extends RtcLayerDefine<'3dtiles'> {
        url: string;
        maxSSE?: number;
        position?: Point;
        rotate?: Point;
        scale?: Point;
        material?: any;
    }
    /**
     * @internal
     */
    export interface DecalRtcLayerDefine extends RtcLayerDefine<'decal'> {
        position?: Point;
        rotate?: Point;
        scale?: Point;
        image?: string;
        decalType?: string;
        decalWater?: DecalWaterOption;
        size?: Point;
        color?: string;
        opacity?: number;
    }
    /** @internal */
    export interface FlowsRtcLayerDefine extends RtcLayerDefine<'flows'> {
        position?: Point;
        rotate?: Point;
        scale?: Point;
        flows?: FlowsParam;
        flowsType?: string;
    }
    /**
     * 点图层定义
     * @internal
     */
    export interface PointRtcLayerDefine extends RtcLayerDefine<'point'> {
        position?: Point;
        label?: LabelStyleOption;
        labelIcon?: IconStyleOption;
        icon?: IconStyleOption;
        model?: ModelStyleOption;
    }
    /**
     * 线图层定义
     * @internal
     */
    export interface PolylineRtcLayerDefine extends RtcLayerDefine<'polyline'> {
        /** 线的点 */
        positions?: Point[];
        /** 线的材质 */
        material?: string;
        /** 线的样式 */
        style?: {
            /** “墙”样式 */
            wall?: WallStyleOption;
            /** “线”样式 */
            stroke?: StrokeStyleOption;
        };
    }
    /**
     * 可移动的图层
     * @internal
     */
    export interface MoveableRtcLayerDefine<T extends string> extends RtcLayerDefine<T> {
        /** 位置 */
        position?: Point;
        /** 旋转（HPR） */
        rotate?: Point;
        /** 缩放 */
        scale?: Point;
    }
    /**
     * 动态actor
     * @internal
     */
    export interface DynActorRtcLayerDefine extends MoveableRtcLayerDefine<'dynActor'> {
        /** actor的类 */
        path: string;
    }
    export interface VolumeData {
        /** 体数据文件路径 */
        url: string;
        /** 单层体数据的列数 */
        cols: number;
        /** 单层体数据的行数 */
        rows: number;
    }
    /**
     * 动态actor
     * @internal
     */
    export interface VolumeDataLayerDefine extends MoveableRtcLayerDefine<'volume'> {
        /** 体数据 */
        volume: string | VolumeData;
        colors?: string;
        overlay?: string;
        mode?: string;
        planes?: {
            x: number;
            y: number;
            z: number;
        };
    }
    /**
     * 包装图层定义
     * @internal
     */
    export interface WrappedRtcLayerDefine extends MoveableRtcLayerDefine<'wrapped'> {
        layer: string;
    }
    /**
     * 路径漫游
     * @internal
     */
    export interface PathRoamLayerDefine extends RtcLayerDefine<'pathroam'> {
        /** 漫游路径 */
        path: PathNode[];
        /** 漫游选项 */
        option: PathRoamOptions;
    }
    /**
     * 坐标网格
     * @internal
     */
    export interface CoordGridLayerDefine extends RtcLayerDefine<'coordGrid'> {
        grid: {
            /** 中心点 */
            center: Point;
            /** 线段 */
            lines: Point[][];
            /** 点 */
            points: Point[];
            /** 文本 */
            texts: string[];
            /** 文本偏移 */
            offsets: [number, number][];
        };
        /** 线宽 */
        lineWidth: number;
        /** 线色 */
        lineColor: string;
        /** 点的尺寸 */
        pointSize: number;
        /** 点颜色 */
        pointColor: string;
    }
    /**
     * 植物
     * @internal
     */
    export interface FoliageLayerDefine extends RtcLayerDefine<'foliage'> {
        foliages: FoliageInfo[];
    }
    /** @internal */
    export interface RtcLayerDefineMap {
        'image': ImageRtcLayerDefine;
        '3dtiles': TDTilesetRtcLayerDefine;
        'point': PointRtcLayerDefine;
        'polyline': PolylineRtcLayerDefine;
        'dynActor': DynActorRtcLayerDefine;
        'wrapped': WrappedRtcLayerDefine;
        'coordGrid': CoordGridLayerDefine;
        'volume': VolumeDataLayerDefine;
        'flows': FlowsRtcLayerDefine;
        'decal': DecalRtcLayerDefine;
        'pathroam': PathRoamLayerDefine;
        'foliage': FoliageLayerDefine;
    }
    interface PickResponse {
        result?: RtcMouseEventInfo;
    }
    /**
     * 图层信息通知
     * @internal
     */
    export interface NotifyRtcLayerInfo {
        layerID: number;
        box: {
            min: Point;
            max: Point;
        };
    }
    /**
     * 表层（Overlay）信息通知
     * @internal
     */
    export interface NotifyRtcOverlayInfo {
        ids: [id: number, x: number, y: number][];
    }
    /**
     * 路径漫游通知
     * @internal
     */
    export interface NotifyRtcPathRoam {
        layerID: number;
        action: string;
        currentTime: number;
        currentPosition: Point;
    }
    /**
     * 鼠标事件信息
     * @internal
     */
    interface RtcMouseEventInfo {
        /** 鼠标事件类型 */
        type: MapEventsType;
        /** 鼠标位置 */
        pixel: [number, number];
        /** 鼠标点击的三维坐标 */
        position: Point;
        /** 图层ID */
        layerID: number;
        /** 要素ID */
        featureID: number;
        /** 属性信息 */
        info: Record<string, any>;
    }
    /**
     * “飞行到”请求
     * @internal
     */
    interface FlyToRtcRequest extends RtcRequest<never> {
        /** 图层ID */
        layerID?: number;
        /** 目标 */
        target?: Point | Cegore.Position;
        /** 飞行选项 */
        option?: FlyToOption;
    }
    /**
     * Overlay更新函数
     * @internal
     */
    type OverlayFunction = (x: number, y: number) => void;
    /**
     * 提供基于UnrealEngine的视图功能接口
     * @internal
     */
    export class UnrealViewerAPI extends Observable {
        private _uviewer;
        private _nextSEQ;
        private _nextOverlay;
        private _zoomFact;
        private _inputMode;
        /** 当前视图信息 */
        private _viewInfo;
        /** 异步执行等待结果的命令列表 */
        private _asyncCmds;
        /** 通知命令列表 */
        private _notifys;
        /** Overlay列表 */
        private _overlays;
        /** 路径漫游列表 */
        private _pathroams;
        /**
         * 构造 UnrealViewerAPI
         * @param uviewer 视图
         */
        constructor(uviewer: UnrealViewer);
        private _multiPointer;
        get input(): MultiPointInput;
        setInputMode(mode: UEInputMode): void;
        enableInput(enable: boolean): void;
        private _bindInput;
        /**
         * 发送命令
         * @param cmd 命令
         * @param data 命令数据
         * @returns 返回命令序号
         */
        private _sendCommand;
        private _sendConsoleCmd;
        /**
         * 发送命令
         * @param cmd 命令
         * @param data 命令数据
         * @returns 一个Promise，当命令执行成功后resolve
         */
        private _sendCommandAnd;
        /**
         * 接收到视图发来的消息事件
         * @param event 消息事件
         * @returns
         */
        private _onResponse;
        /**
         * 初始化场景
         * @param option 初始化选项
         */
        initScene(option: Partial<RtcInitSceneRequest>): void;
        setSceneLight(sceneLight: Partial<SceneLight>): void;
        setWeater(weather: TemplateRtcRequest<WeatherOption>): void;
        setSeason(season: number): void;
        setFoliageWind(foliageWind: number): void;
        setCloud(option: CloudOption): void;
        /**
         * 清空场景
         */
        clearScene(): void;
        /**
         * 设置地形数据
         * @param option 地形参数
         */
        setTerrain(option: RtcSetTerrainRequest): void;
        /**
         * 创建图层
         * @param type 图层类型
         * @param define 图层定义
         * @returns 返回图层的ID
         */
        createLayer<Type extends string>(type: Type, define: RtcLayerDefine<Type>): Promise<number>;
        /**
         * 更新图层
         * @param layerID 图层ID
         * @param option 图层定义
         */
        updateLayer<T extends RtcLayerDefine<any>>(layerID: number, option: Partial<T>): void;
        /**
         * 设置图层不透明度
         * @param layerID 图层ID
         * @param opacity 不透明度
         * @param color 颜色
         */
        setLayerOpacity(layerID: number, opacity: number, color?: string): void;
        /**
         * 执行图层扩展命令
         * @param layerID 图层ID
         * @param param 扩展命令参数
         */
        executeLayer(layerID: number, param: any): void;
        /**
         * 移动图层
         * @param layerID 图层ID
         * @param actions “活动”列表
         */
        moveLayer(layerID: number, actions: MoveAction[]): void;
        /**
         * 移除图层
         * @param layerID 图层ID
         */
        removeLayer(layerID: number): void;
        /**
         * 添加表层对象（Overlay）
         * @param position Overlay的空间位置
         * @param of Overlay回调函数
         * @returns Overlay ID
         */
        addOverlay(position: Point, of: OverlayFunction): number;
        /**
         * 更新表册对象（Overlay）
         * @param id
         * @param position
         */
        updateOverlay(id: number, position: Point): void;
        /**
         * 移除表层对象（Overlay）
         * @param id Overlay ID
         */
        removeOverlay(id: number): void;
        /**
         * 获取视图信息
         * @returns 当前视图信息
         */
        getViewInfo(): ViewInfo;
        setViewInfo(vi: ViewInfo): void;
        /**
         * 飞行到目标地点
         * @param option 飞行选项
         */
        flyTo(option: FlyToRtcRequest): void;
        completeFlyTo(): void;
        cancelFlyTo(): void;
        /**
         * 设置图层是否可见
         * @param layerID 图层ID
         * @param visible 是否可见
         */
        setVisible(layerID: number, visible: boolean): void;
        /**
         * 切换图层的可见性
         * @param layerID 图层ID
         */
        switchVisible(layerID: number): void;
        resize(width: number, height: number): void;
        pick(x: number, y: number): Promise<PickResponse>;
        pickPosition(x: number, y: number): Promise<PickResponse>;
        regPathRoam(id: number, roam: PathRoamUE): void;
        unregPathRoam(id: number): void;
        private _notify_viewInfo;
        private _notify_mosue_event;
        private _notify_layerinfo;
        private _notify_overlayinfo;
        private _notify_pathroam;
    }
    /**
     * 相对URL路径转绝对路径
     * @param src 待转化的URL
     * @returns 转换后的绝对路径
     */
    export function absURL(src: string): string;
    export {};
}
declare namespace CZMAP {
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     * @internal
     */
    enum MouseButton {
        MainButton = 0,
        AuxiliaryButton = 1,
        SecondaryButton = 2,
        FourthButton = 3,
        FifthButton = 4
    }
    /**
     * 交互类型
     * @internal
     */
    export type UEInputMode = "ASDW" | "Globe";
    /**
     * 云渲染回调通知
     * @internal
     */
    export class UnrealViewerEvents extends BaseObjectEvents {
        static RTC_RESPONSE: string;
    }
    /**
     * UnrealViewer 参数
     * @internal
     */
    export interface UnrealViewerOption {
        dom: string | HTMLDivElement;
        /**
         * 信号服务器地址
         * @deprecated
         */
        singleServer?: string;
        /** 信号服务器地址 */
        signalServer: string;
        /** 自动连接 */
        autoConnect?: boolean;
        /** 显示连接信息 */
        showConnectInfo?: boolean;
        /** 数据通道数据包最大大小 */
        dataChannelMaxBytes?: number;
        suppressBrowserKeys?: boolean;
        fakeMouseWithTouches?: boolean;
    }
    /**
     * 播放器对象
     * @internal
     */
    interface PlayerElement extends HTMLVideoElement {
        pressMouseButtons: (this: PlayerElement, e: MouseEvent) => any | null;
        releaseMouseButtons: (this: PlayerElement, e: MouseEvent) => any | null;
    }
    /**
     * Unreal Viewer
     * @internal
     */
    export class UnrealViewer extends Observable {
        private _option;
        private _playerDiv;
        private _videoElement;
        private _audioElement;
        private _playerElementClientRect;
        private _connectOverlay;
        private _connectInfo;
        private _autoPlayAudio;
        private _qualityController;
        private _freezeFrameOverlay;
        private _freezeFrameImage;
        private _freezeFrame;
        /** 通信的WebSocket */
        private _ws;
        private _is_reconnection;
        private _webRtcPlayerObj;
        private _VideoEncoderQP;
        private _print_inputs;
        private _ready;
        private _resolve;
        private _lastViewWidth;
        private _lastViewHeight;
        private _updateSizeHandle;
        private _lockOnMouseDown;
        constructor(option: UnrealViewerOption);
        get ready(): Promise<void>;
        get sceneDOM(): PlayerElement;
        /**
         * 鼠标按下时是否锁定鼠标消息
         * @param lock
         */
        setLockOnMousedown(lock: boolean): void;
        /**
         * 连接信号服务器
         */
        connect(): void;
        updateSize(): void;
        /** 连接到信号服务器，开始配置 */
        private _onConfig;
        private _onWebRtcOffer;
        private _onWebRtcAnswer;
        private _onWebRtcIce;
        /** 设置并初始化WebRtcPlayer */
        private _setupWebRtcPlayer;
        /** 开始播放音视频流 */
        private _playStream;
        private _resizePlayerStyle;
        private _setupVideoStyle;
        private _setupConnectionOverlay;
        private _setupConnectInfo;
        private _showConnectionOverlay;
        private _showConnectionInfo;
        private _appendConnectInfo;
        private _clearConnectInfo;
        private _setupFreezeFrameOverlay;
        private _showFreezeFrameOverlay;
        private _invalidateFreezeFrameOverlay;
        private _resizeFreezeFrameOverlay;
        private _onRtcPlayerResponse;
        /** 发送数据到渲染器 */
        private _sendInputData;
        private _emitMessageType;
        /**
         * A generic message has a type and a descriptor.
         * @param messageType
         * @param descriptor
         */
        private _emitDescriptor;
        private _next_multi_id;
        /**
         * A UI interation will occur when the user presses a button powered by
         * JavaScript as opposed to pressing a button which is part of the pixel
         * streamed UI from the UE client.
         * @param descriptor
         * @returns
         */
        emitUIInteraction(descriptor: any): void;
        /**
         * A build-in command can be sent to UE client. The commands are defined by a
         * JSON descriptor and will be executed automatically.
         * The currently supported commands are:
         *
         * 1. A command to run any console command:
         *  "{ ConsoleCommand: <string> }"
         *
         * 2. A command to change the resolution to the given width and height.
         *  "{ Resolution.Width: <value>, Resolution.Height: <value> } }"
         *
         * @param descriptor
         */
        emitCommand(descriptor: any): void;
        private _requestInitialSettings;
        private _requestQualityControl;
        private _normalize;
        /** 归一并量子化无符号数 */
        normalizeAndQuantizeUnsigned(x: number, y: number): {
            inRange: boolean;
            x: number;
            y: number;
        };
        /** 归一并量子化有符号数 */
        normalizeAndQuantizeSigned(x: number, y: number): {
            x: number;
            y: number;
        };
        /** 解码量子化的无符号数 */
        unquantizeAndDenormalizeUnsigned(x: number, y: number): {
            x: number;
            y: number;
        };
        emitKeyDown(keyCode: number, repeat: boolean): void;
        emitKeyUp(keyCode: number): void;
        emitKeyPress(charCode: number): void;
        /** 发送鼠标移动消息 */
        emitMouseMove(x: number, y: number, deltaX: number, deltaY: number): void;
        /** 发送鼠标按下消息 */
        emitMouseDown(button: MouseButton, x: number, y: number): void;
        /** 发送鼠标弹起消息 */
        emitMouseUp(button: MouseButton, x: number, y: number): void;
        /** 发送鼠标滚轮消息 */
        emitMouseWheel(delta: number, x: number, y: number): void;
        releaseMouseButtons(buttons: number, x: number, y: number): void;
        pressMouseButtons(buttons: number, x: number, y: number): void;
        /**
         * 注册输入事件
         */
        private _registerInputs;
        /** 注册键盘事件 */
        private _registerKeyboardEvents;
        /** 鼠标进入和离开事件 */
        private _registerMouseEnterAndLeaveEvents;
        /** 注册鼠标事件 */
        private _registerMouseEvents;
        private _registerTouchEvents;
    }
    export {};
}
declare namespace CZMAP {
    interface AggregatedStats {
        type: 'inbound-rtp' | 'track' | 'candidate-pair';
        isRemote: boolean;
        mediaType: 'video';
        id: string;
        trackIdentifier: string;
        kind: string;
        receiveToCompositeMs: number;
        timestamp: number;
        bytesReceived: number;
        framesDecoded: number;
        packetsLost: number;
        bytesReceivedStart: number;
        framesDecodedStart: number;
        timestampStart: number;
        bitrate: number;
        lowBitrate: number;
        highBitrate: number;
        avgBitrate: number;
        framerate: number;
        lowFramerate: number;
        highFramerate: number;
        avgframerate: number;
        framesDropped: number;
        framesReceived: number;
        framesDroppedPercentage: number;
        frameHeight: number;
        frameWidth: number;
        frameHeightStart: number;
        frameWidthStart: number;
        currentRoundTripTime: number;
    }
    interface UETimings {
        EncodeMs: number;
        ReceiptTimeMs: number;
        CaptureToSendMs: number;
        TransmissionTimeMs: number;
    }
    class LatencyTestTimings {
        TestStartTimeMs: number;
        UEReceiptTimeMs: number;
        UEEncodeMs: number;
        UECaptureToSendMs: number;
        UETransmissionTimeMs: number;
        BrowserReceiptTimeMs: number;
        FrameDisplayDeltaTimeMs: number;
        Reset(): void;
        SetUETimings(UETimings: UETimings): void;
        SetFrameDisplayDeltaTime(DeltaTimeMs: number): void;
        OnAllLatencyTimingsReady(Timings: any): void;
    }
    type CallbackVoid = () => void;
    type Callback<T> = (arg: T) => void;
    export interface WebRtcPlayerOption {
        peerConnectionOptions?: RTCConfiguration;
        startVideoMuted?: boolean;
        autoPlayAudio?: boolean;
    }
    export class WebRtcPlayer {
        cfg: RTCConfiguration;
        forceTURN: boolean;
        forceMaxBundle: boolean;
        pcClient: RTCPeerConnection;
        dcClient: RTCDataChannel;
        tnClient: any;
        dataChannelOptions: RTCDataChannelInit;
        startVideoMuted: boolean;
        autoPlayAudio: boolean;
        forceMonoAudio: boolean;
        useMic: boolean;
        preferSFU: boolean;
        latencyTestTimings: LatencyTestTimings;
        video: HTMLVideoElement;
        audio: HTMLAudioElement;
        availableVideoStreams: Map<string, MediaStream>;
        onVideoInitialised: CallbackVoid;
        onDataChannelClose: CallbackVoid;
        onDataChannelConnected: CallbackVoid;
        onDataChannelMessage: Callback<any>;
        onWebRtcCandidate: Callback<RTCIceCandidate>;
        onWebRtcOffer: Callback<RTCSessionDescriptionInit>;
        onWebRtcAnswer: Callback<RTCSessionDescription>;
        onNewVideoTrack: Callback<ReadonlyArray<MediaStream>>;
        onAggregatedStats: Callback<AggregatedStats>;
        aggregatedStats: AggregatedStats;
        aggregateStatsIntervalId: number;
        constructor(parOptions: WebRtcPlayerOption);
        createWebRtcVideo(): HTMLVideoElement;
        createWebRtcAudio(): HTMLAudioElement;
        onsignalingstatechange(state: any): void;
        oniceconnectionstatechange(state: any): void;
        onicegatheringstatechange(state: any): void;
        handleOnTrack(e: RTCTrackEvent): void;
        handleOnAudioTrack(audioMediaStream: MediaStream): void;
        onDataChannel(dataChannelEvent: RTCDataChannelEvent): void;
        createDataChannel(pc: RTCPeerConnection, label: string, options: RTCDataChannelInit): RTCDataChannel;
        setupDataChannelCallbacks(datachannel: RTCDataChannel): RTCDataChannel;
        onicecandidate(e: RTCPeerConnectionIceEvent): void;
        handleCreateOffer(pc: RTCPeerConnection): void;
        mungeSDPOffer(offer: RTCSessionDescriptionInit): void;
        setupPeerConnection(pc: RTCPeerConnection): void;
        generateAggregatedStatsFunction(): (stats: RTCStatsReport) => void;
        setupTransceiversAsync(pc: RTCPeerConnection): Promise<void>;
        setVideoEnabled(enabled: boolean): void;
        startLatencyTest(onTestStarted: (TestStartTimeMs: number) => void): void;
        handleCandidateFromServer(iceCandidate: RTCIceCandidateInit): void;
        createOffer(): void;
        receiveOffer(offer: RTCSessionDescriptionInit): void;
        receiveAnswer(answer: RTCSessionDescriptionInit): void;
        close(): void;
        send(data: any): void;
        getStats(onStats: (stats: RTCStatsReport) => void): void;
        aggregateStats(checkInterval: number): void;
    }
    export {};
}
declare namespace CZMAP {
    type TrackLineStyle = {
        width?: number;
    } & StrokeDetail;
    interface FlowLineStyle {
        width?: number;
        color?: string;
        speed?: number;
        percent?: number;
        gradient?: number;
    }
    interface MissileModelOption {
        uri: string;
        scale?: number;
        minimumPixelSize?: number;
        maximumScale?: number;
        hpr?: number[];
    }
    /** 攻击轨迹选项 */
    interface MissileAttackOption {
        /** 轨迹 */
        track: Point[];
        /** 起点样式 */
        start: {
            icon?: string;
            trackStyle?: TrackLineStyle;
            flowStyle?: FlowLineStyle;
        };
        /** 目标点 */
        target?: {
            position: Point;
            color: string;
            speed: number;
            repeat?: number;
            trackStyle?: TrackLineStyle;
            flowStyle?: FlowLineStyle;
        };
        /** 预估点 */
        estimated?: {
            position: Point;
            color: string;
            speed: number;
            repeat?: number;
            trackStyle?: TrackLineStyle;
            flowStyle?: FlowLineStyle;
        };
        model?: MissileModelOption;
    }
    interface InterceptTrackOption {
        positions: Point[];
        color: string;
        radius: number;
        trackStyle?: TrackLineStyle;
        flowStyle?: FlowLineStyle;
    }
    /** 拦截轨迹选项 */
    interface MissileInterceptOption {
        /** 起点样式 */
        start?: {
            icon?: string;
        };
        /** 当前点 */
        current?: InterceptTrackOption;
        /** 预估点 */
        estimated?: InterceptTrackOption;
        model?: MissileModelOption;
    }
    /** 导弹轨迹 */
    export class MissileTrack {
        private _map;
        private _view3d;
        private _czviewer;
        private _attackEntites;
        private _intercepEntites;
        constructor(map: ComMap);
        /**
         * 创建攻击轨迹和拦截轨迹
         * @param attack 攻击轨迹
         * @param intercept 拦截轨迹
         */
        create(attack?: MissileAttackOption, intercept?: MissileInterceptOption): void;
        /** 创建导弹轨迹 */
        createAttack(option: MissileAttackOption): void;
        /** 创建拦截轨迹 */
        createIntercept(option: MissileInterceptOption): void;
        clearAttack(): void;
        clearIntercept(): void;
        clear(): void;
        private _createIntercept;
        private _createAttackEntity;
        private _createInterceptEntity;
        private _createTrackLine;
    }
    export {};
}
declare namespace CZMAP {
    class ProjectionForGlobe {
        private _src;
        private _dst;
        private _proj;
        private _centerX;
        private _centerY;
        constructor();
        setCrs(crs: string): void;
        setCenter(x: number, y: number): void;
        toLongLat(pt: Point): Point;
        toLocal(pt: Point): Point;
    }
}
declare namespace CZMAP {
    /**
     * 坐标变换支持
     */
    class Transforms {
        static createProj4(src: string, dest: string): any;
        static transformBox(box: BoundingBox, src: ProjectionLike, dest: ProjectionLike): BoundingBox;
        /**
         * 投影坐标数组
         * @param pts 坐标数组
         * @param src 源投影西
         * @param dest 目标投影系
         */
        static transformCoordinates<T extends Coordinates>(pts: T, src: ProjectionLike, dest: ProjectionLike): T;
        /**
         * 投影要素
         * @param {FeatureLike|FeatureLike[]} features
         * @param {*} src
         * @param {*} dest
         */
        static transformFeatures(features: FeatureLike | FeatureLike[], src: ProjectionLike, dest: ProjectionLike): FeatureLike | FeatureLike[];
    }
}
declare namespace CZMAP {
    /**
     * 要素加载器
     */
    type FeatureLoader = (box: BoundingBox, res: number, projection: ProjectionLike) => void;
    type LoadSuccessed = (features: Feature[], projection: ProjectionLike) => void;
    type LoadFailed = () => void;
    /**
     * 创建基于url的要素加载器
     * @param url
     * @param format
     * @param success
     * @param failed
     */
    function createUrlFeatureLoader(url: string, format: FeatureFormat, success?: LoadSuccessed, failed?: LoadFailed): FeatureLoader;
    /**
     * 创建基于url的数据源加载器
     * @param url
     * @param format
     */
    function createUrlVectorFeatureLoader(url: string, format: FeatureFormat): FeatureLoader;
}
declare namespace CZMAP {
    /**
     * 数据源状态
     */
    enum SourceState {
        UNDEFINED = "undefined",
        LOADING = "loading",
        READY = "ready",
        ERROR = "error"
    }
}
declare namespace CZMAP {
    /**
     * 水平原点
     */
    enum HorizontalOrigin {
        /**
         * 左对齐
         */
        LEFT = 0,
        /**
         * 中间对齐
         */
        CENTER = 1,
        /**
         * 右对齐
         */
        RIGHT = 2
    }
    /**
     * 垂直原点
     */
    enum VerticalOrigin {
        /**
         * 下对齐
         */
        BOTTOM = 0,
        /**
         * 中间对齐
         */
        CENTER = 1,
        /**
         * 上对齐
         */
        TOP = 2,
        /**
         * 基线对齐
         */
        BASELINE = 3
    }
    enum StyleProperty {
        VISIBLE = "visible"
    }
    interface StyleOption {
        visible?: boolean;
    }
    /**
     * 样式基类
     */
    class Style extends BaseObject implements StyleOption {
        constructor(style?: StyleOption);
        /**
         * 是否显示该样式
         */
        get visible(): any;
        set visible(v: any);
        /**
         * 获取样式定义对象
         * @returns 样式定义对象
         */
        toStyleOption<T extends StyleOption>(): T;
        static fmtHorizontal(v: string | number): HorizontalOrigin;
        static fmtVertital(v: string | number): VerticalOrigin;
        protected _initDefines(): void;
    }
}
declare namespace CZMAP {
    /**
     * 标注的属性集合
     */
    enum BillStyleProperty {
        OFFSET = "offset",
        HORIZONTAL_ORIGIN = "horizontalOrigin",
        VERTICAL_ORIGIN = "verticalOrigin",
        VISIBLE_RANGE = "visibleRange",
        FADE_DISTANCE = "fadeDistance",
        SCALE_DISTANCE = "scaleDistance",
        DEPTH_DISTANCE = "depthDistance"
    }
    interface BillStyleOption extends StyleOption {
        /** 偏移 */
        offset?: string | [number, number];
        /** 水平起点 */
        horizontalOrigin?: string | HorizontalOrigin;
        /** 垂直起点 */
        verticalOrigin?: string | VerticalOrigin;
        /** 可见范围 */
        visibleRange?: string | [number, number];
        /** 渐隐范围 */
        fadeDistance?: string | [number, number, number, number];
        /** 缩放范围 */
        scaleDistance?: string | [number, number, number, number];
        /** 深度检测距离 */
        depthDistance?: string | number;
    }
    /**
     * 公告板样式
     */
    class BillStyle extends Style implements BillStyleOption {
        constructor(option?: BillStyleOption & object);
        protected _initDefines(): void;
        set offset(v: string | [number, number]);
        get offset(): [number, number];
        set horizontalOrigin(v: string | HorizontalOrigin);
        get horizontalOrigin(): HorizontalOrigin;
        set vertitalOrigin(v: string | VerticalOrigin);
        get vertitalOrigin(): VerticalOrigin;
        set visibleRange(v: string | [number, number]);
        get visibleRange(): [number, number];
        set scaleDistance(v: string | [number, number, number, number]);
        get scaleDistance(): [number, number, number, number];
        set fadeDistance(v: string | [number, number, number, number]);
        get fadeDistance(): [number, number, number, number];
        set depthDistance(v: string | number);
        get depthDistance(): number;
    }
}
declare namespace CZMAP {
    interface FeatureStyleOption {
        name?: string;
        icon?: IconStyle | IconStyleOption;
        label?: LabelStyle | LabelStyleOption;
        model?: object;
        stroke?: StrokeStyle | StrokeStyleOption;
        wall?: WallStyle | WallStyleOption;
    }
    /**
     * 要素样式
     */
    class FeatureStyle extends Style {
        /** 图标样式 */
        private _icon;
        /** 标注样式 */
        private _label;
        /** 模型样式 */
        private _model;
        /** 线样式 */
        private _stroke;
        /** 墙样式 */
        private _wall;
        /** 要素名称 */
        private _name;
        /** 提示信息 */
        private _tip;
        /** 菜单信息 */
        private _menu;
        constructor(style?: FeatureStyleOption);
        get name(): string;
        /** 获取图标样式 */
        get icon(): IconStyle;
        /** 获取标注样式 */
        get label(): LabelStyle;
        /** 获取模型样式 */
        get model(): ModelStyle;
        /** 获取线样式 */
        get stroke(): StrokeStyle;
        /** 获取墙样式 */
        get wall(): WallStyle;
        /** 获取TIP信息 */
        get tip(): any;
        /** 获取菜单信息 */
        get menu(): any;
        /**
         * 更新样式
         * @param {Object} temp 样式模板
         * @param {Object} data 数据源
         * @param {Boolean} dynOnly 仅包含动态样式
         */
        update(temp: object, data: Record<string, any>, dynOnly: boolean): void;
        /**
         * 默认样式
         */
        static readonly default: FeatureStyle;
    }
    /**
     * 样式函数
     */
    type FeatureStyleFunction = (feature: Feature, resolution: number, opt_style?: FeatureStyle) => FeatureStyle;
    /**
     *
     */
    type FeatureStyleLike = FeatureStyle | FeatureStyleFunction;
}
declare namespace CZMAP {
    /**
     * 标注的属性集合
     */
    enum IconStyleProperty {
        SOURCE = "src",
        COLOR = "color",
        WIDTH = "width",
        HEIGHT = "height",
        ROTATION = "rotate"
    }
    interface IconStyleOption extends BillStyleOption {
        src?: string;
        color?: string | Cesium.Color;
        width?: string | number;
        height?: string | number;
        rotation?: string | number;
    }
    /**
     * 图标样式
     */
    class IconStyle extends BillStyle implements IconStyleOption {
        constructor(option?: IconStyleOption & object);
        protected _initDefines(): void;
        /**
         * 图标的源
         */
        get src(): any;
        set src(v: any);
        /**
         * 图标的源
         */
        get color(): any;
        set color(v: any);
        /**
         * 宽度
         */
        get width(): number;
        set width(v: string | number);
        /**
         * 高度
         */
        get height(): any;
        set height(v: any);
        /**
         * 高度
         */
        get rotate(): any;
        set rotate(v: any);
    }
}
declare namespace CZMAP {
    /**
     * 标注的属性集合
     */
    enum LabelStyleProperty {
        TEXT = "text",
        FONT = "font",
        COLOR = "color",
        PADDING = "padding",
        BORDER_COLOR = "borderColor",
        BORDER_WIDTH = "borderWidth",
        BACKGROUND = "background",
        BACKGROUND_COLOR = "backgroundColor",
        BACKGROUND_BORDER_COLOR = "backgroundBorderColor",
        BACKGROUND_BORDER_WIDTH = "backgroundBorderWidth",
        BACKGROUND_BORDER_RADIUS = "backgroundBorderRadius",
        LINE_OFFSET = "lineOffset",
        LINE_COLOR = "lineColor",
        LINE_WIDTH = "lineWidth"
    }
    interface LabelStyleOption extends BillStyleOption {
        /** 文本 */
        text?: string;
        /** 字体 */
        font?: string;
        /** 颜色 */
        color?: string | Cesium.Color;
        /** 内间距 */
        padding?: [number, number];
        /** 文字描边颜色 */
        borderColor?: string | Cesium.Color;
        /** 文字描边宽度 */
        borderWidth?: number;
        /** 背景 */
        background?: boolean;
        /** 背景色 */
        backgroundColor?: string | Cesium.Color;
        /** 背景边框颜色 */
        backgroundBorderColor?: string;
        /** 背景边框宽度 */
        backgroundBorderWidth?: number;
        /** 背景边框半径 */
        backgroundBorderRadius?: number;
        /** 连接线偏移 */
        lineOffset?: string | [number, number, number];
        /** 连接线颜色 */
        lineColor?: string | Cesium.Color;
        /** 连接线宽 */
        lineWidth?: string | number;
    }
    /**
     * 标注样式
     */
    class LabelStyle extends BillStyle implements LabelStyleOption {
        constructor(option?: LabelStyleOption & object);
        protected _initDefines(): void;
        set text(v: string);
        get text(): string;
        set font(v: string);
        get font(): string;
        set color(v: string | Cesium.Color);
        get color(): string | Cesium.Color;
        set padding(v: [number, number]);
        get padding(): [number, number];
        set borderColor(v: string | Cesium.Color);
        get borderColor(): string | Cesium.Color;
        set borderWidth(v: number);
        get borderWidth(): number;
        set background(v: boolean);
        get background(): boolean;
        set backgroundColor(v: string | Cesium.Color);
        get backgroundColor(): string | Cesium.Color;
        set backgroundBorderColor(v: string);
        get backgroundBorderColor(): string;
        set backgroundBorderWidth(v: number);
        get backgroundBorderWidth(): number;
        set backgroundBorderRadius(v: number);
        get backgroundBorderRadius(): number;
        set lineOffset(v: string | Point);
        get lineOffset(): Point;
        set lineWidth(v: string | number);
        get lineWidth(): number;
        set lineColor(v: string | Cesium.Color);
        get lineColor(): string | Cesium.Color;
    }
}
declare namespace CZMAP {
    enum ModelStyleProperty {
        SOURCE = "src",
        POSE = "pose",
        SCALE = "scale"
    }
    interface ModelStyleOption extends StyleOption {
        src?: string;
        pose?: Point;
        scale?: number;
    }
    class ModelStyle extends Style implements ModelStyleOption {
        constructor(style?: ModelStyleOption);
        protected _initDefines(): void;
        /**
         * 模型数据源
         */
        get src(): string;
        set src(v: string);
        /**
         * 模型的姿态
         */
        get pose(): Point;
        set pose(v: Point);
        /**
         * 模型的缩放
         */
        get scale(): number;
        set scale(v: number);
    }
}
declare namespace CZMAP {
    /** 线形 */
    enum StrokeDetailType {
        /**
         * 普通样式
         */
        NORMAL = "normal",
        /**
         * 炽热样式
         */
        GLOW = "glow",
        /**
         * 轮库线样式
         */
        OUTLINE = "outline",
        /**
         * 点划线样式
         */
        DASH = "dash",
        /**
         * 箭头样式
         */
        ARROW = "arrow"
    }
    interface AbstractStrokeDetail {
        /** 绘制类型 */
        readonly type: StrokeDetailType;
        /** 颜色 */
        color?: string | Cesium.Color;
    }
    interface ArrowStrokeDetail extends AbstractStrokeDetail {
        readonly type: StrokeDetailType.ARROW;
    }
    interface NormalStrokeDetail extends AbstractStrokeDetail {
        readonly type: StrokeDetailType.NORMAL;
    }
    interface GlowStrokeDetail extends AbstractStrokeDetail {
        readonly type: StrokeDetailType.GLOW;
        glowPower?: number;
        taperPower?: number;
    }
    interface OutlineStrokeDetail extends AbstractStrokeDetail {
        readonly type: StrokeDetailType.OUTLINE;
        outlineColor?: string | Cesium.Color;
        outlineWidth?: number;
    }
    interface DashStrokeDetail extends AbstractStrokeDetail {
        readonly type: StrokeDetailType.DASH;
        dashColor?: string | Cesium.Color;
        dashLength?: number;
        dashLengthUnit?: 'pixel' | 'meter';
        dashPattern?: number;
    }
    type StrokeDetail = ArrowStrokeDetail | NormalStrokeDetail | GlowStrokeDetail | OutlineStrokeDetail | DashStrokeDetail;
    /** 弧线类型 */
    enum StrokeArcType {
        /** 直线 */
        NONE = "none",
        /** 最短弧线 */
        GEODESIC = "geodesic",
        /** 罗盘方位线 */
        RHUMB = "rhumb"
    }
    enum StrokeStyleProperty {
        FOLLOW_SURFACE = "followSurface",
        WIDTH = "width",
        ARC_TYPE = "arcType",
        DETAIL = "detail",
        DEPTH_FAIL_DETAIL = "depthFailDetail",
        DEPTH_CHECK = "depthCheck",
        VISIBLE_RANGE = "visibleRange"
    }
    interface StrokeStyleOption extends StyleOption {
        /** 是否贴附地表 */
        followSurface?: boolean;
        /** 线宽 */
        width?: number;
        /** 弧线类型 */
        arcType?: StrokeArcType;
        /** 细节 */
        detail?: StrokeDetail;
        /** 被遮挡样式 */
        depthFailDetail?: StrokeDetail;
        /** 深度检测 */
        depthCheck?: boolean;
        /** 显示距离，[near, far] */
        visibleRange?: number[];
    }
    /** 折线样式 */
    class StrokeStyle extends Style implements StrokeStyleOption {
        constructor(style?: StrokeStyleOption);
        protected _initDefines(): void;
        get followSurface(): boolean;
        set followSurface(v: boolean);
        get width(): number;
        set width(v: number);
        get arcType(): StrokeArcType;
        set arcType(v: StrokeArcType);
        get visibleRange(): number[];
        set visibleRange(v: number[]);
        get detail(): StrokeDetail;
        set detail(v: StrokeDetail);
        get depthFailDetail(): StrokeDetail;
        set depthFailDetail(v: StrokeDetail);
        get depthCheck(): boolean;
        set depthCheck(v: boolean);
    }
}
declare namespace CZMAP {
    export enum WallStyleProperty {
        COLOR = "color",
        IMAGE = "image",
        MODE = "mode",
        IMAGE_REPEAT_Y = "imageRepeatY",
        HEIGHT = "height",
        THICKNESS = "thickness",
        OUTLINE_WITDH = "outlineWidth",
        OUTLINE_COLOR = "outlineColor",
        VISIBLE_RANGE = "visibleRange"
    }
    type WallMode = 'flat' | 'wall' | 'pipe';
    export interface WallStyleOption extends StyleOption {
        /** 填充颜色 */
        color?: string;
        /** 填充纹理 */
        image?: string;
        /** 图片重复数量 */
        imageRepeatY?: number;
        mode?: WallMode;
        /** 高度 */
        height?: number;
        /** 厚度 */
        thickness?: number;
        /** 边框颜色 */
        outlineColor?: string | Cesium.Color;
        /** 边框宽度 */
        outlineWidth?: number;
        /** 显示距离，[near, far] */
        visibleRange?: number[];
    }
    /** 折线样式 */
    export class WallStyle extends Style implements WallStyleOption {
        constructor(style?: StrokeStyleOption);
        protected _initDefines(): void;
        get color(): string;
        set color(v: string);
        get image(): string;
        set image(v: string);
        get mode(): WallMode;
        set mode(v: WallMode);
        get imageRepeatY(): number;
        set imageRepeatY(v: number);
        get height(): number;
        set height(v: number);
        get thickness(): number;
        set thickness(v: number);
        get outlineColor(): string;
        set outlineColor(v: string);
        get outlineWidth(): number;
        set outlineWidth(v: number);
        get visibleRange(): number[];
        set visibleRange(v: number[]);
    }
    export {};
}
declare namespace CZMAP {
    /**
     * 工具类的基类，抽象类，不要直接构造改对象
     */
    abstract class BaseTool<T extends MapView = MapView> extends BaseObject {
        /**
         * 地图对象
         */
        map: ComMap;
        /**
         * 视图对象
         */
        view: T;
        /**
         *
         * @param map 地图对象
         */
        constructor(view: T);
    }
}
declare namespace CZMAP {
    enum ClipPlaneProperty {
        COLOR = "color",
        BORDER_COLOR = "border_color",
        BORDER_WIDTH = "border_width"
    }
    enum AxisClipPlaneProperty {
        AXIS = "axis",
        DISTANCE = "distance"
    }
    enum PathClipPlanesProperty {
        PATH = "path"
    }
    enum ClipPlaneType {
        AXIS_PLANE = 0,
        PATH_PLANE = 1
    }
    interface ClipPlaneOption {
        type: ClipPlaneType;
        box: BoundingBox;
    }
    abstract class BoxBasedTool<T extends MapView = MapView> extends BaseTool<T> {
        private _box;
        private _center;
        private _size;
        private _gsize;
        constructor(view: T, box: BoundingBox);
        get box(): BoundingBox;
        get center(): Point;
        get size(): Point;
        get gsize(): Point;
    }
    abstract class ClipPlaneBase<T extends MapView = MapView> extends BoxBasedTool<T> {
        constructor(view: T, box: BoundingBox);
        get color(): string;
        set color(color: string);
        get borderColor(): string;
        set borderColor(color: string);
        get borderWidth(): number;
        set borderWidth(width: number);
    }
    abstract class AxisClipPlane<T extends MapView = MapView> extends ClipPlaneBase<T> {
        constructor(view: T, box: BoundingBox);
        get axis(): Axis;
        set axis(axis: Axis);
        get distance(): number;
        set distance(dist: number);
        get percent(): number;
        set percent(val: number);
    }
    abstract class PathClipPlanes<T extends MapView = MapView> extends ClipPlaneBase<T> {
        protected _path: Polyline;
        protected _path0: Polyline;
        constructor(view: T, box: BoundingBox);
        get path(): Point[];
        private _clone;
        /** 添加点 */
        addPoint(point: Point): void;
        /** 清除 */
        clear(): void;
        /**
         * 闭合
         */
        closePath(): void;
        /** 扩展 */
        extendPath(): void;
        /** 计算线段到包围盒的交点 */
        private _extendLineToBox;
        protected _onPathChanged(): void;
    }
}
declare namespace CZMAP {
    interface CoordGridOption {
        name?: string;
        /**
         * @deprecated
         */
        min?: Point;
        /**
         * @deprecated
         */
        max?: Point;
        /** 数据范围 */
        dataBox?: BoundingBox;
        /** 显示范围 */
        displayBox?: BoundingBox;
        /** 颜色 */
        lineColor?: string;
        /** 线宽 */
        lineWidth?: number;
        /** 交点 */
        pointColor?: string;
        pointSize?: number;
        /** 字体 */
        textColor?: string;
        textFont?: string;
        /** 网格间距 */
        stepx?: number;
        stepy?: number;
        stepz?: number;
        /** 小数位数 */
        fixedNumX?: number;
        fixedNumY?: number;
        fixedNumZ?: number;
    }
    type GridOption = CoordGridOption;
    /** 坐标网格 */
    abstract class CoordGrid<T extends MapView = MapView> extends BaseTool<T> {
        constructor(view: T);
        abstract build(option: CoordGridOption): void;
        abstract close(): void;
        abstract getVisible(): boolean;
        abstract setVisible(value: boolean): void;
    }
}
declare namespace CZMAP {
    interface DrawStyle {
        /**
         * 填充色
         */
        fillColor: string;
        /**
         * 线条颜色
         */
        lineColor: string;
        /**
         * 线宽
         */
        lineWidth: number;
    }
    type DrawCallback = (geometry: Geometry) => void;
    type DrawCallbackVoid = () => void;
    interface DrawOption {
        /** 绘制类型 */
        type: GeometryType;
        /**
         * 是否自动添加到场景中
         * @default true
         */
        autoAdd?: boolean;
        /**
         * 是否显示绘制中的图形
         * @default true
         */
        showDrawing?: boolean;
        /** 绘制样式 */
        style?: DrawStyle;
        /** 绘制中回调 */
        drawing?: DrawCallback;
        /** 绘制结束回调 */
        finished?: DrawCallback;
        /** 取消绘制 */
        canceled?: DrawCallbackVoid;
        /** 最大允许绘制的点个数 */
        maxPoints?: number;
        /** 分组名称 */
        group?: string;
    }
    interface DrawOptionPart extends Omit<DrawOption, 'type' | 'style' | 'finished'> {
    }
    /**
     * 绘制工具
     * @abstract
     */
    abstract class DrawTool<T extends MapView = MapView> extends BaseTool<T> {
        private _next_id;
        private _itemGroups;
        constructor(view: T);
        protected _getNextID(): number;
        /**
         * 添加几何对象
         * @param geo 几何
         * @param style 样式
         * @param group 分组
         */
        abstract add(geo: Geometry, style?: DrawStyle, group?: string): string;
        /**
         * 移除绘制的对象
         * @param id 对象id
         */
        abstract remove(id: string): void;
        /**
         * 清除所有绘制对象
         * @param group 绘制组
         */
        clear(group?: string): void;
        /** 设置对象的组 */
        protected _setGroup(id: string, group?: string): void;
        protected _delGroup(id: string): void;
        /**
         * 画图形
         * @param type 图形类型
         * @param callback 绘制结束回调
         * @param style 绘制样式
         * @param opt_this 回调绑定的this
         * @see {@link DrawTool.startDraw}
         */
        draw(type: GeometryType, callback: DrawCallback, style?: DrawStyle, opt_this?: object, option?: DrawOptionPart): void;
        /**
         * 画点
         */
        drawPoint(callback: DrawCallback, style?: DrawStyle, opt_this?: any, option?: DrawOptionPart): void;
        /**
         * 画线
         */
        drawLine(callback: DrawCallback, style?: DrawStyle, opt_this?: any, option?: DrawOptionPart): void;
        /**
         * 画线
         */
        drawPolyline(callback: DrawCallback, style?: DrawStyle, opt_this?: any, option?: DrawOptionPart): void;
        /**
         * 画圆
         */
        drawCircle(callback: DrawCallback, style?: DrawStyle, opt_this?: any, option?: DrawOptionPart): void;
        /**
         * 画矩形
         */
        drawRect(callback: DrawCallback, style?: DrawStyle, opt_this?: any, option?: DrawOptionPart): void;
        /**
         * 画多边形
         */
        drawPolygon(callback: DrawCallback, style?: DrawStyle, opt_this?: any, option?: DrawOptionPart): void;
        /**
         * 开始绘制
         * @param option
         */
        startDraw(option: DrawOption): void;
        /**
         * 停止绘制
         */
        stopDraw(): void;
        protected _pick(x: number, y: number): Promise<Point>;
        protected abstract _updateDrawing(type: GeometryType, pts: Point[]): void;
        protected abstract _clearDrawing(): void;
        private _eventBind;
        /** 绑定事件 */
        protected _bindEvents(dom: HTMLElement): void;
        private _drawType;
        private _drawGroup?;
        private _drawStyle?;
        private _maxPoints;
        private _autoAdd;
        private _showDrawing;
        private _points;
        private _downPointer;
        private _pickPointer;
        private _darwing;
        private _finished;
        private _canceled;
        private _pointer_down;
        private _pointer_up;
        private _pointer_move;
        private _pointer_cancel;
        private _updatePick;
        private _buildGeometry;
        private _finishDraw;
    }
}
declare namespace CZMAP {
    /**
     * 编辑小部件
     */
    export abstract class EditorWidget<T extends MapView = MapView> extends BaseTool<T> {
        constructor(view: T);
        /** 显示/或者隐藏 */
        abstract visible: boolean;
        /** 销毁对象 */
        destroy(): void;
    }
    type OnTranslateCallback = (position: Point) => void;
    export interface TranslateEditorOption {
        /** 坐标 */
        position: Point;
        /** 姿态信息 */
        pose?: Point;
        /** 坐标偏移 */
        offset?: Point;
        ontranslate: OnTranslateCallback;
    }
    /** 移动编辑部件 */
    export abstract class TranslateEditorWidget<T extends MapView = MapView> extends EditorWidget<T> {
        protected _onTranslate?: OnTranslateCallback;
        constructor(view: T, option: TranslateEditorOption);
        /** 设置/获取当前位置 */
        abstract position: Point;
        /** 设置/获取当前姿态 */
        abstract pose: Point;
        /** 设置/获取坐标偏移 */
        abstract offset: Point;
    }
    export {};
}
declare namespace CZMAP {
    abstract class GridTool<T extends MapView = MapView> extends BaseTool<T> {
        private _rid;
        private _grids;
        constructor(view: T);
        create(option: CoordGridOption): string;
        remove(name: string): void;
        clear(): void;
        protected abstract _createCoordGrid(option: CoordGridOption): CoordGrid;
    }
}
declare namespace CZMAP {
    /**
     * 信息窗口定位
     */
    type Positioning = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-center' | 'center-right' | 'top-left' | 'top-center' | 'top-right';
    /**
     * 信息窗口参数
     */
    interface InfoWindowOption {
        /** 位置 */
        position: Point;
        /** 内容 */
        content: string | HTMLElement;
        /** 不包含默认框架 */
        noDefaultFrame?: boolean;
        /** InfoWindow的DOM ID */
        domID?: string;
        /** 位置 */
        positioning?: Positioning;
        /** 偏移坐标X */
        offsetX?: number;
        /** 偏移坐标Y */
        offsetY?: number;
        /** 关闭中 */
        onClosing?: (iw: InfoWindow<MapView>) => boolean;
        /** 已关闭 */
        onClosed?: (iw: InfoWindow<MapView>) => void;
    }
    /** 信息窗口 */
    abstract class InfoWindow<T extends MapView = MapView> extends BaseTool<T> {
        private _dom;
        private _overlayDom;
        private _contentDom;
        private _arrowDom;
        private _content;
        private _noDefaultFrame;
        private _position;
        private _positioning;
        private _offset;
        private _pixelX;
        private _pixelY;
        private _pixelDirty;
        private _visible;
        protected _hiddenOnMove: boolean;
        static moveDelay: number;
        /** 关闭中,返回ture关闭，返回false，不关闭 */
        private _onClosing?;
        /** 已关闭 */
        private _onClosed?;
        constructor(view: T, option: InfoWindowOption);
        /** 位置 */
        get position(): Point;
        set position(value: Point);
        /** 定位 */
        get positioning(): Positioning;
        set positioning(value: Positioning);
        /** 偏移 */
        get offset(): [number, number];
        set offset(value: [number, number]);
        /** 内容 */
        get content(): string | HTMLElement;
        set content(value: string | HTMLElement);
        /** 是否显示 */
        get visible(): boolean;
        set visible(value: boolean);
        /** 关闭 */
        close(): boolean;
        protected _showDOM(show: boolean): void;
        protected _onPositionChange(): void;
        private _createDom;
        private _updateArrow;
        private _delayMoveHandle;
        protected _updatePosition(x: number, y: number): void;
        private _updatePositionInner;
    }
}
declare namespace CZMAP {
    /**
     * 测量回调参数
     */
    abstract class MeasureCallbackParam {
        /** 测量的点 */
        private _points;
        /** 中心点 */
        private _center;
        /** 距离 */
        private _value;
        constructor(points: Point[], center: Point, value: number);
        /** 测量类型 */
        abstract get type(): ('distance' | 'area' | 'angle');
        /** 测量的点位 */
        get points(): Point[];
        /** 中心点 */
        get center(): Point;
        /** 测量结果 */
        get value(): number;
    }
    /** 距离测量回调 */
    class DistanceCallbackParam extends MeasureCallbackParam {
        /** 水平距离 */
        private _flatDistance;
        /** 最小高程 */
        private _minHeight;
        /** 最大高程 */
        private _maxHeight;
        /** 垂直距离（高度） */
        private _height;
        /** 构造函数 */
        constructor(points: Point[], center: Point, dr: MeasureDistanceResult);
        /** @override */
        get type(): 'distance';
        /** 测量距离 */
        get distance(): number;
        /** 水平距离 */
        get flatDistance(): number;
        /** 垂直距离（高度） */
        get height(): number;
        /** 最小高程 */
        get minHeight(): number;
        /** 最大高程 */
        get maxHeight(): number;
    }
    /** 面积测量回调 */
    class AreaCallbackParam extends MeasureCallbackParam {
        constructor(points: Point[], center: Point, ar: MeasureAreaResult);
        /** @override */
        get type(): 'area';
        /** 面积 */
        get area(): number;
    }
    /** 角度测量回调 */
    class AngleCallbackParam extends MeasureCallbackParam {
        private _heading;
        private _pitch;
        constructor(p0: Point, p1: Point, center: Point, heading: number, pitch: number);
        get type(): 'angle';
        /** 方位角 */
        get heading(): number;
        /** 俯仰角 */
        get pitch(): number;
    }
    type MeasureDistCallback = (args: DistanceCallbackParam) => void;
    type MeasureAreaCallback = (args: AreaCallbackParam) => void;
    type MeasureAngleCallback = (args: AngleCallbackParam) => void;
    interface MeasureIcon {
        img: string;
        offset?: [number, number];
    }
    /** 测量参数 */
    interface MeasureOption {
        /** 标签 */
        label?: boolean;
        /** 标签样式 */
        labelStyle?: {
            /** 文字填充色 */
            fillColor?: Cesium.Color | string;
            pixelOffset?: Cesium.Cartesian2 | {
                x: number;
                y: number;
            };
            /** 水平原点 */
            horizontalOrigin?: HorizontalOrigin;
            /** 垂直原点 */
            verticalOrigin?: VerticalOrigin;
            /** 字体 */
            font?: string;
            /** 文字描边宽度 */
            outlineWidth?: number;
            /** 文字描边颜色 */
            outlineColor?: string;
            /** 背景 */
            background?: boolean;
            /** 背景色 */
            backgroundColor?: string | Cesium.Color;
            /** 背景边框颜色 */
            backgroundBorderColor?: string;
            /** 背景边框宽度 */
            backgroundBorderWidth?: number;
            /** 背景边框半径 */
            backgroundBorderRadius?: number;
        };
        /** 标注坐标偏移 */
        labelOffset?: Point;
    }
    /** 距离测量参数 */
    interface MeasureDistOption extends MeasureOption {
        /** 多段计算 */
        multi?: boolean;
        /** 图标 */
        icons?: {
            /** 开始图标 */
            start?: MeasureIcon;
            /** 结束图标 */
            end?: MeasureIcon;
            /** 中间图标 */
            mid?: MeasureIcon;
        };
        lineStyle?: {
            lineColor?: string;
            lineWidth?: number;
        };
        /** 回调接口 */
        callback?: MeasureDistCallback;
    }
    /** 面积测量参数 */
    interface MeasureAreaOption extends MeasureOption {
        /** 区域样式 */
        areaStyle?: {
            fillColor?: string;
            outlineColor?: string;
            outlineWidth?: number;
        };
        callback?: MeasureAreaCallback;
    }
    /** 角度测量参数 */
    interface MeasureAngleOption extends MeasureOption {
        lineStyle?: {
            lineColor?: string;
            lineWidth?: number;
        };
        callback?: MeasureAngleCallback;
    }
    /** 测量工具分组 */
    const MeasureToolGroup = "measure";
    /**
     * 测量工具
     */
    abstract class MeasureTool<T extends MapView = MapView> extends BaseTool<T> {
        /**
         */
        constructor(view: T);
        protected abstract _onDistDrawing(pts: Point[], option: MeasureDistOption): void;
        protected abstract _onDistFinished(dcp: DistanceCallbackParam, option: MeasureDistOption): void;
        protected abstract _onAreaDrawing(pts: Point[], option: MeasureAreaOption): void;
        protected abstract _onAreaFinished(acp: AreaCallbackParam, option: MeasureAreaOption): void;
        protected abstract _onAngleDrawing(pts: Point[], option: MeasureAngleOption): void;
        protected abstract _onAngleFinished(acp: AngleCallbackParam, option: MeasureAngleOption): void;
        protected abstract _onCancel(): void;
        /**
         * 测量距离
         * @override
         */
        distance(option?: MeasureDistOption): void;
        /**
         * 测量面积
         */
        arae(option?: MeasureAreaOption): void;
        /** 测量角度 */
        angle(option?: MeasureAngleOption): void;
        /** 停止测量 */
        stop(): void;
        /**
         * 清除测量
         */
        abstract clear(): void;
        static formatDistanceText(dist: number, flat: number, height: number): string;
        static formatAreaText(area: number): string;
        static formatAngleText(heading: number, pitch: number): string;
    }
}
declare namespace CZMAP {
    /**
     * 路径漫游事件
     * @events
     */
    export enum PathRoamEvents {
        START = "start",
        STOP = "stop",
        MOVE = "move",
        FORWARD = "forward",
        BACKWARD = "backward",
        CURRENT_TIME = "currentTime",
        SPEED = "speed",
        LOOP = "loop",
        FOLLOW = "follow",
        LOCK_VIEW = "lockview",
        FIRST_VIEW = "firstview",
        TRACK_TRAGET = "trackTarget",
        SHOW_LINE = "showLine",
        LINE_WIDTH = "lineWidth",
        LINE_COLOR = "lineColor",
        ENTER_HOT_POINT = "enter_hotpoint",
        LEAVE_HOT_POINT = "leave_hotpoint"
    }
    export enum PathRoamLoopType {
        /** 不循环 */
        NONE = 0,
        /** 原路返回 */
        RETURN = 1,
        /** 回到起点 */
        RETURN_TO_START = 2
    }
    export type PathDataPoint = {
        position: Point;
        target?: Point;
        speed?: number;
        time?: number;
    };
    export type PathDataPointOld = {
        cameraPoint: Point;
        targetPoint?: Point;
        speed?: number;
    };
    export type PathDataPointLike = (PathDataPoint & PathDataPointOld) | Point;
    export type PathRomaData = PathDataPointLike[];
    /**
     * 路径点类
     */
    export class PathNode {
        /** 位置 */
        position: Point;
        /** 三维位置 */
        position3D: Cesium.Cartesian3;
        /** 目标点 */
        target?: Point;
        /** 时间，单位：秒 */
        time?: number;
        /** 速度 */
        speed?: number;
        /** 当前点到上一个点的距离 */
        distance: number;
        /** 当前到七点的距离 */
        distanceTotal: number;
        /** 构造一个路径点位 */
        constructor(data: PathDataPointLike);
    }
    /**
     * 热点数据
     */
    export interface HotPointData extends Record<string, any> {
        /** 位置坐标 */
        position: Point;
        /** 自定义热时长 */
        duration?: number;
    }
    /** 热点对象 */
    class HotPoint {
        position: Cesium.Cartesian3;
        time: number;
        data: HotPointData;
        constructor(data: HotPointData);
    }
    export type PathRoamOptions = {
        /**
         * 指定漫游速度
         */
        speed?: number;
        /**
         * 漫游偏移
         */
        offset?: Point;
        /** 跳转到视角 */
        jumpToPath?: boolean;
        /**
         * 指定漫游时使用的图标
         */
        icon?: {
            /**
             * 图标路径
             */
            url: string;
            /**
             * 图标偏移
             */
            offset?: [number, number];
            /** 图标宽度 */
            width?: number;
            /** 图标高度 */
            height?: number;
        };
        /** 指定漫游时使用的模型 */
        model?: {
            /** 模型路径 */
            url?: string;
            uri?: string;
            /** 模型缩放 */
            scale?: number;
            /** 模型旋转 */
            rotate?: Point;
        };
        /** 指定漫游时使用的label */
        label?: {
            /** 显示文字 */
            text?: string;
            /** 字体 */
            font?: string;
            /** 模型缩放 */
            scale?: number;
            /**
             * label偏移
             */
            offset?: [number, number];
            /** 颜色 */
            color?: string;
            /** 背景颜色 */
            backgroundColor?: string;
        };
        /** 轨迹线 */
        trackLine?: {
            show?: boolean;
            lineColor?: string;
            lineWidth?: number;
        };
        /** 热点 */
        hotPoints?: HotPointData[];
        /** 热点触发时长，单位：秒 */
        hotDuration?: number;
    };
    /**
     * 路径漫游对象
     */
    export abstract class PathRoam<T extends MapView = MapView> extends BaseTool<T> {
        /**  */
        protected _play: boolean;
        /** 视角锁定 */
        protected _lock: boolean;
        /** 相机跟随 */
        protected _follow: boolean;
        /** 第一人称 */
        protected _first: boolean;
        /** 追踪 */
        protected _trackTarget: boolean;
        /** 模型始终向前 */
        protected _modelForward: boolean;
        /** 方向 */
        protected _dir: number;
        /** 速度 */
        protected _speed: number;
        /** 循环模式 */
        protected _loop: PathRoamLoopType;
        /** 显示线条 */
        protected _showLine: boolean;
        /** 线宽 */
        protected _lineWidth: number;
        /** 线颜色 */
        protected _lineColor: string;
        /** 路径节点列表 */
        protected _nodes: PathNode[];
        protected _hotPoints: HotPoint[];
        /** 热点持续时间 */
        protected _hotDuration: number;
        /** 自定义视角偏移 */
        protected _eye_offset: Point;
        /** 路径的开始时刻（秒） */
        protected _begin_seconds: number;
        /** 路径的接受时刻（秒） */
        protected _end_seconds: number;
        /** 路径时长（秒） */
        protected _total_seconds: number;
        /** 路径漫游的当前时刻（秒） */
        protected _current_seconds: number;
        /** 当前位置 */
        protected _current_position: Point;
        /**
         * 构造函数，构造漫游对象
         * @param view
         */
        constructor(view: T);
        /**
         * 创建漫游路径
         * @param path 漫游路径
         * @param options 漫游参数
         */
        open(path: PathRomaData, options: PathRoamOptions): void;
        /**
         * 关闭路径漫游
         */
        close(): void;
        addHotPoint(hpd: HotPointData): void;
        /**
         * 添加热点，当漫游至热点附近时将会触发热点'hotpoint'事件
         *
         * @example
         * var path = view.createPathRoam();
         * path.addHotPoints(...);
         * path.on('hotpot', (hp) => ...);
         *
         * @param pts 热点列表
         */
        addHotPoints(pts: HotPointData[]): void;
        /**
         * 移除所有热点
         */
        clearHotPoints(): void;
        calcHotRadius(): void;
        /**
         * 开始漫游
         */
        start(): void;
        /**
         * 暂停漫游
         */
        pause(): void;
        /**
         * 恢复漫游
         */
        resume(): void;
        /**
         * 前进
         */
        forward(): void;
        /**
         * 后退
         */
        backward(): void;
        /** 漫游时的偏移 */
        get offset(): Point;
        set offset(v: Point);
        /**是否正在漫游 */
        get playing(): boolean;
        /** 漫游速度 */
        set speed(v: number);
        get speed(): number;
        /** 漫游循环方式 */
        set loop(v: PathRoamLoopType);
        get loop(): PathRoamLoopType;
        /** 漫游时相机跟随 */
        set follow(v: boolean);
        get follow(): boolean;
        /** 相机跟随时锁定视图 */
        set lockview(v: boolean);
        get lockview(): boolean;
        /** 相机跟随时使用第一人称视角 */
        set firstview(v: boolean);
        get firstview(): boolean;
        set trackTarget(v: boolean);
        get trackTarget(): boolean;
        /** 模型始终向前 */
        set modelForward(v: boolean);
        get modelForward(): boolean;
        /** 显示漫游路径 */
        set showline(v: boolean);
        get showline(): boolean;
        /** 漫游路径线宽 */
        set lineWidth(v: number);
        get lineWidth(): number;
        /** 漫游路径线颜色 */
        set lineColor(v: string);
        get lineColor(): string;
        /** 漫游总时间，秒数 */
        get totalTime(): number;
        /** 当前时间，秒数 */
        get currentTime(): number;
        set currentTime(v: number);
        /** 当前位置 */
        get currentPosition(): Point;
        /** 当前为路径段 */
        get currentSegment(): number;
        /**
         * 释放资源
         */
        protected _disposeInternal(): void;
        /**
         * 解析构建路径数据
         */
        protected buildRoamPath(data: PathRomaData, speed?: number): PathNode[];
        private _currentHotPoint;
        private _on_pathroam_move;
        /** 子类初始化漫游对象 */
        protected abstract _init(options: PathRoamOptions): void;
        /** 子类释放漫游资源 */
        protected abstract _release(): void;
        /**
         * 创建路径点
         * @param pt 输入参数
         * @returns 路径点对象
         */
        protected abstract _createPathNode(pt: PathDataPointLike): PathNode;
        /** 计算两点间距离 */
        protected abstract _calcDistance(a: PathNode, b: PathNode): number;
    }
    export {};
}
declare namespace CZMAP {
    enum TunnelProperty {
        VISIBLE = "visible",
        ANIMATION = "animation",
        SPEED = "speed"
    }
    /**
     * 巷道方向
     */
    enum TunnelDir {
        /**
         * 无方向
         */
        NONE = 0,
        /**
         * 向前
         */
        FORWARD = 1,
        /**
         * 向后
         */
        BACKWARD = 2
    }
    /**
     * 巷道效果选项
     */
    type TunnelEffctOptions = {
        model: any;
        /** 模型属性的主键 */
        modelkeyfield?: string;
        /** 贴图图片 */
        image: string;
        /** 方向属性数据 */
        data: [];
        /** 方向数据的主键 */
        datakeyfield?: string;
        /** 方向字段 */
        dirfield?: string;
        /** 方向值映射 */
        dirmap?: {};
        /** 颜色字段 */
        colorfield?: string;
        /** 颜色值映射 */
        colormap?: {};
        /** 颜色 */
        color?: string;
    };
    abstract class TunnelEffct<T extends MapView = MapView> extends BaseTool<T> {
        /**
         */
        constructor(view: T);
        /**
         * 初始化
         */
        abstract init(options: TunnelEffctOptions): void;
        /**
         * 关闭
         */
        abstract close(): void;
        /**
         * 设置是否可见
         * @type {Boolean}
         */
        set visible(v: any);
        get visible(): any;
        /**
         * 设置是否运行动画
         * @type {Boolean}
         */
        set animation(v: any);
        get animation(): any;
        /**
         * 动画速度
         */
        set speed(v: number);
        get speed(): number;
        /**
         * @abstract
         * @protected
         */
        protected _onVisibleChanged(): void;
        /**
         * @abstract
         * @protected
         */
        protected _onAnimationChanged(): void;
        /**
         * @private
         */
        protected _disposeInternal(): void;
    }
}
declare namespace CZMAP {
    /**
     * 巷道模型（双层模型）透视（透明）处理类
     */
    abstract class TunnelTransparent<T extends MapView = MapView> extends BaseTool<T> {
        constructor(view: T);
        /**
         * 初始化
         * @param {*} options
         */
        init(options: any): void;
        /**
         * 判断是否存在数据
         * @param options
         */
        checkExist(options: any): void;
        /**
         * 关闭
         */
        close(): void;
        /**
         * 是否启用透明
         */
        set enable(v: any);
        get enable(): any;
        protected _disposeInternal(): void;
        abstract _handleEnable(): void;
    }
}
declare namespace CZMAP {
    /**
     * 平面切割
     * @internal
     */
    class AxisClipPlane3D extends AxisClipPlane<MapView3D> {
        private _dim;
        private _plane;
        private _entity;
        private _planeGraphics;
        constructor(view: MapView3D, box: BoundingBox);
        private _onPropertyChange;
        private _updateAxis;
        protected _disposeInternal(): void;
    }
    /**
     * 路径切割
     * @internal
     */
    class PathClipPlane3D extends PathClipPlanes<MapView3D> {
        private _entity;
        private _wallGraphics;
        constructor(view: MapView3D, box: BoundingBox);
        private _onPropertyChange;
        private _updateWall;
        /** @override */
        protected _onPathChanged(): void;
        protected _disposeInternal(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class CoordGrid3D extends CoordGrid<MapView3D> {
        private _visible;
        private _entities;
        constructor(view: MapView3D);
        build(option: CoordGridOption): void;
        close(): void;
        getVisible(): boolean;
        setVisible(value: boolean): void;
        private _addPloyline;
        /**
         * 添加单点和文字
         * @param pos Cartesian3
         * @param text 文本信息
         * @return Entity
         */
        private _addSinglePointWithText;
    }
}
declare namespace CZMAP {
    /** @internal */
    class DrawTool3D extends DrawTool<MapView3D> {
        private _czsource;
        private _entities;
        /**
         *
         */
        constructor(view: MapView3D);
        /**
         * 添加几何
         * @param {*} geo
         * @param {*} style
         */
        add(geo: Geometry, style?: DrawStyle, group?: string): string;
        /**
         *
         */
        addPoint(geo: GeoPoint, style?: DrawStyle, group?: string): string;
        /**
         *
         */
        addPolyline(geo: GeoPolyline, style?: DrawStyle, group?: string): string;
        /**
         *
         */
        addPolygon(geo: GeoPolygon, style: DrawStyle, group?: string): string;
        /**
         *
         */
        addRect(geo: GeoRectangle, style: DrawStyle, group?: string): string;
        addCircle(geo: GeoCircle, style: DrawStyle, group?: string): string;
        addDynamicCircle(geo: GeoCircle, dynStyle?: DynamicCircleOption, group?: string): string;
        private _addPolygon;
        /**
         * 移除
         */
        remove(id: string): void;
        private _drawingEntity;
        protected _pick(x: number, y: number): Promise<Point>;
        protected _updateDrawing(type: GeometryType, pts: Point[]): void;
        protected _clearDrawing(): void;
    }
}
declare namespace CZMAP {
    /**
     * 平移编辑部件
     * @internal
     */
    class TranslateEditorWidget3D extends TranslateEditorWidget<MapView3D> {
        private _model;
        private _primitives;
        private _axisX;
        private _axisY;
        private _axisZ;
        private _axisXY;
        private _axisYX;
        private _axisXZ;
        private _axisZX;
        private _axisYZ;
        private _axisZY;
        private _point;
        /** 位置坐标 */
        private _position;
        /** 姿态 */
        private _pose;
        /** 坐标偏移 */
        private _offset;
        /** 坐标轴的实际位置 */
        private _realPosition;
        /** 修正高程值 */
        private _enableRectifyHeight;
        /** 启用旋转 */
        private _enableRotation;
        /** 坐标轴显示缩放比例 */
        private _axisScale;
        /** 笛卡尔坐标位置 */
        private _axisPosition;
        /** 变换矩阵 */
        private _axisMatrix;
        /** 变化逆矩阵 */
        private _axisMatrixInv;
        /** 坐标轴矩阵，增加缩放 */
        private _axisMatrixScaled;
        /** 相机位置 */
        private _cameraPosition;
        /** 用于计算像素大小的虚拟包围盒 */
        private _fakeBoundSphere;
        /** 拾取射线 */
        private _pickRay;
        private _handler;
        /**
         * 构造平移部件
         * @param view 视图对象
         * @param option
         */
        constructor(view: MapView3D, option?: TranslateEditorOption);
        /** 显示/隐藏 */
        get visible(): boolean;
        set visible(v: boolean);
        /** 位置 */
        get position(): Point;
        set position(p: Point);
        get pose(): Point;
        set pose(v: Point);
        get offset(): Point;
        set offset(o: Point);
        get enableRectifyHeight(): boolean;
        set enableRectifyHeight(e: boolean);
        get enableRotation(): boolean;
        set enableRotation(e: boolean);
        /** 销毁对象 */
        destroy(): void;
        /** 创建坐标轴对象 */
        private _createAxis;
        private _bindEvent;
        /** 绑定鼠标事件和渲染事件 */
        private _bindEvents;
        /** 释放事件绑定 */
        private _releaseEvents;
        /** 是否拖拽中 */
        private _isDragging;
        /** 拖拽矩阵 */
        private _dragMatrix;
        /** 拖拽逆矩阵 */
        private _dragMatrixInv;
        /** 拖拽用地理坐标 */
        private _dragBegin;
        /** 拖拽用地理坐标 */
        private _dragCartographic;
        /** 拾取结果 */
        private _pickResult;
        private _PickResultXY;
        private _PickResultYZ;
        private _PickResultZX;
        /** 启用/禁用交互 */
        private _enableInputs;
        /** 鼠标按下事件处理函数，处理开始拖拽动作 */
        private _onMouseDown;
        /** 鼠标弹起事件处理函数 */
        private _onMouseUp;
        private _draggingTarget;
        private _draggingTargetLocal;
        /** 坐标移动事件处理函数 */
        private _onMouseMoved;
        /**
         * 更新坐标轴颜色
         * @param axis 选中的坐标轴
         */
        private _udpateAxisColor;
        /**
         * 拾取当前鼠标位置的坐标轴
         * @param ray 鼠标摄像，本地坐标空间
         * @returns
         */
        private _getPicked;
        /**
         * 在每一帧计算模型缩放，包正屏幕大小一致
         * @returns
         */
        private _preUpdate;
        /** 更新坐标轴缩放比 */
        private _updateScale;
        /** 更新位置坐标 */
        private _updatePosition;
        private _updatePose;
        private _hpr;
        private _orientation;
        private _orientationLocal;
        /** 更新坐标（笛卡尔坐标） */
        private _udpateMatrix;
        /** 应用矩阵到模型上 */
        private _applyMatrix;
    }
}
declare namespace CZMAP {
    /** @internal */
    class GridTool3D extends GridTool<MapView3D> {
        /**
         * 构造网格绘制工具
         * @param view
         */
        constructor(view: MapView3D);
        _createCoordGrid(option: CoordGridOption): CoordGrid;
    }
}
declare namespace CZMAP {
    /** @internal */
    class InfoWindow3D extends InfoWindow<MapView3D> {
        private _postRenderHandle;
        constructor(view: MapView3D, option: InfoWindowOption);
        close(): boolean;
        private _onPostRender;
    }
}
declare namespace CZMAP {
    /**
     * 三维测量工具
     * @internal
     */
    class MeasureTool3D extends MeasureTool<MapView3D> {
        private _entities;
        /**
         */
        constructor(view: MapView3D);
        distance(option?: MeasureDistOption): void;
        protected _onDistDrawing(pts: Point[], option: MeasureDistOption): void;
        protected _onDistFinished(dcp: DistanceCallbackParam, option: MeasureDistOption): void;
        arae(option?: MeasureAreaOption): void;
        protected _onAreaDrawing(pts: Point[], option: MeasureAreaOption): void;
        protected _onAreaFinished(acp: AreaCallbackParam, option: MeasureAreaOption): void;
        angle(option?: MeasureAngleOption): void;
        protected _onAngleDrawing(pts: Point[], option: MeasureAngleOption): void;
        protected _onAngleFinished(acp: AngleCallbackParam, option: MeasureAngleOption): void;
        protected _onCancel(): void;
        /**
         * 清除测量
         */
        clear(): void;
        private _calcLabelPosition;
        private _text;
        private _center;
        private _currentLabel;
        private _createDrawingLabel;
        private _finishDrawingLabel;
        private _removeDrawingLabel;
        private _createIcon;
    }
}
declare namespace CZMAP {
    /**
     * 遍历所有Primitive
     * @param {PrimitiveCollection} ps
     * @param {Model|Array<Model>} ms
     * @param {function} cb 回调函数
     */
    function forEachModelPrimitive(ps: any, ms: any, cb: any): void;
}
declare namespace CZMAP {
    /** @internal */
    class PathRoam3D extends PathRoam<MapView3D> {
        /**
         */
        private view3d;
        /** 上一帧时间 */
        private _last_time;
        private _temp_pos;
        private _temp_dir;
        private _temp_tar;
        private _temp_vec;
        private _temp_mat;
        private _temp_ori;
        private _temp_ori2;
        private _temp_pos_c;
        private _temp_tar_c;
        private _temp_offset;
        private _temp_matrix3;
        private _temp_matrix4;
        private _temp_inv_matrix4;
        /**
         * 当前路径的包围球
         */
        private _sphere;
        private _entityRotate;
        private _entity;
        private _line;
        private _sample_pos;
        private _sample_dir;
        private _sample_ori;
        /**
         */
        constructor(view: MapView3D);
        /**
         * 创建漫游路径
         */
        protected _init(options: PathRoamOptions): void;
        /**
         * 关闭路径漫游
         */
        protected _release(): void;
        /** 当前时间 */
        set currentTime(v: number);
        get currentTime(): number;
        /**
         *
         * @param {*} scene
         * @param {*} nowTime
         */
        _tick(): void;
        private _isFirstFollow;
        private _lastFollowOffset;
        private _lastMode;
        private _update;
        get _czcamera(): Cesium.Camera;
        /**
         * 跟随
         */
        set follow(v: boolean);
        /**
         * 跟随
         */
        get follow(): boolean;
        /**
         * 第一人称
         */
        set showline(v: boolean);
        /**
         * 第一人称
         */
        get showline(): boolean;
        /**
         * 线宽
         */
        set lineWidth(v: number);
        get lineWidth(): number;
        /**
         * 线颜色
         */
        set lineColor(v: string);
        get lineColor(): string;
        /**
         * 获取漫游时的偏移
         */
        get offset(): Point;
        /**
         * 设置漫游时的偏移
         */
        set offset(v: Point);
        /**
         * 构建漫游路径
         */
        private buildPath;
        /**
         * 构建漫游插值对象
         */
        private buildSampled;
        /**
         * 创建漫游模型
         */
        private createModel;
        /**
         * 创建漫游线
         */
        private createLine;
        /**
         * 创建路径点
         * @param pt 输入参数
         * @returns 路径点对象
         */
        protected _createPathNode(pt: PathDataPointLike): PathNode;
        /** 计算两点间距离 */
        protected _calcDistance(a: PathNode, b: PathNode): number;
    }
}
declare namespace CZMAP {
    /**
     * 基于巷道的纹理动画
     * @internal
     */
    class TunnelEffct3D extends TunnelEffct<MapView3D> {
        /**
         */
        private view3d;
        private models;
        private params;
        private scene;
        private image;
        private uniforms;
        private canvas;
        private ctx;
        /**
         */
        private texs;
        /**
         * 模型的主键字段
         * @type {String}
         */
        private model_key_field;
        /**
         * 属性数据的主键字段
         */
        private data_key_field;
        /**
         */
        constructor(view: MapView3D);
        /**
         *
         */
        init(options: TunnelEffctOptions): void;
        close(): void;
        /**
         * 显示动态纹理
         */
        show(): void;
        /**
         * 隐藏动态纹理（还原）
         */
        hide(): void;
        /**
         * 定时器句柄
         */
        private loopHandle;
        /**
         * 开始动画
         */
        start(): void;
        /**
         * 停止动画
         */
        stop(): void;
        /**
         * @abstract
         * @protected
         */
        _onVisibleChanged(): void;
        /**
         * @abstract
         * @protected
         */
        _onAnimationChanged(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class TunnelTransparent3D extends TunnelTransparent<MapView3D> {
        /**
         */
        private view3d;
        /**
         * 待处理的模型
         */
        private models;
        private scene;
        constructor(view: MapView3D);
        private _commands;
        /**
         * 初始化
         * @param {*} options
         */
        init(options: any): void;
        /**
         * 判断是否存在数据
         * @param options
         */
        checkExist(options: any): boolean;
        /**
         * 关闭
         */
        close(): void;
        _handleEnable(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class CoordGridUE extends CoordGrid<MapViewUE> {
        private _visible;
        private _grid;
        constructor(view: MapViewUE);
        getVisible(): boolean;
        setVisible(value: boolean): void;
        build(option: CoordGridOption): void;
        close(): void;
    }
}
declare namespace CZMAP {
    /** @internal */
    class DrawToolUE extends DrawTool<MapViewUE> {
        private _items;
        /**
         *
         */
        constructor(view: MapViewUE);
        private _syncBindEvents;
        /**
         * 添加几何
         * @param {*} geo
         * @param {*} style
         */
        add(geo: Geometry, style?: DrawStyle, group?: string): string;
        /**
         *
         */
        addPoint(geo: GeoPoint, style?: DrawStyle, group?: string): string;
        /**
         *
         */
        addPolyline(geo: GeoPolyline, style?: DrawStyle, group?: string): string;
        /**
         *
         */
        addPolygon(geo: GeoPolygon, style: DrawStyle, group?: string): string;
        /**
         *
         */
        addRect(geo: GeoRectangle, style: DrawStyle, group?: string): string;
        addCircle(geo: GeoCircle, style: DrawStyle, group?: string): string;
        addDynamicCircle(geo: GeoCircle, dynStyle?: DynamicCircleOption, group?: string): string;
        private _addPolygon;
        /**
         * 移除
         */
        remove(id: string): void;
        private _outline;
        protected _pick(x: number, y: number): Promise<Point>;
        protected _updateDrawing(type: GeometryType, pts: Point[]): void;
        protected _clearDrawing(): void;
        private _createGeometryUE;
        private _updatePoint;
        private _updatePolyline;
        private _updatePolygon;
        private _updateCircle;
        private _updateRectangle;
    }
}
declare namespace CZMAP {
    /** @internal */
    class GridToolUE extends GridTool<MapViewUE> {
        /**
         * 构造网格绘制工具
         * @param view
         */
        constructor(view: MapViewUE);
        _createCoordGrid(option: CoordGridOption): CoordGrid;
    }
}
declare namespace CZMAP {
    /** @internal */
    class InfoWindowUE extends InfoWindow<MapViewUE> {
        private _id;
        private _uvapi;
        constructor(view: MapViewUE, option: InfoWindowOption);
        static hiddenOnMove: boolean;
        close(): boolean;
        protected _onPositionChange(): void;
    }
}
declare namespace CZMAP {
    /**
     * 三维测量工具
     * @internal
     */
    class MeasureToolUE extends MeasureTool<MapViewUE> {
        /**
         */
        constructor(view: MapViewUE);
        distance(option?: MeasureDistOption): void;
        protected _onDistDrawing(pts: Point[], option: MeasureDistOption): void;
        protected _onDistFinished(dcp: DistanceCallbackParam, option: MeasureDistOption): void;
        arae(option?: MeasureAreaOption): void;
        protected _onAreaDrawing(pts: Point[], option: MeasureAreaOption): void;
        protected _onAreaFinished(acp: AreaCallbackParam, option: MeasureAreaOption): void;
        angle(option?: MeasureAngleOption): void;
        protected _onAngleDrawing(pts: Point[], option: MeasureAngleOption): void;
        protected _onAngleFinished(acp: AngleCallbackParam, option: MeasureAngleOption): void;
        protected _onCancel(): void;
        /**
         * 清除测量
         */
        clear(): void;
        private _items;
        private _calcLabelPosition;
        private _currentLabel;
        private _createDrawingLabel;
        private _updateDrawingLabel;
        private _removeDrawingLabel;
        private _createIcon;
    }
}
declare namespace CZMAP {
    /** @internal */
    class PathRoamUE extends PathRoam<MapViewUE> {
        private _uvroam;
        constructor(view: MapViewUE);
        protected _init(option: PathRoamOptions): void;
        protected _release(): void;
        /**
         * 开始漫游
         */
        start(): void;
        /**
         * 暂停漫游
         */
        pause(): void;
        /**
         * 恢复漫游
         */
        resume(): void;
        /**
         * 前进
         */
        forward(): void;
        /**
         * 后退
         */
        backward(): void;
        set currentTime(v: number);
        get currentTime(): number;
        /**
         * 设置漫游时的偏移
         */
        set offset(v: Point);
        protected _execute(data: any): void;
        protected _createPathNode(pt: PathDataPointLike): PathNode;
        protected _calcDistance(a: PathNode, b: PathNode): number;
        notify_pathroam(info: NotifyRtcPathRoam): void;
    }
}
declare namespace CZMAP {
    /**
     * 数组工具
     */
    class ArrayUtils {
        /**
         * 比较两个数组
         * @param a1
         * @param a2
         */
        static equals(a1: any[], a2: any[]): boolean;
        /** 移除数组指定对象 */
        static removeItem<T>(array: T[], item: T): void;
    }
}
interface Array<T> {
    last(): T | undefined;
    clear(): void;
}
declare namespace CZMAP {
    enum Axis {
        AXIS_X = 0,
        AXIS_Y = 1,
        AXIS_Z = 2
    }
    namespace Axis {
        function parser(val: number | string): Axis;
    }
}
declare namespace Cesium {
    interface EntityCluster {
        _labelCollection: LabelCollection;
        _billboardCollection: BillboardCollection;
        _pointCollection: PointPrimitiveCollection;
        _clusterDirty: boolean;
        update(frameState: any): void;
    }
    interface Label {
        clusterShow: boolean;
        _glyphs: [];
    }
    interface Scene {
        pixelRatio: number;
    }
}
declare const EntityClusterUpdate: (frameState: any) => void;
declare namespace CZMAP {
    class Cluster3D {
        private _view3d;
        private _czviewer;
        private _datasource;
        private _handler;
        /** 最大爆炸数量 */
        private _maxStarBurst;
        /** 聚合数字字体大小 */
        private _numFontSize;
        /** 聚合数字颜色 */
        private _numColor;
        /** 聚合数字背景色 */
        private _numBkColor;
        private _sbs;
        constructor(view3d: MapView3D, ds: Cesium.DataSource);
        set maxStarBurst(num: number);
        get maxStarBurst(): number;
        set numFontSize(size: number);
        get numFontSize(): number;
        set numColor(color: string);
        get numColor(): string;
        set numBkColor(color: string);
        get numBkColor(): string;
        private _setupCluster3D;
        private _onMoveStart;
        private _onMouseWheel;
        private _onMouseMove;
        private _onLeftClick;
        private _cesiumEntityClusterCustom;
    }
}
declare namespace CZMAP {
    /** 聚合图标选项 */
    interface ClusterIconOption {
        /** 图标 */
        url: string;
        /** 数量 */
        num: number;
        /** 数量文字颜色 */
        numColor?: string;
        /** 数量背景颜色 */
        numBkColro?: string;
        /** 数量字体大小 */
        numFontSize?: number;
    }
    /** 聚合图标构建器，构建在右上角显示聚合数量的聚合图标 */
    class ClusterIconCreater {
        private _maxCache;
        private _lowWater;
        private _cache;
        constructor();
        /** 请求聚合图标 */
        requestIcon(option: ClusterIconOption): Promise<HTMLCanvasElement>;
        private genkey;
        private get;
        private put;
        private requestImage;
    }
    /** 全局聚合图标构建器 */
    const clusterIconCreater: ClusterIconCreater;
}
declare namespace CZMAP {
    /** 色表项 */
    type ColorCell = {
        /** 最小值 */
        min: number;
        /** 最大值 */
        max: number;
        /** 当前颜色 */
        color: string;
        /** 颜色分量 */
        rgba: number[];
    };
    enum ColorTableType {
        /** 分段色表 */
        PIECEWISE = "piecewise",
        /** 连续色表 */
        CONTINUOUS = "continuous"
    }
    interface ColorTableOption {
        defaultColor?: string;
    }
    abstract class ColorTable {
        /** 默认颜色 */
        private _default;
        constructor(option: ColorTableOption);
        /** 创建分段色表 */
        static createPiecewise(colors: PiecewiseColorItem[], defaultColor?: string): PiecewiseColorTable;
        /** 创建连续色表 */
        static createContinuous(colors: string[], min: number, max: number): ContinuousColorTable;
        abstract get type(): ColorTableType;
        /** 获取默认颜色 */
        get default(): ColorCell;
        /** 根据值获取css颜色字符串 */
        getCssColor(val: number): string;
        /** 根据值获取颜色分量 */
        getColorByte(val: number): number[];
        protected abstract _find(val: number): ColorCell;
    }
    type PiecewiseColorItem = {
        /** 最小值 */
        min: number;
        /** 最大值 */
        max: number;
        /** 当前颜色 */
        color: string;
    };
    interface PiecewiseColorTableOption extends ColorTableOption {
        colors: PiecewiseColorItem[];
    }
    class PiecewiseColorTable extends ColorTable {
        private _items;
        constructor(option: PiecewiseColorTableOption);
        get type(): ColorTableType;
        get colors(): ColorCell[];
        /** 转为渐变色表 */
        toContinuous(vmin: number, vmax: number, colorNum: number, filter: number): Uint8ClampedArray;
        protected _find(val: number): ColorCell;
    }
    interface ContinuousColorTableOption extends ColorTableOption {
        colors: string[];
        min: number;
        max: number;
    }
    class ContinuousColorTable extends ColorTable {
        private _items;
        private _min;
        private _max;
        constructor(option: ContinuousColorTableOption);
        get type(): ColorTableType;
        protected _find(val: number): ColorCell;
    }
}
declare namespace CZMAP {
    interface GridLineInfo {
        value: number;
        positions: Cesium.Cartesian3[];
    }
    interface GridPointInfo {
        text: string;
        position: Cesium.Cartesian3;
        pixelOffset: [number, number];
    }
    interface GridData {
        center: Cesium.Cartesian3;
        lines: GridLineInfo[];
        points: GridPointInfo[];
    }
    class CoordGridBuild {
        private _dataBox;
        private _dispBox;
        private _dmin;
        private _dsiz;
        private _pmin;
        private _psiz;
        private _fixedNum;
        option: GridOption;
        center: Cesium.Cartesian3;
        lines: GridLineInfo[];
        points: GridPointInfo[];
        build(option: GridOption): GridData;
        private _lineAxis;
        private _getRealValue;
    }
}
declare namespace CZMAP {
    enum DynamicDataType {
        ARRAY_BUFFER = "arraybuffer",
        JSON = "json",
        TEXT = "text",
        XML = "xml"
    }
    type DynamicDataCallback = (data: any) => void;
    class DynamicData {
        private _urls;
        constructor();
        reg(url: string, handle: DynamicDataCallback, type?: DynamicDataType, interval?: number): void;
        unReg(url: string, handle: DynamicDataCallback, type?: DynamicDataType, interval?: number): void;
        unRegAll(): void;
        /**
         *
         * @param {*} url
         * @param {*} create
         * @return {Array}
         */
        private get;
    }
}
declare namespace CZMAP {
    class EventTargetHelper {
        private _target;
        private _enable;
        private _events;
        get enable(): boolean;
        set enable(enable: boolean);
        constructor(target?: globalThis.EventTarget);
        setTarget(target: globalThis.EventTarget): void;
        on<K extends keyof HTMLElementEventMap>(type: K, listener: (e: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        un(type: string): void;
        unAll(): void;
    }
}
declare namespace CZMAP {
    class GeoMath {
        static checkPoint(pt: Point): void;
        /** 复制点 */
        static clone(p: Point, r?: Point): Point;
        /**
         * 两个点相加
         * @param a
         * @param b
         * @param r
         */
        static add(a: Point, b: Point, r?: Point): Point;
        /**
         * 两个点相减
         * @param a
         * @param b
         * @param r
         */
        static sub(a: Point, b: Point, r?: Point): Point;
        static mul(a: Point, b: Point, r?: Point): Point;
        static mulScalar(a: Point, b: number, r?: Point): Point;
        static div(a: Point, b: Point, r?: Point): Point;
        /** 计算两点的立方距离 */
        static squareDistance(a: Point, b: Point): number;
        /** 计算两点的距离 */
        static distance(a: Point, b: Point): number;
        /** 计算向量的立方长度 */
        static squareLength(pt: Point): number;
        /** 计算向量的长度 */
        static calcLength(pt: Point): number;
        static tempCartographic: Cesium.Cartographic;
        /**
         * 笛卡尔坐标转地理坐标
         * @param pt 笛卡尔坐标
         * @returns 地理坐标
         */
        static fromCartesian3(pt: Cesium.Cartesian3, result?: Point): Point;
        static isEquals(p0?: Readonly<Point>, p1?: Readonly<Point>): boolean;
    }
}
declare namespace CZMAP {
    type PointLike = {
        x: number;
        y: number;
        z: number;
    };
    class ExistAddResult {
        id: number;
        exist: boolean;
        constructor(id: number, exist?: boolean);
    }
    class GridPointMap<T extends PointLike> {
        private mTolerance;
        private mCellSize;
        private mNodes;
        private mGrids;
        constructor(tolerance?: number);
        setTolerance(tolerance?: number): void;
        add(pt: T): ExistAddResult;
        add2(x: number, y: number, z: number): ExistAddResult;
        find(pt: PointLike): number;
        find2(x: number, y: number): number;
        getPoints(): T[];
        getPoint(index: number): T;
        clear(): void;
        private calcKey;
        private calcIndex;
        private addGrid;
    }
}
declare namespace CZMAP {
    class HttpArgs {
        url: string;
        data: object;
        constructor(url: string, data?: object);
    }
    class HttpUtil {
        private static _getCookiesObj;
        private static _initOptions;
        static get(args: HttpArgs, options?: any): Promise<Response>;
        static post(args: HttpArgs, options?: any): Promise<Response>;
        static put(args: HttpArgs, options?: any): Promise<Response>;
    }
    function fetchJSON(input: RequestInfo, init?: RequestInit): Promise<any>;
    function fetchJSON5(input: RequestInfo, init?: RequestInit): Promise<any>;
}
declare namespace CZMAP {
    type Point2 = [number, number];
    export class KDBush {
        private mNodeSize;
        private mIDs;
        private mCoords;
        init(pts: Point2[], nodeSize?: number): void;
        get points(): Point2[];
        nearest(x: number, y: number, to: number): number;
        range(extent: Extent): number[];
        search(env: Extent, result: (pt: Point2, id: number) => void): void;
        private sort;
        private select;
        private swapItem;
    }
    export {};
}
declare namespace CZMAP {
    class MeasureDistanceResult {
        /** 距离 */
        distance: number;
        /** 水平距离 */
        flatDistance: number;
        /** 最小高程 */
        minHeight: number;
        /** 最大高程 */
        maxHeight: number;
        /** 垂直距离（高度） */
        height: number;
        updateHeight(value: number): void;
        inc(added: MeasureDistanceResult): this;
    }
    class MeasureAreaResult {
        /** 面积 */
        area: number;
        constructor(area?: number);
    }
    class MeasureAngleResult {
        heading: number;
        pitch: number;
        constructor(heading?: number, pitch?: number);
    }
    class MeasureUtils {
        /**
         * 计算地球两点间的距离
         * @param p0 起点
         * @param p1 终点
         * @param ellipsold 椭球
         * @returns 距离信息
         */
        static computeDistance(p0: Point, p1: Point, ellipsold?: Cesium.Ellipsoid): MeasureDistanceResult;
        /**
         * 计算线的总长度
         * @param pts 线
         * @returns 距离信息
         */
        static computeDistances(pts: Point[]): MeasureDistanceResult;
        /**
         * 计算点的中心点坐标
         * @param pts 点列表
         * @returns 中心点
         */
        static computeCenter(pts: Point[]): Point;
        /**
         * 自动格式化距离信息
         * @param distance 距离
         * @returns
         */
        static formatDistances(distance: number): string;
        static computeArea(pts: Point[]): MeasureAreaResult;
        /**
         * 计算平面面积
         * @param pts
         */
        static computeFlatArea(pts: Point[]): number;
        /**
         * 自动格式化面积信息
         * @param distance 距离
         * @returns
         */
        static formatAreas(area: number): string;
        static computeAngle(p0: Point, p1: Point): MeasureAngleResult;
    }
}
declare namespace CZMAP {
    /**
     * 投影点
     * @param a
     * @param b
     * @param p
     * @returns
     */
    export function projectCartesian(a: Cesium.Cartesian3, b: Cesium.Cartesian3, p: Cesium.Cartesian3, result: Cesium.Cartesian3): Cesium.Cartesian3;
    /**
     * 计算点在线段（延长线）上的投影
     * @param p0 线段端点1
     * @param p1 线段端点2
     * @param t 要投影的点
     * @param isGeographical 是否经纬度数据
     * @returns 投影后的点
     */
    export function projectPoint(p0: Point, p1: Point, t: Point, isGeographical?: boolean): Point;
    /**
     * 查找距离点最近的线段结果
     */
    interface FindNearestLineResult {
        /** 点序号 */
        i0: number;
        i1: number;
        /** 最近点的位值 */
        position: Cesium.Cartesian3;
        /** 距离 */
        distance: number;
    }
    /**
     * 查找距离点最近的线段
     * @param pts
     * @param t
     * @returns
     */
    export function findNearestLine(pts: Cesium.Cartesian3[], t: Cesium.Cartesian3): FindNearestLineResult;
    /**
     * 使用两个点截断折线
     * @param pts 折线
     * @param p0 点1
     * @param p1 点2
     * @param isGeographical 是否经纬数据
     * @returns 截断后的线段
     */
    export function cutLinesByTwoPoints(pts: Point[], p0: Point, p1: Point, isGeographical?: boolean): Point[];
    /**
     * 在线段上均匀布设
     * @param p0 起点
     * @param p1 终点
     * @param dist 布设距离
     * @param isGeographical 是否经纬度
     * @returns 布设点坐标列表
     */
    export function putOnLine(p0: CZMAP.Point, p1: CZMAP.Point, dist: number, isGeographical?: boolean): Point[];
    /**
     * 在这线上均匀布设点位
     * @param pts 输入折线坐标数组
     * @param dist 布设间距
     * @param isGeographical 是否经纬度数据
     * @returns 布设点坐标列表
     */
    export function putOnLines(pts: Point[], dist: number, isGeographical?: boolean): Point[];
    /**
     * 在线段上均匀布设点位
     * @param pts 输入折线坐标数组
     * @param num 布设树木
     * @param isGeographical 是否经纬度数据
     * @returns 布设点坐标列表
     */
    export function putOnLinesByNum(pts: Point[], num: number, isGeographical?: boolean): {
        points: Point[];
        length: number;
    };
    /**
     * 计算指定坐标附近指定偏移坐标
     * @param pt 目标点
     * @param ox 东西方向偏移
     * @param oy 南北方向偏移
     * @param oz 上下方向偏移
     * @param isGeographical 是否经纬度
     * @returns 偏移后的点
     */
    export function calcOffsetPoint(pt: CZMAP.Point, ox: number, oy: number, oz: number, isGeographical?: boolean): number[];
    /**
     * 计算指定坐标附近指定偏移坐标
     * @param position 目标点
     * @param dist 偏移距离
     * @param heading 方位角（正北方向）
     * @param pitch 俯仰角
     * @param isGeographical 是否经纬度
     * @returns
     */
    export function calcOffsetPoint2(position: CZMAP.Point, dist: number, heading: number, pitch: number, isGeographical?: boolean): number[];
    /**
     * 延线段方向计算线段终点偏移后坐标
     * @param p0 线段起点坐标
     * @param p1 线段终点坐标
     * @param ox 左右偏移
     * @param oy 前后偏移
     * @param oz 上下偏移
     * @param isGeographical 是否经纬度
     * @returns
     */
    export function calcLineOffsetPoint(p0: Point, p1: Point, ox: number, oy: number, oz: number, isGeographical?: boolean): Point;
    /**
     * 延线段方向计算线段终点偏移后坐标
     * @param p0 线段起点坐标
     * @param p1 线段终点坐标
     * @param dist 偏移距离
     * @param heading 方位角（线段方向）
     * @param pitch 俯仰角（线段方向）
     * @param isGeographical 是否经纬度坐标
     * @returns
     */
    export function calcLineOffsetPoint2(p0: Point, p1: Point, dist: number, heading: number, pitch: number, isGeographical?: boolean): Point;
    /**
     * 计算偏移后的线条
     * @param pts 线条坐标
     * @param ox 横向偏移
     * @param oy 纵向偏移
     * @param isGeographical 是否经纬度坐标
     * @returns 偏移后的坐标
     */
    export function calcLineOffset(pts: Point[], ox: number, oy: number, isGeographical?: boolean): Point[];
    /**
     * 将地质模型坐标系下的数据变换为经纬度
     * @param modelLayer 模型图层
     * @param pts 坐标列表
     * @param srcSrs 源坐标系（模型坐标系）
     * @param distSrs 目标坐标系（经纬度）
     * @returns
     */
    export function transformModelCoordinates(modelLayer: ModelLayer, pts: Polyline, srcSrs: string, distSrs?: string): Point[];
    /**
     * 将地质模型坐标系下的数据变换为经纬度
     * @param position 模型位置
     * @param pts 坐标列表
     * @param srcSrs 源坐标系（模型坐标系）
     * @param distSrs 目标坐标系（经纬度）
     * @returns
     */
    export function transformModelCoordinates2(position: Point, pts: Polyline, srcSrs: string, distSrs?: string): Point[];
    /**
     * 经纬度坐标转模型本地坐标
     * @param modelLayer 模型图层
     * @param pts 坐标列表
     * @param srcSrs 原始坐标系（模型的坐标系）
     * @param distSrs 目标坐标系（经纬度）
     */
    export function transformToModelCoordinates(modelLayer: ModelLayer, pts: Polyline, srcSrs?: string, distSrs?: string): Point[];
    /**
     * 经纬度坐标转模型本地坐标
     * @param position 模型中心点坐标
     * @param pts 坐标列表
     * @param srcSrs 原始坐标系（模型的坐标系）
     * @param distSrs 目标坐标系（经纬度）
     */
    export function transformToModelCoordinates2(position: Point, pts: Polyline, srcSrs?: string, distSrs?: string): Point[];
    export function calcTargetHeadingPitch(vi: ViewInfo, target: Point): void;
    export {};
}
declare namespace CZMAP {
    /** 切割保留参数 */
    enum CutRetain {
        /** 保留左侧 */
        LEFT = "left",
        /** 保留右侧 */
        RIGHT = "right",
        /** 保留切割面 */
        SECTION = "section"
    }
    /** 模型切割任务信息 */
    interface CutJobInfo {
        ssid: string;
        type: string;
        name: string;
        group: string;
        status: string;
        percent: number;
        createTime: string;
        startTime: string;
        finishTime: string;
        einfo: string;
        data: object;
        result: object;
    }
    /** 模型切割辅助工具 */
    class ModelCutHelper {
        private _layer;
        private _items;
        constructor(layer: ModelLayer);
        /**
         * 添加平面切割
         * @param clip 切割面
         * @param retain 保留的模型信息
         */
        addAxisPlane(clip: AxisClipPlane<MapView>, retain: CutRetain): void;
        /**
         * 添加平面切割
         * @param axis 切割轴向
         * @param distance 切割面距离
         * @param retain 保留的模型信息
         */
        addPlane(axis: Axis, distance: number, retain: CutRetain): void;
        /**
         * 添加路径切割
         * @param path 切割路径
         * @param retain 保留的模型信息
         */
        addPath(path: Polyline, retain: CutRetain): void;
        /**
         * 添加复杂切割
         * @param path 切割路径
         * @param clip 切割面
         * @param retain 保留的模型信息
         */
        addComplex(path: Polyline, clip: AxisClipPlane<MapView>, retain: CutRetain): void;
        /**
         * 执行切割
         * @param option 切割参数
         * @param option.onload 切割完成回调
         * @param option.onloadeddata 切割进度通报回调
         * @param option.onerror 切割失败回调
         * @returns Promise 切割完成
         */
        cut(option?: {
            onload?: (e: CutJobInfo) => void;
            onloadeddata?: (e: CutJobInfo) => void;
            onerror?: (e: CutJobInfo) => void;
        }): Promise<unknown>;
        /** 投影路径点为到投影平面坐标 */
        private _projPath;
        /**
         * 创建切割图层
         * @param url 模型URL
         * @returns 创建的图层
         */
        private _createCutLayer;
    }
}
declare namespace CZMAP {
    /**
     * 模型地形选项
     */
    interface ModelTerrainOption {
        name?: string;
        /** 地形服务的地址 */
        terrain: string;
        /** 地形偏移 */
        heightOffset?: number;
        /** 要添加的影像数据 */
        images?: TileDefine[];
    }
    /** 模型边界结果 */
    interface ModelEdgeResult {
        type: 'edges';
        success: boolean;
        msg: string;
        edges: GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
        edges2: GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
    }
    type ModelTerrain = {
        terrain?: TerrainLayer;
        images?: Layer[];
        globe?: boolean;
    };
    /**
     * 模型图层辅助工具
     */
    class ModelLayerHelper {
        /**
         * 获取模型的包围盒
         * @param layer
         * @returns
         */
        static calcBox(layer: ModelLayer): BoundingBox;
        /**
         * 基于模型创建切割面
         * @param layer
         * @param type
         * @returns
         */
        static createClipPlane(layer: ModelLayer, type: ClipPlaneType): ClipPlaneBase<MapView>;
        /**
         * 创建包围盒
         * @param layer
         * @returns
         */
        static createBoundBox(layer: ModelLayer): void;
        /** 移除包围盒 */
        static removeBoundBox(layer: ModelLayer): void;
        /** 创建坐标网格 */
        static createCoordGrid(layer: ModelLayer): void;
        /** 移除坐标网格 */
        static removeCoordGrid(layer: ModelLayer): void;
        /**
         * 获取模型的体积
         * @param layer
         * @returns
         */
        static fetchModelVolume(layer: ModelLayer): Promise<any>;
        /**
         * 拉取模型的外边界
         * @param layer 模型图层
         * @returns 模型边界线
         */
        static fetchModelEdges(layer: ModelLayer): Promise<ModelEdgeResult>;
        /**
         * 根据地址模型上 添加地形和影像
         * @param layer
         * @param option
         * @returns
         */
        static createModelTerrain(layer: ModelLayer, option: ModelTerrainOption): Promise<ModelTerrain>;
        /**
         * 移除模型图层上的地形图层
         * @param layer 模型图层
         */
        static removeModelTerrain(layer: ModelLayer): void;
        /**
         * 地形图层列表
         */
        private static terrains;
    }
}
declare namespace CZMAP {
    class ModelMover {
        private _czmap;
        private _viewer;
        private _entities;
        private _entitiesReset;
        private _content;
        private _entitiesDom;
        private _posInput;
        private _poseInput;
        private _handler;
        private _mode;
        private _keys;
        constructor(czmap: CZMAP.ComMap);
        pickModel(): void;
        pickPosition(): void;
        pickLine(): void;
        pickPose(): void;
        pickViewInfo(): void;
        clear(): void;
        show(): void;
        hide(): void;
        private _createDom;
        private _createLabel;
        private _createInput;
        private _createRange;
        private _createButton;
        private _initUI;
        private _onPosition;
        private _onPose;
        private _addEntity;
        private _add3dtiles;
        private _clickHandle;
    }
}
declare namespace CZMAP {
    /** 聚合对象 */
    export interface MultiLevelClusterItem {
        readonly position: Cesium.Cartesian3;
        readonly size?: number[];
        readonly properties?: Record<string, any>;
        show(show: boolean): void;
    }
    /** 聚合字段 */
    export interface ClusterField {
        /** 字段名 */
        name: string;
        /** 正则表达式 */
        regex?: string;
    }
    /** 聚合分类 */
    export interface ClusterClassify {
        /** 聚合标签 */
        label: string;
        /** 字段 */
        fields: ClusterField[];
        /** 最近距离 */
        minDistance: number;
        /** 最远距离 */
        maxDistance: number;
    }
    class ClusterShowItem extends Disposable {
        group: ClusterGroup;
        key: string;
        values: any[];
        cluster: MultiLevelCluster;
        entity: Cesium.Entity;
        items: MultiLevelClusterItem[];
        range: number[];
        constructor(group: ClusterGroup, key: string, values: any[]);
        add(item: MultiLevelClusterItem): void;
        remove(item: MultiLevelClusterItem): void;
        private _updateHandle;
        requestUpdate(): void;
        private update;
        show(show: boolean): void;
        protected _disposeInternal(): void;
    }
    interface ClusterGroupField {
        name: string;
        regex: RegExp;
    }
    /** 聚合分组 */
    class ClusterGroup extends Disposable {
        label: string;
        fields: ClusterGroupField[];
        cluster: MultiLevelCluster;
        minDistance: number;
        maxDistance: number;
        items: Record<string, ClusterShowItem>;
        constructor(cluster: MultiLevelCluster, classes: ClusterClassify);
        getValues(data: Record<string, any>): any[];
        getValue(data: Record<string, any>, field: ClusterGroupField): any;
        add(key: string, values: any[], item: MultiLevelClusterItem): void;
        remove(key: string, item: MultiLevelClusterItem): void;
        show(show: boolean): void;
        clear(): void;
        update(): void;
        protected _disposeInternal(): void;
    }
    export interface ClusterStyle {
        icon: Cesium.BillboardGraphics.ConstructorOptions;
        label: Cesium.LabelGraphics.ConstructorOptions;
    }
    export type ClusterStyleFunctionData = {
        fields: string[];
        value: any;
        values: any[];
        count: number;
    };
    /** 聚合样式函数 */
    export type ClusterStyleFunction = (data: ClusterStyleFunctionData) => ClusterStyle;
    /**
     * 聚合选项
     */
    export interface ClusterOption {
        /** 聚合分类列表 */
        classes: ClusterClassify[];
        /** 聚合空间范围 */
        range?: number[];
        /** 聚合样式 */
        style: ClusterStyle | ClusterStyleFunction;
    }
    /**
     * 多级分组聚合
     */
    export class MultiLevelCluster extends Disposable {
        private _viewer;
        private _scene;
        private _groups;
        private _items;
        private _lastCameraPos;
        private _style;
        private _range;
        private _visible;
        constructor(viewer: Cesium.Viewer, option: ClusterOption);
        get show(): boolean;
        set show(show: boolean);
        add(item: MultiLevelClusterItem): void;
        remove(item: MultiLevelClusterItem): void;
        update(): void;
        private doWithItem;
        /** @internal */
        createCluster(group: ClusterGroup, position: Cesium.Cartesian3, data: ClusterStyleFunctionData, entity: Cesium.Entity): Cesium.Entity;
        removeCluster(ent: Cesium.Entity): void;
        protected _disposeInternal(): void;
        destroy(): void;
        private getStyle;
        private updateVisible;
        private onPostRender;
    }
    export {};
}
declare namespace CZMAP {
    interface DraggingArgs {
        x: number;
        y: number;
        dx: number;
        dy: number;
    }
    interface RotateScaleArgs {
        d0: number;
        d1: number;
        r0: number;
        r1: number;
        ct: {
            x: number;
            y: number;
        };
    }
    interface MultiPointInputOption {
        /** 点击事件 */
        onClick?: (e: PointerEvent) => void;
        /** 鼠标移动事件 */
        onMouseMove?: (e: PointerEvent) => void;
        /** 拖拽（单点）*/
        onDragging?: (args: DraggingArgs) => void;
        /** 右键拖拽 */
        onRightDragging?: (args: DraggingArgs) => void;
        /** 旋转，缩放（两点） */
        onRotateScale?: (args: RotateScaleArgs) => void;
        /** 倾斜（三点） */
        onTilting?: (args: DraggingArgs) => void;
        onBeginAction?: () => void;
        onEndAction?: () => void;
        onBeginDragging?: () => void;
        onEndDragging?: () => void;
        onBeginScaleRotate?: () => void;
        onEndScaleRotate?: () => void;
        onBeginTilting?: () => void;
        onEndTilting?: () => void;
    }
    export enum MouseEventButtons {
        None = 0,
        LeftButton = 1,
        RightButton = 2,
        MiddleButton = 4,
        BackwardButton = 8,
        ForwardButton = 16
    }
    export enum MouseEventModifyKey {
        None = 0,
        ShiftKey = 1,
        AltKey = 2,
        CtrlKey = 3
    }
    export interface MouseEventBind {
        button: MouseEventButtons;
        modify?: MouseEventModifyKey | MouseEventModifyKey[];
    }
    export type MouseEventBindLike = MouseEventBind | MouseEventButtons;
    /** 多点触控事件支持 */
    export class MultiPointInput extends EventTargetHelper {
        private _dom?;
        private _oldTouchAction?;
        private _pointers;
        private _firstPoint?;
        /** 拖动键 */
        private _dragButton;
        /** 附拖动键 */
        private _rightDragButton;
        option: MultiPointInputOption;
        enableScale: boolean;
        enableRotate: boolean;
        constructor(option?: MultiPointInputOption);
        set dragButton(value: MouseEventBindLike);
        get dragButton(): MouseEventBindLike;
        set rightDragButton(value: MouseEventBindLike);
        get rightDragButton(): MouseEventBindLike;
        bind(dom: HTMLElement): void;
        release(): void;
        private _clear;
        private _pointer_down;
        private _pointer_up;
        private _notifyBeginEnd;
        private _pointer_move;
        private _pointer_cancel;
        private _mouse_wheel;
        private _context_menu;
        private _getOtherPointer;
    }
    export function isSamePoint(p0: PointerEvent, p1: PointerEvent, t?: number): boolean;
    export function calcDiff(p0: PointerEvent, p1: PointerEvent): {
        x: number;
        y: number;
    };
    export function calcRadius(p0: PointerEvent, p1: PointerEvent): number;
    export {};
}
declare namespace CZMAP {
    class Numbers extends Parse {
        /**
         * 解析长度为2的数组
         */
        static parseArray2: (x: string) => number[];
        /**
         * 解析长度为3的数组
         */
        static parseArray3: (x: string) => number[];
        /**
         * 解析长度为4的数组
         */
        static parseArray4: (x: string) => number[];
    }
}
declare namespace CZMAP {
    type PositionProperty = (time: Cesium.JulianDate) => Cesium.Cartesian3;
    /** 路径拖尾选项 */
    interface PathTailOption {
        position: PositionProperty;
        width: number;
        material: Cesium.Material | Cesium.MaterialProperty;
        maxLength?: number;
        maxSeconds?: number;
        distanceDisplayCondition?: Cesium.DistanceDisplayCondition;
    }
    /** 路径拖尾 */
    class PathTail {
        private position;
        private positions;
        polyline: Cesium.Polyline;
        private maxLength;
        private maxSeconds;
        private lastPos;
        private lastTime;
        constructor(polyline: Cesium.Polyline, option?: PathTailOption);
        update(time: Cesium.JulianDate): void;
        private _updatePolyline;
    }
    /** 路径拖尾集合 */
    class PathTailCollection {
        private _viewer;
        private _polylines;
        private _tails;
        constructor(viewer: Cesium.Viewer);
        get scene(): Cesium.Scene;
        createTail(option: PathTailOption): PathTail;
        removeTail(tail: PathTail): void;
        private _postRender;
    }
}
declare namespace CZMAP {
    /**
     * 字符串模板类
     */
    class StringTemp {
        /**
         * 获取所有变量名称
         * @param str 待查找的字符串
         * @return 变量名称列表
         */
        static getVarNames(str: string): string[];
        /**
         * 解析变量
         * @param str 带解析的字符串，如：`'abc={value}'`
         * @param data 数据
         */
        static parseVar(str: string, data: object): string;
        /**
         * 使用对象值替换字符串中的变量
         * @param str 待处理的字符串
         * @param data 对象数据
         */
        static parseVarMatch(str: string, data: object): string;
    }
}
declare namespace CZMAP {
    /**
     * 字符串工具类
     */
    class StringUtils {
        /**
         * 解析变量
         * @param str 带解析的字符串`"abc={value}"`
         * @param data 数据
         */
        static parseVar(str: string, data: object): string;
        /**
         * 判断字符串是否未定义或者长度为0
         * @param str
         */
        static isNotEmpty(str: string): boolean;
    }
}
declare namespace CZMAP {
    class TunnelUtils {
        /**
         * 定位管环
         * @param pts 隧道中心线坐标
         * @param num 隧道管环数
         * @param index 需要定位的管环号，从0开始
         */
        static calcPosition(pts: Point[], num: number, index: number): {
            position: Point;
            pose: Point;
        };
    }
}
declare namespace CZMAP {
    /**
     * Cesium 属性辅助类
     */
    class CesiumAttrib {
        static getBoolean(val: any, def?: boolean): boolean;
        static getNumber(val: any, def?: number): number;
        static getRadian(val: any, def?: number): number;
        static getColor(val: string | Cesium.Color, def?: string | Cesium.Color): Cesium.Color;
        static getCartesian2(val: any, def?: Cesium.Cartesian2): Cesium.Cartesian2;
        static getCartesian3(val: any, def?: Cesium.Cartesian3): Cesium.Cartesian3;
        static getCartesian3Degree(val: any, def?: Cesium.Cartesian3): Cesium.Cartesian3;
        static getHorizontal(val: string | number, def?: Cesium.HorizontalOrigin): Cesium.HorizontalOrigin;
        static getVertical(val: string | number, def?: Cesium.VerticalOrigin): Cesium.VerticalOrigin;
        static getDisplayDistance(val: any): Cesium.DistanceDisplayCondition;
        static getNearFarScalar(val: any): Cesium.NearFarScalar;
        static readValue(prop: Cesium.Property, time?: Cesium.JulianDate, result?: any): any;
    }
}
interface Array<T> {
    /** 返回最后一个对象 */
    last(): T | undefined;
    /** 从数组中删除对象 */
    remove(t: T): number;
}
declare namespace CZMAP {
}
declare namespace CZMAP {
    class PointInfo {
        coordinate: Point;
        position: Cesium.Cartesian3;
        entity: Cesium.Entity;
        data: any;
    }
    /** 坐标编辑器 */
    abstract class CoordinateEditor {
        protected _view3d: MapView3D;
        protected _czviewer: Cesium.Viewer;
        protected _enities: Cesium.Entity[];
        private _points;
        private _editorTool;
        private _handler;
        private _pointPixelSize;
        private _pointColor;
        private _selectedColor;
        private _hoveredColor;
        private _selected;
        private _hovered;
        private _alertFunc;
        constructor(view: MapView3D);
        setAlert(alert: (msg: string) => void): void;
        alert(msg: string): void;
        protected get selected(): PointInfo;
        protected _beginEdit(): void;
        protected _endEdit(): void;
        /** 绑定鼠标事件和渲染事件 */
        private _bindEvents;
        /** 释放事件绑定 */
        private _releaseEvents;
        protected _initPoints(pts: Point[]): void;
        /** 添加点 */
        protected _addPoint(pt: Point, data?: any): PointInfo;
        /** 删除点 */
        protected _removePoint(pi: PointInfo): void;
        /** 复制点 */
        protected _clonePoint(pi: PointInfo, data?: any): PointInfo;
        protected _removeAllPoints(): void;
        protected _selectPoint(pi: PointInfo): void;
        protected _unselectPoint(): void;
        protected abstract _onTranslatePoint(pi: PointInfo): void;
        protected _onSelectedPoint(pi?: PointInfo): void;
        private _onMouseTranslate;
        private _onMouseClick;
        private _onMouseMove;
        clear(): void;
        /** 销毁对象 */
        destroy(): void;
    }
}
declare namespace CZMAP {
    /** 网路节点 */
    interface NetNode {
        /** 节点名称 */
        name: string;
        /** 节点坐标 */
        position: Point;
        /** 节点属性 */
        properties?: Record<string, any>;
    }
    /** 网络线 */
    interface NetLine {
        /** 节点列表 */
        nodes: string[];
        /** 属性 */
        properties?: Record<string, any>;
        /** 是否修改了 */
        modified?: boolean;
    }
    interface NetEditorOption {
        /** 节点 */
        nodes: NetNode[];
        /** 线条 */
        lines: NetLine[];
        /** 线的样式 */
        style?: StrokeStyleOption;
    }
    interface CreateLineOption {
        nodeName?: string;
        nodeProperties?: Record<string, any>;
        lineProperties?: Record<string, any>;
    }
    interface CreateNodeOption {
        name?: string;
        properties?: Record<string, any>;
    }
    export class NetEditor extends CoordinateEditor {
        private _nodes;
        private _lines;
        private _style;
        constructor(view: MapView3D);
        startEdit(option: NetEditorOption): void;
        stopEdit(): void;
        clear(): void;
        getNetData(): {
            nodes: NetNode[];
            lines: NetLine[];
        };
        private _createLineEntity;
        private _removeLineEntity;
        private _checkNodeName;
        private _clearAlone;
        private _removeLine;
        private _createNode;
        private _removeNode;
        createLine(option: CreateLineOption): void;
        removeSelectLines(): void;
        cloneSelectPoint(option: CreateNodeOption): boolean;
        removeSelectPoint(): void;
        protected _onTranslatePoint(pi: PointInfo): void;
        protected _onSelectedPoint(pi?: PointInfo): void;
        /**
         * 计算指定点浮点的点位
         * @param pi
         */
        private _calcNearPoint;
        private _calcNearPointOnLine;
    }
    export {};
}
declare namespace CZMAP {
    interface PolylineEditorOption {
        polylines: Point[][];
        style?: StrokeStyleOption;
    }
    export class PolylineEditor extends CoordinateEditor {
        constructor(view: MapView3D);
        startEdit(option: PolylineEditorOption): void;
        stopEdit(): void;
        cloneSelect(): void;
        removeSelect(): void;
        protected _onTranslatePoint(pi: PointInfo): void;
        protected _onSelectedPoint(pi?: PointInfo): void;
    }
    export {};
}
declare namespace CZMAP {
    enum DynamicCircleMode {
        /** 延径向 */
        OnRadial = 0,
        /** 延X轴 */
        OnAxisX = 1,
        /** 延Y轴 */
        OnAxisY = 2
    }
    interface DynamicCircleOption {
        color?: string | Cesium.Color;
        speed?: number;
        repeat?: number;
        mode?: DynamicCircleMode;
    }
    class DynamicCircleMaterialProperty {
        _definitionChanged: Cesium.Event;
        _color: Cesium.Property;
        _speed: Cesium.Property;
        _repeat: Cesium.Property;
        _mode: Cesium.Property;
        constructor(options: DynamicCircleOption);
        get isConstant(): boolean;
        get definitionChanged(): Cesium.Event;
        getType(time: Cesium.JulianDate): string;
        getValue(time: Cesium.JulianDate, result: any): any;
        equals(other: any): boolean;
    }
}
declare namespace CZMAP {
    interface LineFlowMaterialOption {
        color?: Cesium.Color;
        speed?: number;
        percent?: number;
        gradient?: number;
    }
    /**
     * 流线材质
     */
    export class LineFlowMaterialProperty {
        _definitionChanged: Cesium.Event;
        _color: Cesium.Property;
        _speed: Cesium.Property;
        _percent: Cesium.Property;
        _gradient: Cesium.Property;
        constructor(options: LineFlowMaterialOption);
        get isConstant(): boolean;
        get definitionChanged(): Cesium.Event;
        getType(time: Cesium.JulianDate): string;
        getValue(time: Cesium.JulianDate, result?: LineFlowMaterialOption): LineFlowMaterialOption;
        equals(other: any): boolean;
    }
    export {};
}
