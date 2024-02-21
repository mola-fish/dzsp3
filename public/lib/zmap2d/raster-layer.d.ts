/// <reference types="zmap-third-types" />
declare namespace OLE {
    interface VectorLabelStyle {
        size: number;
        color: string;
        decimals: number;
        repeat: number;
        fontFamily?: string;
        textSpacing?: number;
        place?: Array<String>;
        minFeatureSize: number;
        shadow?: {
            shadowDraw?: boolean;
            shadowOffsetAngle?: number;
            shadowOffsetDist?: number;
            shadowRadius?: number;
            shadowColor?: [number, number, number];
            shadowTransparency: number;
        };
        buffer?: {
            bufferDraw?: boolean;
            bufferSize?: number;
            bufferColor?: string | [number, number, number, number];
        };
        background?: {
            shapeDraw?: boolean;
            shapeFillColor?: string | [number, number, number, number];
            shapeBorderColor?: string | [number, number, number, number];
            shapeBorderWidth?: number;
        };
    }
    interface IsoOnServerOption {
        /** 渲染模式 */
        mode: 'isolines' | 'isobands' | 'isobands+isolines';
        /** 服务器地址 */
        server: string;
        /** 要计算的等值线值 */
        values?: number[];
        /** 线宽。颜色 */
        line: {
            /** 颜色 */
            color: string;
            /** 宽度 */
            width: number;
            /** 样式 */
            style?: "solid" | "dash" | "no" | "dot" | "dash dot" | "dash dot dot";
            /** 线头样式 */
            capstyle?: "round" | "square" | "flat";
            /** 连接样式 */
            joinstyle?: "round" | "bevel" | "miter";
        };
        /** 标注颜色，字体 */
        label: VectorLabelStyle;
        /** 裁剪区域 */
        clip: number[][][][];
        /** 差值方式 */
        interpFilter: 0 | 1 | 2 | 3 | 4 | 5;
    }
    interface IsoOnServerData {
        type: string;
    }
    interface RasterData extends IsoOnServerData {
        type: "RasterDataset";
        width: number;
        height: number;
        extent: number[];
        base64: string;
    }
    interface PointsData extends IsoOnServerData {
        type: 'Point3Ds';
        gapx: number;
        gapy: number;
        radius: number;
        points: number[][];
        preInterp: boolean;
        interpGrid: boolean;
    }
    /**
     * 栅格渲染器
     */
    interface RasterIsoOption extends IsoOnServerOption {
    }
    interface PointIsoOption extends IsoOnServerOption {
        fieldx: number | string;
        fieldy: number | string;
        fieldv: number | string;
        /** 预插值 */
        preInterp?: boolean;
        interpGapx?: number;
        interpGapy?: number;
        interpRadius?: number;
        /** 插值网格数，用于 preInterp == false时 */
        interpGrid?: number;
    }
    class CompIsoOnServer {
        private _option;
        private _uuid;
        private _workid;
        private _controller;
        private _imageFlag;
        private _server;
        private _body;
        constructor();
        protected initBody(data: any, render: IsoOnServerOption, colors: PiecewiseColorItem[]): {
            data: any;
            polygon: number[][][][];
            colors: any[];
            values: number[];
            labeling: {
                enabled: boolean;
                field: string;
                text: {
                    fontSize: number;
                    textColor: number[];
                    decimals: number;
                    fontFamily: string;
                    textSpacing: number;
                };
                placement: {
                    placementFlags: String[];
                    repeatDistance: number;
                };
                render: {
                    labelPerPart: boolean;
                    minFeatureSize: number;
                };
                buffer: {
                    bufferDraw: boolean;
                    bufferSize: number;
                    bufferColor: number[];
                } & {
                    bufferDraw?: boolean;
                    bufferSize?: number;
                    bufferColor?: string | [number, number, number, number];
                };
                shadow: {
                    shadowDraw: boolean;
                    shadowOffsetAngle: number;
                    shadowOffsetDist: number;
                    shadowRadius: number;
                    shadowColor: number[];
                    shadowTransparency: number;
                } & {
                    shadowDraw?: boolean;
                    shadowOffsetAngle?: number;
                    shadowOffsetDist?: number;
                    shadowRadius?: number;
                    shadowColor?: [number, number, number];
                    shadowTransparency: number;
                };
                background: {
                    shapeDraw: boolean;
                    shapeFillColor: string;
                    shapeBorderColor: string;
                    shapeBorderWidth: number;
                } & {
                    shapeDraw?: boolean;
                    shapeFillColor?: string | [number, number, number, number];
                    shapeBorderColor?: string | [number, number, number, number];
                    shapeBorderWidth?: number;
                };
            };
            filter: 0 | 2 | 1 | 5 | 4 | 3;
            'line-width': number;
            'line-color': number[];
            'line-style': "solid" | "dash" | "no" | "dot" | "dash dot" | "dash dot dot";
            'line-joinstyle': "round" | "bevel" | "miter";
            'line-capstyle': "square" | "round" | "flat";
        };
        init<T extends IsoOnServerData>(option: RasterIsoOption, colors: PiecewiseColorItem[], data: T): Promise<void>;
        static fieldName2Index(field: number | string, fields: string[]): number;
        getImageURL(extent: number[], resolution: number, pixelRatio: number, size: number[], proj: any): string;
        /**
         * 请求等值线图片
         * @param extent
         * @param resolution
         * @param pixelRatio
         * @param size
         * @param proj
         */
        getImage(extent: number[], resolution: number, pixelRatio: number, size: number[], proj: any): Promise<HTMLImageElement>;
        /**
         * 导出等值线数据
         */
        export(extent: number[], size: number[], fmt?: string): string;
        protected reset(): void;
        protected initIsoWorker(server: string, body: any): Promise<void>;
    }
}
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
    interface BaseLayerOption {
        win?: Window;
        /** 投影系 */
        projection?: any;
    }
    /** 扩展图层基类 */
    abstract class BaseAbstractLayer {
        /** openlayers map 对象 */
        protected readonly _map: any;
        /** window 对象 */
        protected readonly _win: any;
        protected readonly _projection: string;
        /**
         * 构造函数
         * @param map
         * @param option
         */
        constructor(map: any, option?: BaseLayerOption | Window);
        /** 获取图层对象 */
        abstract get layer(): any;
        /** 获取数据源 */
        abstract get soruce(): any;
        /** 更新图层 */
        abstract update(): void;
        /** 刷新 */
        refresh(): void;
        /** 清空图层内容 */
        abstract clear(): void;
        /** 销毁图层 */
        abstract destroy(): void;
        /**
         * 获取对应类型的选项
         * @param option
         * @returns
         */
        protected static getOption<T extends BaseLayerOption>(option: T | Window): T;
    }
}
declare namespace OLE {
    interface BaseCanvasLayerOption extends BaseLayerOption {
        /** 内部画布比例 */
        ratio?: number;
    }
    /** 绘制函数 */
    type CanvasFunction<T extends BaseAbstractLayer> = (this: T, extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: any) => void;
    /**
     * 抽象画布图层
     */
    abstract class BaseCanvasLayer extends BaseAbstractLayer {
        protected _layer: any;
        protected _source: any;
        protected _memCanvas: HTMLCanvasElement;
        protected _memContext: CanvasRenderingContext2D;
        /**
         * 构造函数
         * @param map
         * @param option
         */
        constructor(map: any, option: BaseCanvasLayerOption | Window);
        /** 获取图层对象 */
        get layer(): any;
        /** 获取数据源 */
        get soruce(): any;
        /** @override */
        update(): void;
        /** @override */
        refresh(): void;
        /** @override */
        clear(): void;
        /** 销毁图层 */
        destroy(): void;
        /** 创建内存canvas */
        protected _createMemoryCanvas(): CanvasRenderingContext2D;
        /** 创建Canvas图层 */
        private _createLayer;
        /** 是否清除上次的画布内容 */
        protected _clearLast(): boolean;
        /** 绘制函数 */
        protected abstract _canvasFunction(extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: string): void;
    }
}
declare namespace OLE {
    /**
     *
     */
    type GetImageResult = string | Promise<string> | HTMLImageElement | Promise<HTMLImageElement>;
    type GetImageFunction = (extent: number[], resolution: any, pixelRatio: any, size: [number, number], projection: any) => GetImageResult;
    /**
     *
     */
    export interface CustomWmsLayerOption extends OLE.BaseLayerOption {
        getImage?: GetImageFunction;
        extent?: number;
    }
    /**
     * 点数据可视化图层
     */
    export class CustomWmsLayer extends OLE.BaseCanvasLayer {
        private _GetImageFunction;
        private _lastImage;
        private _lastExtent;
        private _version;
        /**
         * 构造一个 RasterLayer 对象
         * @param map OpenLayers map 对象
         */
        constructor(option: CustomWmsLayerOption);
        /** @override */
        clear(): void;
        /**
         * @override
         * @param extent
         * @param resolution
         * @param pixelRatio
         * @param size
         * @param projection
         * @returns
         */
        protected _canvasFunction(extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: string): HTMLCanvasElement;
        /** 获取图像 */
        protected _getImage(extent: number[], resolution: any, pixelRatio: any, size: [number, number], projection: any): GetImageResult;
        /**
         * 请求图像数据
         * @param version
         * @param extent
         * @param resolution
         * @param pixelRatio
         * @param size
         * @param projection
         * @returns
         */
        private _requestImage;
        /**
         * 绘制图像到画布上
         * @param extent
         * @param resolution
         * @param pixelRatio
         * @param size
         */
        private _drawImage;
    }
    export {};
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
    type PointData = any[];
    interface PointsLayerOption extends BaseCanvasLayerOption {
    }
    abstract class PointsLayer extends BaseCanvasLayer {
        protected _points: PointData[];
        protected _fieldX: number;
        protected _fieldY: number;
        protected _extent: number[];
        constructor(map: any, option?: PointsLayerOption);
        get points(): PointData[];
        get fieldX(): number;
        get fieldY(): number;
        /**
         * 设置点数据
         * @param data
         */
        setPoints(data: PointData[] | {
            points: PointData[];
            fieldX?: number;
            fieldY?: number;
        }): void;
        /** @override */
        clear(): void;
        protected _onSetPoints(): void;
    }
}
declare namespace OLE {
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
declare namespace OLE {
    /**
     *
     */
    interface DensityLayerOption extends OLE.PointsLayerOption {
    }
    type PointData = OLE.PointData;
    export interface DensityValues {
        /** 数量 */
        readonly count: number;
        /** 求和 */
        readonly sum: number;
        /** 平均值 */
        readonly avg: number;
    }
    /** 密度图图元 */
    export class DensityCell implements DensityValues {
        /** 范围 */
        extent: number[];
        /** 数量 */
        count: number;
        /** 求和 */
        sum: number;
        /** 平均值 */
        get avg(): number;
        values: number[][];
        constructor(extent: number[]);
        add(pt: PointData, valueField?: number): void;
    }
    /** 密度图值类型 */
    export type DensityType = keyof DensityValues;
    /** 密度图数值计算回调函数 */
    export type ValueCallback = (cell: DensityCell) => number;
    /** 密度图网格密度函数 */
    type DensityCallback = () => number | [number, number];
    /**
     * 点数据可视化图层
     */
    export class DensityLayer extends OLE.PointsLayer {
        private _density;
        private _lastDensity;
        private _densityCallback;
        private _dirty;
        private _colors;
        private _densityType;
        private _valueCallback;
        private _cellMap;
        private _cells;
        private _borderWidth;
        private _borderColor;
        /** 相对位置 */
        private _densityOffset;
        /**
         * 构造一个 RasterLayer 对象
         * @param map OpenLayers map 对象
         */
        constructor(option?: DensityLayerOption);
        /** 设置密度图网格密度 */
        setDensity(density: number): void;
        /** 设置密度图网格密度 */
        setDensityXY(densityX: number, densityY: number): void;
        setDensityOffset(offsetX: number, offsetY: number): void;
        /** 设置密度图网格密度 */
        setDensityCallback(callback: DensityCallback): void;
        /** 设置密度图数值计算回调 */
        setValueCallback(calllback: ValueCallback): void;
        /** 设置色表 */
        setColors(colors: PiecewiseColorItem[]): void;
        /** 设置色表 */
        setColorTable(ct: ColorTable): void;
        /**
         * 设置边框
         * @param width 边框宽度
         * @param color 边框颜色
         */
        setBorder(width: number, color?: string): void;
        /** 获取当前点位的密度图元 */
        getValue(px: number, py: number, to?: number): DensityCell;
        /** @override */
        clear(): void;
        /** @override */
        protected _onSetPoints(): void;
        private _updateCells;
        protected _canvasFunction(extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: string): HTMLCanvasElement;
    }
    export {};
}
declare namespace OLE {
    class IsoOnServerLayer extends CustomWmsLayer {
        private _isoOnServer;
        constructor(option: CustomWmsLayerOption);
        init<T extends IsoOnServerData>(option: RasterIsoOption, colors: PiecewiseColorItem[], data: T): void;
        export(extent: number[], size: number[]): string;
        exportJSON(extent: number[], size: number[]): Promise<any>;
        protected _getImage(extent: number[], resolution: any, pixelRatio: any, size: [number, number], projection: any): Promise<any>;
    }
}
declare namespace OLE {
    interface OldIsoOnServerData {
        datainfos: any;
        values: number[];
        colors: PiecewiseColorItem[];
        linecolor: string;
        polygon: number[][][][];
        intpType: number;
        xGap: number;
        yGap: number;
        searchR: number;
    }
    interface OldIsoOnServerLayerOption extends CustomWmsLayerOption {
        data: OldIsoOnServerData;
        server: string;
    }
    class OldIsoOnServerLayer extends CustomWmsLayer {
        private data;
        private server;
        constructor(option: OldIsoOnServerLayerOption);
        protected _getImage(extent: number[], resolution: any, pixelRatio: any, size: [number, number], projection: any): Promise<string>;
    }
}
declare namespace OLE {
    export enum PointStyleType {
        /** 空，不绘制 */
        NONE = "none",
        /** 图形 */
        SHAPE = "shape",
        /** 图标 */
        ICON = "icon",
        /** 字符 */
        CHARACTER = "character"
    }
    export enum PointShapeType {
        /** 圆行 */
        CIRCLE = "circle",
        /** 矩形 */
        RECT = "rect",
        /** 叉叉 */
        CROSS = "cross",
        /** 三角形 */
        TRIANGLE = "triangle",
        /** 正方形 */
        SQUARE = "square",
        /** 宝石 */
        DIAMOND = "diamond",
        /** 标记 */
        PIN = "pin",
        /** 箭头 */
        ARROW = "arrow",
        /** 加号 */
        PLUS = "plus",
        /** 减号 */
        MINUS = "minus"
    }
    export interface PointStyleIcon {
        url: string;
        offsetX?: number;
        offsetY?: number;
    }
    export interface PointStyleCharactor {
        font: string;
        char: string;
    }
    export interface PointStyleLabel {
        color?: string;
        font?: string;
        textAlign?: CanvasTextAlign;
        textBaseline?: CanvasTextBaseline;
        offsetX?: number;
        offsetY?: number;
        textField?: number;
        lineWidth?: (pt: PointData) => number;
        lineColor?: (pt: PointData) => string;
        background?: () => ScatterRenderLabelBackground;
        enableRotate?: boolean;
        formatter?: (pt: PointData) => string;
    }
    export interface ScatterRenderLabelBackground {
        shapeDraw?: boolean;
        shapeFillColor?: string;
        shapeBorderColor?: string;
        shapeBorderWidth?: number;
        shapeBorderRadius?: number;
        padding?: number | [number, number] | [number, number, number, number];
    }
    /**
     * 点样式
     */
    export interface PointStyle {
        /** 类型 */
        type: PointStyleType;
        /** 图形类型，对应type=SHAPE */
        shape?: PointShapeType;
        /** 图标，对应type=ICON */
        icon?: PointStyleIcon;
        /** 字形符号，对应type=CHARACTER */
        character?: PointStyleCharactor;
        /** 填充颜色 */
        fillColor?: string;
        /** 颜色 */
        lineColor?: string;
        /** 线宽 */
        lineWidth?: number;
        /** 半径，大小 */
        radius?: number | [number, number];
        /** 旋转 */
        rotate?: number;
        /** 标注 */
        label?: PointStyleLabel;
    }
    type PointData = any[];
    export type PointStyleFunction = (pt: PointData) => PointStyle;
    interface LargePointsLayerOption extends OLE.BaseLayerOption {
    }
    /**
     * 点数据可视化图层
     */
    export class LargePointsLayer extends OLE.PointsLayer {
        private _hiddenRadius;
        private _style;
        private _lastRaster;
        private _lastExtent;
        private _lastSize;
        /**
         * 构造一个 RasterLayer 对象
         * @param map OpenLayers map 对象
         */
        constructor(option?: LargePointsLayerOption);
        /**
         * 设置遮挡半径
         * @param hiddenR
         */
        setHiddenRadious(hiddenR: number): void;
        /**
         * 设置绘制样式
         * @param style
         */
        setStyle(style: PointStyle | PointStyleFunction): void;
        /**
         * 获取指定坐标的数据
         * @param px
         * @param py
         */
        getValue(px: number, py: number, to?: number): PointData;
        protected _canvasFunction(extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: string): HTMLCanvasElement;
        protected _onSetPoints(): void;
        private _tagPoint;
        static draw(option: {
            pd: PointData;
            ostyle: PointStyle | PointStyleFunction;
            ctx: CanvasRenderingContext2D;
            cx: number;
            cy: number;
            redraw?: () => void;
        }): void;
    }
    export {};
}
declare namespace OLE {
    type ColorItem = {
        min: number;
        max: number;
        color: string;
        rgba?: number[];
    };
    export type RasterLayerMode = 'raster' | 'isolines' | 'isobands' | 'raster+isolines';
    export interface RasterLabelIcon {
        /** 图标地址 */
        url: string;
        /** 旋转 */
        rotate?: number;
        /** 宽度 */
        width?: number;
        /** 高度 */
        height?: number;
    }
    export interface RasterLabel {
        /** 是否启用标签 */
        enable?: boolean;
        /** 是否启用栅格 */
        enableRaster?: boolean;
        /** 字体名称 */
        font_name?: string;
        /** 字体大小 */
        font_size?: number;
        /** 颜色 */
        color?: string;
        /** 小数位数 */
        fixed?: number;
        /** 边距 */
        padding?: number[];
        /** 单元格宽度，单位：像素 */
        cellWidth?: number;
        /** 单元格高度，单位：像素 */
        cellHeight?: number;
        /** 格式化内容 */
        formatter?: (value: number) => string | RasterLabelIcon;
        /** 网格 */
        grid?: {
            color?: string;
            width?: number;
        };
        /** 边框 */
        stroke?: {
            color?: string;
            width?: number;
        };
    }
    export interface RasterLayerOption extends OLE.BaseCanvasLayerOption {
        win?: Window;
        /** 坐标系 */
        projection?: any;
        /** 是否使用worker */
        useWorker?: boolean;
        userWorker?: boolean;
        /** iso模式 */
        mode?: RasterLayerMode;
        /** 标签 */
        label?: RasterLabel;
        /** 是否显示栅格数据网格线 */
        showRasterGrid?: boolean;
        /** 延迟绘制事件，毫秒数 */
        delayTime?: number;
        /** 裁剪区 */
        clip?: number[][][][];
    }
    /**
     * 栅格数据可视化图层
     */
    export class RasterLayer extends OLE.BaseCanvasLayer {
        /**
         * 栅格数据
         */
        private _data;
        /** 当前用于显示的值 */
        private _renderData;
        /**
         * 栅格数据的显示范围
         */
        private _visibleExtent;
        /** 组图层 */
        private _folder_layer;
        private _raster_layer;
        private _raster_source;
        private _iso_layer;
        private _iso_source;
        private _memCanvas2;
        private _memContext2;
        private _memExtent;
        /** 当前画布的范围 */
        private _canvasExtent;
        /** 当前画布的分辨率 */
        private _canvasResolution;
        /** 当前画布的像素比 */
        private _canvasPixelRatio;
        private _colorItems;
        private _values;
        private _colors;
        private _opacity;
        private _clip;
        private _useWorker;
        private _rasterWorker;
        private _rasterID;
        private _isoWorker;
        private _isoWorkerBusy;
        private _renderRaster;
        private _renderIsoMode;
        private _renderLabel;
        private _filter;
        private _label;
        private _showRasterGrid;
        /** 延迟绘制 */
        private _delayTime;
        private _delayHandle;
        /**
         * 构造一个 RasterLayer 对象
         * @param map OpenLayers map 对象
         */
        constructor(map: any, option?: RasterLayerOption | Window);
        get layer(): any;
        get vmin(): number;
        get vmax(): number;
        /**
         * 数据的值域
         */
        get valueRange(): number[];
        /**
         * 获取图层的不透明度
         */
        get opacity(): number;
        /**
         * 设置不透明度
         */
        set opacity(o: number);
        /**
         * 设置数据
         * @param base64 base64编码的栅格数据
         * @param xcells
         * @param ycells
         * @param extent 数据的空间范围
         */
        setData(data: ArrayLike<number>, xcells: number, ycells: number, extent: number[]): void;
        /**
         * 设置数据
         * @param option
         */
        setDataOption(option: {
            data: ArrayLike<number>;
            vmin?: number;
            vmax?: number;
            noDataVal?: number;
            filter?: FILTER;
            label?: RasterLabel;
            xcells: number;
            ycells: number;
            extent: number[];
            clip?: number[][][][];
        }): void;
        /**
         * 设置数据显示范围
         * @param extent
         */
        setVisibleExtent(extent: number[]): void;
        setShowRasterGrid(show: boolean): void;
        /**
         * 设置色表
         * @param colors 颜色数组
         */
        setColors(colors: ColorItem[]): void;
        /** @override */
        clear(): void;
        /**
         * 销毁图层对象，移除内部资源
         */
        destroy(): void;
        private _updateColors;
        /**
         * 获取指定坐标的像元值
         * @param x
         * @param y
         */
        getValue(x: number, y: number): number;
        /**
         * 获取显示值
         * @param x
         * @param y
         */
        getDisplayValue(x: number, y: number): number;
        private _createLayers;
        /**
         * ImageCanvas数据源的处理回调函数
         * @param extent
         * @param resolution
         * @param pixelRatio
         * @param size
         * @param projection
         */
        protected _canvasFunction(extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: string): HTMLCanvasElement;
        private _drawLast;
        private _traceRasterByWorker;
        private _traceIsoByWorker;
        /**
         * 创建WebWorker,用于后台计算等值线等
         */
        private _createWorker;
        private _syncData;
        private _syncColors;
        /**
         * 获取值的css颜色字符串
         * @param val
         * @returns
         */
        getValueColor(val: number): string;
        /**
         * 获取值的颜色分量
         * @param val
         * @returns
         */
        getValueColorByte(val: number): number[];
        private _renderToCanvas;
        /**
         * 用于绘制数据的网格线,用于调试
         * @param extent 当前canvas的空间范围
         * @param resolution 当前canvas的分辨率
         */
        private _drawDataGrid;
        /**
         * 脚本正则表达式
         */
        private static RasterLayerScriptRegex;
        /**
         * 获取根url
         */
        static getBaseUrlFromScript(): string;
    }
    export {};
}
declare namespace OLE {
    interface StreamLineLayerOption extends BaseLayerOption, StreamLineOption {
        /** 头部设置 */
        showHead?: boolean;
        headSize?: number;
        headFillColor?: string;
        headStrokeSize?: number;
        headStrokeColor?: string;
        /** 线条样式 */
        lineColor?: string;
        lineSize?: number;
        lineDash?: number[];
    }
    export class StreamLineLayer extends BaseAbstractLayer {
        private _olLayer;
        private _olSource;
        private _option;
        constructor(map: any, option?: StreamLineLayerOption);
        get layer(): any;
        get soruce(): any;
        setData(data: StreamLineData): void;
        update(): void;
        clear(): void;
        destroy(): void;
    }
    export {};
}
declare namespace OLE {
    /** 台风路径图 */
    /** 台风圈 */
    class TyphoonRadius {
        0: number;
        1: number;
        2: number;
        3: number;
        /** 是否原始风圈（非插值） */
        isOriginal: boolean;
        /**
         * 构造一个台风圈
         * @param values 风圈半径
         * @param isOriginal 是否原始值
         */
        constructor(values?: number[], isOriginal?: boolean);
        /** 获取台风圈半径 */
        get values(): number[];
        /** 克隆对象 */
        clone(): TyphoonRadius;
    }
    interface PointXY {
        /** 坐标X */
        x: number;
        /** 坐标Y */
        y: number;
    }
    /** 台风点位 */
    class TyphoonPoint implements PointXY {
        id: number;
        rid: number;
        /** 坐标X */
        x: number;
        /** 坐标Y */
        y: number;
        /** 时间 */
        datetime: Date;
        /** 当前风速 */
        windspeed: number;
        /** 移动速度 */
        speed: number;
        /** 风圈半径 */
        radii: TyphoonRadius[];
        /** 预报时间 */
        forecast: number;
        /** 是否实际点位 */
        isReal: boolean;
        /** 是否原始（非插值）点位 */
        isOriginal: boolean;
        /** 总长度 */
        totalLen: number;
        /** 线段长度 */
        segmentLen: number;
        /** 属性 */
        data: {
            [key: string]: any;
        };
        /** 前一个非插值点位 */
        pre: TyphoonPoint;
        feature: any;
        pointStyle: any;
        lineStyle: any;
        circleStyle: any[];
        extStyle: any[];
        constructor();
        clone(): TyphoonPoint;
        hide(): void;
        showNormal(): void;
        showCircle(onlyReal?: boolean, ...exts: any[]): void;
    }
    /** 预报风圈的类型 */
    enum ForecastRadiusType {
        "normal" = "normal",
        "GD" = "\u5E7F\u4E1C\u6C14\u8C61\u5C40"
    }
    export interface TyphoonTextStyle {
        /** 是否启用 */
        enable?: boolean;
        /** 字体 */
        font?: string;
        /** 颜色 */
        color?: string;
        /** 偏移X */
        offsetX?: number;
        /** 偏移Y */
        offsetY?: number;
    }
    /** 台风区域样式 */
    export interface TyphoonAreaStyle {
        /** 填充色 */
        fillColor?: string;
        /** 线颜色 */
        lineColor?: string;
        /** 线宽 */
        lineWidth?: number;
        /** 虚线设置 */
        lineDash?: number[];
    }
    /** 台风去设置 */
    export interface TyphoonCircle extends TyphoonAreaStyle {
        name: string;
    }
    /** 台风数据 */
    export interface TyphoonData {
        /** 台风ID */
        id: string;
        /** 台风代号 */
        name: string;
        /** 字段列表 */
        fields: string[];
        /** 数据 */
        values: (any[] | {
            [key: string]: any;
        })[];
        /** 字段映射 */
        fieldMap: {
            [key: string]: string;
        };
    }
    export interface TyphoonOption {
        /** 台风数据 */
        data: TyphoonData;
        /** 风圈列表 */
        circles?: TyphoonCircle[];
        /** 动画间隔毫秒，默认值50 */
        interval?: number;
        /** 插值间距，默认值10000 */
        interpDistance?: number;
        /** 色表 */
        colors?: ColorTable;
        /** 台风图标 */
        icon?: string;
        /** 预报圈配置 */
        forecast?: TyphoonAreaStyle;
        /** 标签配置 */
        label?: TyphoonTextStyle;
        singleColorLine?: boolean;
        forecastRadiusType?: ForecastRadiusType;
    }
    /** 台风对象 */
    export class Typhoon {
        /** 广东气象局概率圈半径映射表 */
        private static radiusMap;
        /** 原始数据 */
        private _data;
        /** 所有原始点位 */
        private _originalPoints;
        /** 实际点位 */
        private _realPoints;
        /** 实际点位插值 */
        private _realPointsInterp;
        /** 预报点位 */
        private _forcastPoints;
        /** 所有用于显示的点位，_realPointsInterp + _forcastPoints */
        private _allShowPoints;
        /** 数据范围 */
        private _extent;
        /** OL图层 */
        private _layer;
        /** OL数据源 */
        private _source;
        /** 台风圈定义 */
        private _circles;
        /** 色表 */
        private _colors;
        /** 动画间隔 */
        private _interval;
        /** 插值间距 */
        private _interpDistance;
        /** 台风图标样式 */
        private _labelStyle;
        /** 预报区样式 */
        private _forecastStyle;
        /** 台风路径动画句柄 */
        private _playHandle;
        /** 台风图标 */
        private _iconOverlay;
        /** 图标动画句柄 */
        private _iconReqHandle;
        /** 预报区样式 */
        private _forecastStyleOL;
        /** 预报去多边形 */
        private _forecastPolygon;
        /** 当前台风节点 */
        private _currentNode;
        /** 单色路径线 */
        private _singleColorLine;
        private _forecastRadiusType;
        private _showForecastCircle;
        /** 台风图标库 */
        private _iconCanvass;
        constructor(option: TyphoonOption);
        get layer(): any;
        get source(): any;
        get overlays(): any[];
        /** 当前台风节点 */
        get current(): TyphoonPoint;
        /** 当前台风的色表 */
        get colors(): ColorTable;
        /**
         * 获取预报圈
         */
        get forecastPolygon(): any;
        /** 获取指定节点的台风圈 */
        getTyphoonCircle(node: TyphoonPoint): {
            name: string;
            polygon: any;
        }[];
        /** 播放台风移动动画 */
        play(): void;
        /** 停止动画 */
        stop(): void;
        isPlaying(): boolean;
        /** 第一个预报数据 */
        firstForecast(): TyphoonPoint;
        /**
         * 显示或者隐藏台风路径图
         * @param v
         */
        setVisible(v: boolean): void;
        /** 获取对象是否可见 */
        getVisible(): boolean;
        /** 设置色表 */
        setColors(colors: ColorTable): void;
        /**
         * 获取当前点位的图元
         * @param map 地图对象
         * @param px 坐标x
         * @param py 坐标y
         * @param to 容差
         * @returns
         */
        getValue(map: any, px: number, py: number, to?: number): TyphoonPoint;
        /**
         * 获取当前像素点的图元
         * @param map 地图对象
         * @param pixel 像素点位
         * @param to 容差
         * @returns
         */
        getValueAtPixel(map: any, pixel: number[], to?: number): TyphoonPoint;
        /**
         * 设置当前显示的台风圈
         * @param tp
         */
        setCurrent(tp: TyphoonPoint): void;
        destroy(): void;
        /** 初始化台风路径和风圈 */
        private _init;
        /** 初始化预报点位起点，预报点位的起点由 `预报时间 - 预报时效` 确定*/
        private _initForcastOrigin;
        /**
         * 通过插值计算缺失的台风风圈半径信息
         * @param pts 台风点位列表
         */
        private _interpCircleRadii;
        /**
         * 插值台风路径
         * @param pts 台风点位
         * @returns 插值后和的台风点位表
         */
        private _interpTyphoonLine;
        /**
         * 在两点间插值
         * @param p0 起点
         * @param p1 终点
         * @param interpGap 插值间距
         * @returns 插值结果
         */
        private _interp;
        /** 创建OpenLayers图层 */
        private _createLayer;
        /**
         * 更新样式
         */
        private _updateStyle;
        private _getTyphoonIcon;
        /** 初始化台风旋转图标 */
        private _initTyphoonIcon;
        private _getLineColor;
        /** 台风要素样式 */
        private _typhoonStyle;
        /**
         * 创建台风圈
         * @param cx 中心坐标X
         * @param cy 中心坐标Y
         * @param radiusData 风圈半径
         * @returns
         */
        private _createCircle;
        private _getRaidusByForecast;
        private _getRaidusByForecastGD;
        private _getRaidusByForecastNormal;
        /** 创建台风预报风圈 */
        private _createForecastCircle;
    }
    export interface TyphoonLayerOption extends BaseLayerOption {
        /** 色表 */
        colors?: ColorTable;
        /** 图标 */
        icon?: string;
    }
    export class TyphoonLayer extends BaseAbstractLayer {
        private _layer;
        private _typhoons;
        private _warnOverlays;
        private _clickEventKey;
        private _colors;
        private _icon;
        constructor(map: any, option?: TyphoonLayerOption);
        get layer(): any;
        get soruce(): any;
        get typhoons(): Typhoon[];
        setVisible(visible: boolean): void;
        /** 更新台风图标可见性 */
        udpateIconVisible(...baseVisibles: boolean[]): void;
        update(): void;
        destroy(): void;
        /** 播放所有台风动画 */
        play(): void;
        /** 停止所有台风动画 */
        stop(): void;
        /**
         * 设置色表
         * @param colors
         */
        setColors(colors: ColorTable): void;
        /** 获取色表 */
        getColors(): ColorTable;
        /**
         * 添加台风
         * @param option
         */
        addTyphoon(option: TyphoonOption): void;
        /** 移除台风 */
        removeTyphoon(index: number): void;
        /** 清除 */
        clear(): void;
        /**
         * 启用单击功能
         */
        enableClick(): void;
        /** 禁用点击事件 */
        disableClick(): void;
        /**
         * 获取当前点位的图元
         * @param map 地图对象
         * @param px 坐标x
         * @param py 坐标y
         * @param to 容差
         * @returns
         */
        getValue(px: number, py: number, to?: number): {
            typhoon: Typhoon;
            point: TyphoonPoint;
        };
        private _initWarnLine;
    }
    export {};
}
declare namespace OLE {
    class PointF {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    function addPoint(...pts: PointF[]): PointF;
    interface WindArrowLayerOption extends OLE.BaseCanvasLayerOption {
    }
    /**
     * 栅格数据可视化图层
     */
    class WindArrowLayer extends OLE.BaseCanvasLayer {
        /**
         * 栅格数据
         */
        private _datau;
        private _datav;
        /**
         * 栅格横向像元数目
         */
        private _xcells;
        /**
         * 栅格纵向像元数目
         */
        private _ycells;
        /**
         * 栅格数据的范围
         */
        private _dataExtent;
        /**
         * 栅格数据像元的宽度
         */
        private _cellWidth;
        /**
         * 栅格数据像元的高度
         */
        private _cellHeight;
        /**
         * 风矢尺寸
         */
        private _arrowSize;
        /**
         * 风矢颜色
         */
        private _arrowColor;
        private _drawExtent;
        /**
         * 构造一个 RasterLayer 对象
         * @param map OpenLayers map 对象
         */
        constructor(map: any, option?: WindArrowLayerOption | Window);
        /**
         * 风矢的大小，单位像素
         */
        get arrowSize(): number;
        set arrowSize(val: number);
        /**
         * 风矢的颜色
         */
        get arrowColor(): string;
        set arrowColor(clr: string);
        /**
         * 设置数据
         * @param option
         */
        setDataOption(option: {
            datau: UnpackRasterData;
            datav: UnpackRasterData;
            xcells: number;
            ycells: number;
            extent: number[];
        }): void;
        /**
         * 设置数据
         * @param xcells
         * @param ycells
         * @param range 数据的空间范围
         */
        setData(datau: ArrayLike<any>, datav: ArrayLike<any>, xcells: number, ycells: number, range: number[]): void;
        /** @override */
        clear(): void;
        /**
         * 获取指定位置的数据
         * @param x
         * @param y
         * @returns
         */
        getValue(x: number, y: number): any[];
        /**
         * ImageCanvas数据源的处理回调函数
         * @param extent
         * @param resolution
         * @param pixelRatio
         * @param size
         * @param projection
         */
        protected _canvasFunction(extent: number[], resolution: number, pixelRatio: number, size: [number, number], projection: string): HTMLCanvasElement;
        private drawWindUV;
        /**
         * 绘制风矢
         * @param cellx
         * @param celly
         * @param speed 风速
         * @param dir 风向
         * @returns
         *
         * 风矢图三角代表20km/s，长线代表4km/s，短线代表2km/s
         */
        private drawWind;
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
    interface LineStyle {
        width?: number;
        color?: string;
    }
    interface LabelStyle {
        font?: string;
        color?: string;
    }
    /** 图例 */
    interface LegendItem {
        title: string;
        icon: string;
        image?: HTMLCanvasElement | HTMLImageElement;
    }
    interface TableBarItem {
        value: string;
        cols?: number;
        labelStyle?: LabelStyle;
        lineStyle?: LineStyle;
    }
    interface TableBar {
        docked?: DockedBarOption;
        rows: (TableBarItem | string)[][];
        cellWidth?: number;
        cellHeight?: number;
        labelStyle?: LabelStyle;
        lineStyle?: LineStyle;
    }
    interface LegendBar {
        docked?: DockedBarOption;
        dir?: 'horizontal' | 'vertical';
        items: LegendItem[];
        rows?: number;
        cols?: number;
        cellWidth?: number;
        cellHeight?: number;
        iconWidth?: number;
        iconHeigth?: number;
        title?: string;
        titleStyle?: LabelStyle;
        labelStyle?: LabelStyle;
        lineStyle?: LineStyle;
    }
    type ScaleUnit = 'degrees' | 'imperial' | 'nautical' | 'metric' | 'us';
    interface ScaleBar {
        docked?: DockedBarOption;
        minWidth?: number;
        units?: ScaleUnit;
        labelStyle?: LabelStyle;
        lineStyle?: LineStyle;
    }
    interface GeoGridLayerOption {
        range: number[];
        xgap?: number;
        ygap?: number;
        frameGap?: number;
        hasFrame?: boolean;
        hasGrid?: boolean;
        hasMask?: boolean;
        fixedNum?: number;
        bkColor?: string;
        title?: string;
        titleStyle?: LabelStyle;
        subtitle?: string;
        subtitleStyle?: LabelStyle;
        texts?: [];
        labelStyle?: LabelStyle;
        gridStyle?: LineStyle;
        frameStyle?: LineStyle;
        borderStyle?: LineStyle;
        /**
         * 图例
         */
        legendBar?: LegendBar;
        /** 比例尺 */
        scaleBar?: ScaleBar;
        /** 信息框 */
        infoTable?: TableBar;
    }
    export class GridMapView {
        private _map;
        private _canvas;
        private _context;
        private _option;
        private _frame;
        private _viewState;
        private _scaleBar;
        private _legendBar;
        private _infoBar;
        private _lines;
        private _labels;
        private _eventKey;
        constructor(map: any, option: GeoGridLayerOption);
        private _createCanvas;
        static toOneNumber(val: number): number;
        static calcDefaultGaps(range: number[]): {
            defgap: number;
            mingap: number;
        };
        /** 更新 */
        private _createGrid;
        private _initLegends;
        destroy(): void;
        private _createLineByRange;
        private _createLine;
        private _createLineX;
        private _createLineY;
        private _createLines;
        private _createLabel;
        private _drawExtent;
        private _drawWidth;
        private _drawHeight;
        private _drawCW;
        private _drawCH;
        private _toDevPoint;
        private _toDevRect;
        private _handlePostCompose;
        private _drawGrid;
        private _applyLineStyle;
        private _applyLabelStyle;
        private _applyLineTypeStyle;
        private _drawLine;
        private _drawTitle;
        private _drawCornerLabel;
        private _drawLabel;
        private _drawScale;
        private _drawLegends;
        private _drawTable;
    }
    export {};
}
declare namespace OLE {
    /** 水平方位 */
    type SwipePositioningH = 'left' | 'right';
    /** 垂直方位 */
    type SwipePositioningV = 'top' | 'bottom';
    /** 卷帘方位 */
    type SwipePositioning = SwipePositioningH | SwipePositioningV | `${SwipePositioningH}-${SwipePositioningV}`;
    /** 添加图层选项 */
    interface AddLayerSwipeOption {
        /** 图层对象 */
        layer: any;
        /** 方位 */
        positioning: SwipePositioning;
    }
    /** 图层卷帘效果 */
    class LayerSwipe {
        /** 地图对象 */
        private _map;
        /** 图层列表 */
        private _layers;
        /** 水平位置 */
        private _x;
        /** 垂直位置 */
        private _y;
        /**
         * 构造一个新的LayerSwipe
         * @param map OpenLayer 地图对象
         */
        constructor(map: any);
        /**
         * 添加图层
         * @param option 图层信息
         */
        addLayer(option: AddLayerSwipeOption): void;
        /**
         * 移除图层
         * @param layer 图层
         */
        removeLayer(layer: any): void;
        /** 清空 */
        clear(): void;
        /**
         * 设置卷帘的像素X坐标位置
         * @param x X坐标
         */
        setSwipePixelX(x: number): void;
        /**
         * 设置卷帘的像素Y坐标位置
         * @param y Y坐标
         */
        setSwipePixelY(y: number): void;
        /**
         * 设置卷帘的像素坐标位置
         * @param x X坐标
         * @param y Y坐标
         */
        setSwipePixel(x?: number, y?: number): void;
        /**
         * 设置卷帘的相对位置
         * @param x x坐标[0.0-1.0]
         */
        setSwipePosX(x?: number): void;
        /**
         * 设置卷帘的相对位置
         * @param y y坐标[0.0-1.0]
         */
        setSwipePosY(y?: number): void;
        /**
         * 设置卷帘的相对位置
         * @param x x坐标[0.0-1.0]
         * @param y y坐标[0.0-1.0]
         */
        setSwipePos(x?: number, y?: number): void;
        private _on_precompose;
        private _on_postcompose;
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
    type Point2d = [number, number];
    class GeoMath {
        static triangleArea(a: Point2d, b: Point2d, c: Point2d): number;
        static intersect(a: Point2d, b: Point2d, c: Point2d, d: Point2d, e?: Point2d, segment?: boolean): boolean;
    }
}
declare namespace OLE {
    /**
     * 解决deflate编码的数据
     * @param arr 编码的数据
     * @returns 解码的数据
     * @internal
     */
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
    /**
     * 计算数据值得最大值和最小值
     * @param data 带计算的数据
     * @returns 最大值和最小值 `[min,max]`
     */
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
    /**
     * 是否定义（不为null和undefined）
     * @param val 待判断的变量
     * @returns 是否定义
     */
    function defined(val: any): boolean;
    /**
     * 返回定义的值或者默认值
     * @param val 输入值
     * @param def 默认值
     * @returns 定义的值或者默认值
     */
    function defaultValue<T>(val: T, def?: T): T;
    /**
     * 从多个输入值中按顺序返回最先定义的值
     * @param vals 待检测的值列表
     * @returns 最先定义的值或者`undefined`
     */
    function defaultValues<T>(...vals: T[]): T;
    /**
     * 深拷贝
     * @param target 目标
     * @param sources 源
     * @returns 结果
     */
    function deepAssign(target: object, ...sources: any[]): any;
    function getFontSize(font: string): number;
    /**
     * 使用随机数，生产一个伪GUID
     */
    function guid(): string;
}
declare const RasterEngine: typeof OLE;
declare const PointEngine: typeof OLE;
interface Array<T> {
    last(): T | undefined;
}
declare namespace OLE {
    class IconCache {
        static initImage(url: string, complate: (img: HTMLImageElement) => void): HTMLImageElement;
        static getImage(url: string): HTMLImageElement;
    }
}
declare namespace OLE {
    /** 创建 Promise<HTMLImageElement> */
    function createImagePromise(src: string, option?: {
        cancel?: boolean;
    }): Promise<HTMLImageElement>;
    function toUrlParams(params: Record<string, any>): string;
}
