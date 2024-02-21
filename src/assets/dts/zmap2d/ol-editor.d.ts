declare namespace OlExtends {
    /**
     * 可以编辑对象
     */
    export abstract class OlEditorable {
        protected _src: OlFeature;
        protected _tar: OlFeature;
        protected _srcGeo: OlGeometry;
        protected _tarGeo: OlGeometry;
        protected _onChanged: any;
        /** 编辑对象类型 */
        abstract get type(): string;
        /** 绘制几何类型 */
        abstract get drawGeoType(): string;
        /** 实际几何类型 */
        get targetGeoType(): string;
        /** 新建 */
        create(featrue: OlFeature): OlFeature;
        /** 修改 */
        modify(featrue: OlFeature, tar: OlFeature): OlFeature;
        release(): void;
        protected abstract update(): void;
    }
    type OlEditorableCreator = () => OlEditorable;
    export class OlEditorableFactory {
        static register(type: string, creator: OlEditorableCreator): void;
        static createEditorable(type: string): OlEditorable;
    }
    export const createEditorable: typeof OlEditorableFactory.createEditorable;
    export const register: typeof OlEditorableFactory.register;
    export {};
}
declare namespace OlExtends {
    /** 复杂对象 */
    abstract class ComplexOlEditorable extends OlEditorable {
    }
}
declare namespace OlExtends {
    class LineInterp {
        private _points;
        private _dists;
        private _accdists;
        private _length;
        constructor(points: number[][]);
        /**
         * 获取线条的长度
         */
        get length(): number;
        /**
         * 获取指定开始和结束的一段线段
         * @param start
         * @param end
         */
        sliceAlong(start: number, end: number): number[][];
        /**
         * 沿线获取指定距离的点
         * @param dist
         */
        pointAlong(dist: number): number[];
        private _init;
        private _getSect;
        private _getPoint;
        static interp(p0: number[], p1: number[], percent: number): number[];
        static distance(p0: number[], p1: number[]): number;
        static midpoint(p0: number[], p1: number[]): number[];
    }
}
/**
 * OpenLayer 扩展
 */
declare namespace OlExtends {
    interface OlEditorStyle {
        fill?: {
            color?: string;
        };
        line?: {
            width?: number;
            color?: string;
            lineDash?: number[];
        };
        icon?: {};
        circle?: {
            radius?: number;
            fill?: {
                color: string;
            };
            line?: {};
        };
        shape?: {};
    }
    /**
     * 绘制结束后执行
     */
    enum DrawFinished {
        /** 不执行任何动作 */
        NONE = "none",
        /** 继续绘制之前的图形 */
        CONTINUE = "continue",
        /** 选中绘制的图形 */
        SELECTED = "selected"
    }
    interface OlEditorOption {
        /** 目标图层 */
        layer?: any;
        /** 选中样式 */
        selectStyle?: OlEditorStyle;
        /** 编辑样式 */
        modifyStyle?: OlEditorStyle;
        /** 辅助线样式 */
        assistStyle?: OlEditorStyle;
        /** 选择框样式 */
        selboxStyle?: OlEditorStyle;
        /** 绘制结束后执行 */
        drawFinished?: DrawFinished;
        /** 选中后可移动 */
        moveableOnSelected?: boolean;
    }
    /**
     * OpenLayer 编辑扩展
     */
    export class OlEditor {
        /** 地图对象 */
        private _map;
        private _features;
        private _source;
        private _vector;
        private _translateFeature;
        private _translateFeatures;
        /** 当前活动的交互对象 */
        private _actions;
        /**  */
        private _assistStyle;
        private _selectStyle;
        private _modifyStyle;
        private _selboxStyle;
        /** 绘制结束后执行 */
        private _drawFinished;
        /** 选中后可移动 */
        private _moveableOnSelected?;
        /** 编辑的目标图层 */
        private _targetLayer;
        /** 编辑的图层的数据源 */
        private _targetSource;
        /** 编辑的要素集合 */
        private _targetFeatures;
        /** 当前选择的要素 */
        private _selectFeature;
        private _selectOldStyle;
        /**
         * 构造一个编辑器
         * @param map 地图对象
         * @param option 选项
         */
        constructor(map: any, option?: OlEditorOption);
        /** 设置修改样式 */
        set modifyStyle(style: any);
        /** 获取修改样式 */
        get modifyStyle(): any;
        /** 设置选择样式 */
        set selectStyle(style: any);
        /** 获取选择样式 */
        get selectStyle(): any;
        /** 辅助线样式 */
        set assistStyle(style: OlEditorStyle);
        /** 辅助线样式 */
        get assistStyle(): OlEditorStyle;
        /** 选择框样式 */
        set selboxStyle(style: OlEditorStyle);
        /** 选择框样式 */
        get selboxStyle(): OlEditorStyle;
        /** 绘制模式 */
        draw(option: {
            /** 创建几何的类型 */
            type: string;
            /** 几何的样式 */
            style?: OlEditorStyle;
            /** 编辑开始的回调 */
            onDrawStart?: (fea: any) => void;
            /** 边界结束时回调 */
            onDrawEnd?: (fea: any) => void;
            /** 自由绘制模式 */
            freehand?: boolean;
        }): void;
        /** 进入选择要素模式 */
        select(): void;
        /** 修改要素模式 */
        modify(feature?: any): void;
        /** 移动要素模式 */
        translate(feature?: any, noClearBefore?: boolean): void;
        /** 删除当前选择的要素 */
        delete(feature?: any): void;
        /** 清除操作 */
        clear(): void;
        /** 转换样式对象 */
        toOlStyle: typeof toOlStyle;
        /** 添加交互器 */
        private _addAction;
        /** 删除指定类型的交互器 */
        private _clearAction;
        /** 获取指定类型的交互器 */
        private _getAction;
        /** 清除之前的交互 */
        private _clearBefore;
        /** 清除选择 */
        private _clearSelect;
        /** 应用选择 */
        private _applySelectStyle;
        private _restoreSelectStyle;
        /** 有容差的选择 */
        private _selectFeatures;
    }
    function toOlStyle(style: OlEditorStyle): any;
    export {};
}
declare var ol: any;
declare var turf: any;
declare type OlGeometry = any;
declare type OlFeature = any;
declare namespace OlExtends {
    /**
     * 样条线
     */
    class SplineOlEditorable extends ComplexOlEditorable {
        /**
         * 编辑对象类型
         * @override
         */
        get type(): string;
        /**
         * @override
         */
        get drawGeoType(): string;
        /**
         * @override
         */
        update(): void;
    }
    /**
     * 冷锋
     */
    class ColdFrontEditorable extends SplineOlEditorable {
        /**
         * 编辑对象类型
         * @override
         */
        get type(): string;
        /**
         * 实际的几何类型
         * @override
         */
        get targetGeoType(): string;
        /**
         * @override
         */
        update(): void;
    }
    /**
     * 暖锋
     */
    class WarmFrontEditorable extends SplineOlEditorable {
        /** 编辑对象类型 */
        get type(): string;
        /**
         * 实际的几何类型
         * @override
         */
        get targetGeoType(): string;
        /**
         * @override
         */
        update(): void;
    }
}
declare namespace OlExtends {
    /** 简单对象 */
    class SimpleOlEditorable extends OlEditorable {
        /** 几何的类型 */
        private _type;
        /** 构建简单可绘制对象 */
        constructor(type: string);
        /**
         * 编辑对象类型
         * @override
         */
        get type(): string;
        /**
         * @override
         */
        get drawGeoType(): string;
        /** @override */
        protected update(): void;
    }
}
