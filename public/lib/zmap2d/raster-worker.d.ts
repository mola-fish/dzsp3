declare namespace OLE {
    enum IsoTracerType {
        ISO_LINES = "isolines",
        ISO_BANDS = "isobands"
    }
    /**
     * 等值线追踪
     */
    class IsoTracer {
        /**
         * 构建网格点几何数据
         * @param src
         * @param extent
         */
        static buildGrid(src: Bitmap, extent: number[]): GeoJSON.FeatureCollection;
        static trace(mode: IsoTracerType, src: Bitmap, extent: number[], values: number[]): GeoJSON.FeatureCollection;
        /**
         * 重采样并追踪等值线
         * @param mode 模式
         * @param values 等值线值
         * @param src 原始栅格数据
         * @param extent 追踪范围
         * @param size 追踪密度
         * @param filter 插值参数
         * @returns
         */
        static traceByResample(mode: IsoTracerType, values: number[], src: RasterDataset, extent: number[], size: number[], filter: FILTER): GeoJSON.FeatureCollection<GeoJSON.Geometry, {
            [name: string]: any;
        }>;
        /**
         * 追踪等值线
         * @param src
         * @param extent
         * @param values
         */
        static tracelines(src: Bitmap, extent: number[], values: number[]): GeoJSON.FeatureCollection;
        /**
         * 追踪等值段
         * @param src
         * @param extent
         * @param values
         */
        static tracebands(src: Bitmap, extent: number[], values: number[]): GeoJSON.FeatureCollection;
        static simplify(geojson: GeoJSON.FeatureCollection, extent: number[], highQuality?: boolean): GeoJSON.FeatureCollection;
    }
}
declare namespace OLE {
    interface Box {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    interface BitmapOption {
        width?: number;
        height?: number;
        bands?: number;
        data?: ArrayLike<number>;
    }
    type FloatArray = Float32Array | Float64Array;
    class Bitmap {
        /** 像素宽度 */
        protected readonly _width: number;
        /** 像素高度 */
        protected readonly _height: number;
        /** 波段数 */
        protected readonly _bands: number;
        /** 数据 */
        protected readonly _data: FloatArray;
        constructor(option?: BitmapOption);
        static create(width: number, height: number, bands?: number, data?: ArrayLike<number>): Bitmap;
        /** 图像宽度，横向像素数 */
        get width(): number;
        /** 图像高度，纵向像素数 */
        get height(): number;
        /** 波段数 */
        get bands(): number;
        /** 数据 */
        get data(): FloatArray;
        isEmpty(): boolean;
        /**
         * 获取子数据
         * @param box 数据范围
         * @returns
         */
        subData(box: Box): Bitmap;
        /**
         * 获取子数据
         * @param box
         * @returns
         */
        protected subDataInner(box: Box): FloatArray;
    }
}
declare namespace OLE {
    interface RasterDatasetOption extends BitmapOption {
        extent: number[];
        noDataValue?: number;
        vmin?: number;
        vmax?: number;
    }
    interface RasterDatasetObject extends RasterDatasetOption {
        data: FloatArray;
        width: number;
        height: number;
        extent: number[];
        vmin: number;
        vmax: number;
        noDataValue: number;
    }
    class RasterDataset extends Bitmap {
        /** 数据空间范围 */
        private readonly _extent;
        /** 栅格数据像元的宽度 */
        private readonly _cellWidth;
        /** 栅格数据像元的高度 */
        private readonly _cellHeight;
        /** 空间宽度 */
        private readonly _geoWidth;
        /** 空间高度 */
        private readonly _geoHeight;
        /** 最值 */
        private readonly _minValue;
        private readonly _maxValue;
        /** 无效值 */
        private readonly _noDataValue;
        /** 数据空间范围 */
        get extent(): number[];
        /** 栅格数据像元的宽度 */
        get cellWidth(): number;
        /** 栅格数据像元的高度 */
        get cellHeight(): number;
        /** 空间宽度 */
        get geoWidth(): number;
        /** 空间高度 */
        get geoHeight(): number;
        /** 无效值 */
        get noDataValue(): number;
        /** 最小值 */
        get minValue(): number;
        /** 最大值 */
        get maxValue(): number;
        /**
         * 构造栅格数据对象
         * @param option
         */
        constructor(option?: RasterDatasetOption);
        /**
         * 获取指定坐标的像元值
         * @param x
         * @param y
         */
        getValue(x: number, y: number): number;
        /**
         *
         * @param box
         * @returns
         */
        subData(box: Box): RasterDataset;
        /**
         * 根据范围和大小重新获取数据
         * @param extent
         * @param size
         */
        subData2(extent: number[], size: number[], filter: FILTER): RasterDataset;
        toPixelCoord(extent: number[]): number[];
        toGeoCoord(pixel: number[]): number[];
        toDataObject(): RasterDatasetObject;
        /**
         * 转为像素数据
         * @param colors 色表，每四个元素为一个颜色值，分别是R,G,B,A
         * @returns
         */
        toPixelData(colors: Uint8ClampedArray): Uint8ClampedArray;
    }
}
declare namespace OLE {
    interface Box {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    enum FILTER {
        FILTER_BOX = 0,
        FILTER_BICUBIC = 1,
        FILTER_BILINEAR = 2,
        FILTER_BSPLINE = 3,
        FILTER_CATMULLROM = 4,
        FILTER_LANCZOS3 = 5
    }
    function createFilter(filter: FILTER): CGenericFilter;
    function doRescale(src: Bitmap, dst_width: number, dst_height: number, filter: FILTER, noDataValue?: number, box?: Box): Bitmap;
}
declare namespace OLE {
    /**
     Sampled filter weight table.<br>
     Contribution information for a single pixel
    */
    type Contribution = {
        Weights: Float64Array;
        Left: number;
        Right: number;
    };
    export class CWeightsTable {
        m_WeightTable: Contribution[];
        /**
        Constructor<br>
        Allocate and compute the weights table
        @param pFilter Filter used for upsampling or downsampling
        @param uDstSize Length (in pixels) of the destination line buffer
        @param uSrcSize Length (in pixels) of the source line buffer
        */
        constructor(pFilter: CGenericFilter, uDstSize: number, uSrcSize: number, uDstStart?: number, uDstEnd?: number);
        get(dst_pos: number): Contribution;
        /** Retrieve a filter weight, given source and destination positions
        @param dst_pos Pixel position in destination line buffer
        @param src_pos Pixel position in source line buffer
        @return Returns the filter weight
        */
        getWeight(dst_pos: number, src_pos: number): number;
        /** Retrieve left boundary of source line buffer
        @param dst_pos Pixel position in destination line buffer
        @return Returns the left boundary of source line buffer
        */
        getLeftBoundary(dst_pos: number): number;
        /** Retrieve right boundary of source line buffer
        @param dst_pos Pixel position in destination line buffer
        @return Returns the right boundary of source line buffer
        */
        getRightBoundary(dst_pos: number): number;
    }
    export {};
}
declare namespace OLE {
    abstract class CGenericFilter {
        protected m_dWidth: number;
        constructor(dWidth: number);
        GetWidth(): number;
        SetWidth(dWidth: number): void;
        abstract Filter(dVal: number): number;
    }
    /**
     Box filter<br>
     Box, pulse, Fourier window, 1st order (constant) b-spline.<br><br>

     <b>Reference</b> : <br>
     Glassner A.S., Principles of digital image synthesis. Morgan Kaufmann Publishers, Inc, San Francisco, Vol. 2, 1995
     */
    class CBoxFilter extends CGenericFilter {
        /**
        Constructor<br>
        Default fixed width = 0.5
        */
        constructor();
        Filter(dVal: number): 1 | 0;
    }
    /** Bilinear filter
    */
    class CBilinearFilter extends CGenericFilter {
        constructor();
        Filter(dVal: number): number;
    }
    /**
     Mitchell & Netravali's two-param cubic filter<br>

     The parameters b and c can be used to adjust the properties of the cubic.
     They are sometimes referred to as "blurring" and "ringing" respectively.
     The default is b = 1/3 and c = 1/3, which were the values recommended by
     Mitchell and Netravali as yielding the most visually pleasing results in subjective tests of human beings.
     Larger values of b and c can produce interesting op-art effects--for example, try b = 0 and c = -5. <br><br>

     <b>Reference</b> : <br>
     Don P. Mitchell and Arun N. Netravali, Reconstruction filters in computer graphics.
     In John Dill, editor, Computer Graphics (SIGGRAPH '88 Proceedings), Vol. 22, No. 4, August 1988, pp. 221-228.
     */
    class CBicubicFilter extends CGenericFilter {
        protected p0: number;
        protected p2: number;
        protected p3: number;
        protected q0: number;
        protected q1: number;
        protected q2: number;
        protected q3: number;
        /**
         Constructor<br>
         Default fixed width = 2
         @param b Filter parameter (default value is 1/3)
         @param c Filter parameter (default value is 1/3)
         */
        constructor(b?: number, c?: number);
        Filter(dVal: number): number;
    }
    /**
     Catmull-Rom spline, Overhauser spline<br>

    When using CBicubicFilter filters, you have to set parameters b and c such that <br>
    b + 2 * c = 1<br>
    in order to use the numerically most accurate filter.<br>
    This gives for b = 0 the maximum value for c = 0.5, which is the Catmull-Rom
    spline and a good suggestion for sharpness.<br><br>


    <b>References</b> : <br>
    <ul>
    <li>Mitchell Don P., Netravali Arun N., Reconstruction filters in computer graphics.
    In John Dill, editor, Computer Graphics (SIGGRAPH '88 Proceedings), Vol. 22, No. 4, August 1988, pp. 221-228.
    <li>Keys R.G., Cubic Convolution Interpolation for Digital Image Processing.
    IEEE Trans. Acoustics, Speech, and Signal Processing, vol. 29, no. 6, pp. 1153-1160, Dec. 1981.
    </ul>

    */
    class CCatmullRomFilter extends CGenericFilter {
        /**
        Constructor<br>
        Default fixed width = 2
        */
        constructor();
        Filter(dVal: number): number;
    }
    /**
     Lanczos-windowed sinc filter<br>
    
     Lanczos3 filter is an alternative to CBicubicFilter with high values of c about 0.6 ... 0.75
     which produces quite strong sharpening. It usually offers better quality (fewer artifacts) and a sharp image.<br><br>
     */
    class CLanczos3Filter extends CGenericFilter {
        /**
        Constructor<br>
        Default fixed width = 3
        */
        constructor();
        Filter(dVal: number): number;
        private sinc;
    }
    /**
     4th order (cubic) b-spline<br>
     */
    class CBSplineFilter extends CGenericFilter {
        /**
        Constructor<br>
        Default fixed width = 2
        */
        constructor();
        Filter(dVal: number): number;
    }
    /**
     Blackman window
     */
    class CBlackmanFilter extends CGenericFilter {
        /**
        Constructor<br>
        Default width = 0.5
        */
        constructor(dWidth?: number);
        Filter(dVal: number): number;
    }
}
declare namespace OLE {
    /** b样条插值 */
    class BSPLine {
        private _degree;
        private _konts;
        private _vdata;
        private _dim;
        /**
         * 构造B-SPline插值
         * @param degree 插值阶次
         * @param points 插值控制点
         * @param knots 插值节点
         * @param weights 权重
         */
        constructor(degree: number, points: number[][], knots?: number[], weights?: number[]);
        /**
         * 插值
         * @param t 插值位置 取值[0,1]
         * @param result 结果保存位置
         * @returns 插值结果
         */
        interp(t: number, result?: number[]): number[];
        /**
         * 使用BSP插值折线
         * @param points
         * @param segments
         * @returns
         */
        static interp(points: number[][], segments: number, degree?: number): number[][];
    }
}
declare namespace OLE {
    class Base64 {
        static byteLength(b64: string): number;
        static toByteArray(b64: string): Uint8Array;
        static fromByteArray(uint8: Uint8Array): string;
    }
}
declare namespace OLE {
    class ColorTool {
        static rgbaMatcher: RegExp;
        static rrggbbaaMatcher: RegExp;
        static rgbParenthesesMatcher: RegExp;
        static hslParenthesesMatcher: RegExp;
        static Colors: {
            RED: number[];
            GREEN: number[];
            BLUE: number[];
            WHITE: number[];
            BLACK: number[];
        };
        static parseCssColorString(color: string): number[];
    }
}
declare namespace OLE {
    type ValueType = any[] | {
        [key: string]: any;
    };
    export class DataRowsHelp {
        private _fields;
        private _values;
        private _fieldMap;
        constructor(fields: string[], values: ValueType[], fieldMap?: {
            [key: string]: string;
        });
        get values(): ValueType[];
        forEach(callback: (val: ValueType, index: number) => void): void;
        readValue(val: ValueType, field: string): any;
        readByIndex(index: number, field: string): any;
    }
    export {};
}
declare namespace OLE {
    class DebugTicks {
        private _name;
        private _start;
        private _end;
        constructor(name: string);
        start(): void;
        finish(): void;
        static logCost<T>(title: string, callback: () => T): T;
    }
}
declare namespace OLE {
    class Extents {
        static width(extent: number[]): number;
        static height(extent: number[]): number;
        static isEmpty(extent: number[]): boolean;
        static isEquals(extent1: number[], extent2: number[]): boolean;
        static clone(extent: number[], extent2?: number[]): number[];
        static createEmpty(): number[];
        static isIntersects(extent1: number[], extent2: number[]): boolean;
        static intersection(extent1: number[], extent2: number[], opt_extent?: number[]): number[];
        static mergePointXY(extent1: number[], x: number, y: number): void;
        static mergePoint(extent1: number[], pt: number[]): void;
        static mergePointArray(extent1: number[], pts: number[][]): void;
        static center(extent: number[], result?: number[]): number[];
        static buffer(extent: number[], buffer: number, result?: number[]): number[];
        static bufferXY(extent: number[], bufferX: number, bufferY: number, result?: number[]): number[];
    }
}
declare namespace OLE {
    enum DockedLocateX {
        LEFT = "left",
        RIGHT = "right",
        CENTER = "center"
    }
    enum DockedLocateY {
        TOP = "top",
        BOTTOM = "bottom",
        CENTER = "center"
    }
    enum DockedDir {
        POSITIVE = "positive",
        NEGATIVE = "negative"
    }
    interface DockedBarOption {
        dockx?: DockedLocateX;
        docky?: DockedLocateY;
        dockxdir?: DockedDir;
        dockydir?: DockedDir;
        offsetx?: number;
        offsety?: number;
        width?: number;
        height?: number;
    }
    class DockedBar {
        dockx: DockedLocateX;
        docky: DockedLocateY;
        dockxdir: DockedDir;
        dockydir: DockedDir;
        offsetx: number;
        offsety: number;
        width: number;
        height: number;
        constructor(option: DockedBarOption);
        getRange(range: number[]): number[];
    }
}
declare namespace OLE {
    type Point2d = [number, number];
    class GeoMath {
        static triangleArea(a: Point2d, b: Point2d, c: Point2d): number;
        static intersect(a: Point2d, b: Point2d, c: Point2d, d: Point2d, e?: Point2d, segment?: boolean): boolean;
    }
}
declare namespace OLE {
    function inflate(arr: ArrayLike<number>): number[];
}
declare namespace OLE {
    interface SingleLine {
        id: number;
        line: number[][];
        tail?: number[][];
        arrows?: number[][][];
    }
    export interface StreamLineOption {
        /** 流线间距 */
        lineSpace?: number;
        /** 插值积分次数（迭代次数） */
        interpCount?: number;
        /** 插值步距 */
        interpStep?: number;
        /** 流线的最小长度 */
        minLength?: number;
        /** 流线的最大点数 */
        maxPoints?: number;
        /** 流线经过当个格子的最大次数 */
        maxStay?: number;
        /** 仅向前追踪 */
        forwardOnly?: boolean;
        /** 是否包含箭头 */
        showArrow?: boolean;
        /** 箭头间距 */
        arrowDist?: number;
        /** 箭头大小 */
        arrowSize?: number;
        /** 是否显示最尾端的箭头 */
        showTailArrow?: boolean;
    }
    export interface StreamLineData {
        u: ArrayLike<number>;
        v: ArrayLike<number>;
        width: number;
        height: number;
        range: number[];
    }
    export class StreamLine {
        private mOption;
        private mLines;
        private mFlags;
        private mFlags2;
        private mUsedCache;
        private mDataU;
        private mDataV;
        private mWidth;
        private mHeight;
        private mRange;
        constructor(option: StreamLineOption);
        clear(): void;
        private initUsedCache;
        /**
         * 追踪流线
         * @param data 数据
         */
        generate(data: StreamLineData): SingleLine[];
        private getLines;
        private trackStreamLine;
        /**
         * 获取种子点
         * @returns
         */
        private getSeed;
        /**
         * 标记线条
         * @param pts 线条的点
         * @param lineID 线条ID
         */
        private setLineUsed;
        private setUsed;
        private interpValue;
        private interpValueXY;
        private interpNextPosition;
    }
    export {};
}
declare namespace OLE {
    function calcLimit(data: ArrayLike<number>): [number, number];
    interface UnpackRasterData {
        data: ArrayLike<number>;
        min?: number;
        max?: number;
        noData?: number;
    }
    function unpackRasterData(base64: string): UnpackRasterData;
    function decodeRasterData(base64: string): UnpackRasterData;
    function inflaterRasterData(base64: string): UnpackRasterData;
    function encodeRasterData(data: Float32Array): string;
    function defined(val: any): boolean;
    function defaultValue<T>(val: T, def?: T): T;
    function defaultValues<T>(...vals: T[]): T;
    function deepAssign(target: object, ...sources: any[]): any;
    function getFontSize(font: string): number;
    function guid(): string;
}
declare const RasterEngine: typeof OLE;
declare const PointEngine: typeof OLE;
interface Array<T> {
    last(): T | undefined;
}
declare namespace OLE {
    type RasterFunctionResult<T> = {
        data: T;
        transfer?: any[];
    };
    type RasterFunction<T extends WorkerMessageData> = (data: T) => RasterFunctionResult<any> | void;
    export class RasterWorker {
        raster: RasterDataset;
        colors: Uint8ClampedArray;
        filter: FILTER;
        proces: Map<WorkerOperator, RasterFunction<any>>;
        constructor();
        onMessage(e: MessageEvent): void;
        init(data: WorkerInitRequest): void;
        resample(data: WorkerResampleRequest): RasterFunctionResult<{
            raster: RasterDatasetObject;
            pixels: Uint8ClampedArray;
        }>;
        /**
         *
         * @param param
         * @returns
         */
        traceISO(data: WorkerIsoRequest): RasterFunctionResult<any>;
    }
    export {};
}
declare const worker1: OLE.RasterWorker;
