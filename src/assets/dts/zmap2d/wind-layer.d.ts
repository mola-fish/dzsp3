declare namespace WindEngine {
    type ProgramWrapper = {
        program: WebGLProgram;
        vs: WebGLShader;
        fs: WebGLShader;
        uniforms: any;
        attributes: any;
    };
    function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): ProgramWrapper;
    function deleteProgram(gl: WebGL2RenderingContext, warp: ProgramWrapper): undefined;
    function createTexture(gl: WebGL2RenderingContext, filter: number, data: any, width: number, height: number): WebGLTexture;
    function createTextureEx(gl: WebGL2RenderingContext, filter: number, data: any, width: number, height: number, ifmt: number, fmt: number, type: number): WebGLTexture;
    function createRenderbuffer(gl: WebGL2RenderingContext, width: number, height: number): WebGLRenderbuffer;
    function deleteGLObject(gl: WebGL2RenderingContext, glo: WebGLTexture | WebGLBuffer | WebGLProgram | WebGLFramebuffer | WebGLShader | WebGLRenderbuffer): undefined;
    function bindTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, unit: number): void;
    function createVertexBuffer(gl: WebGL2RenderingContext, data: BufferSource): WebGLBuffer;
    function createIndexBuffer(gl: WebGL2RenderingContext, data: BufferSource): WebGLBuffer;
    function bindAttribute(gl: WebGLRenderingContextBase, buffer: WebGLBuffer, attribute: number, numComponents: number): void;
    function bindElement(gl: WebGLRenderingContextBase, buffer: WebGLBuffer): void;
    function bindFramebuffer(gl: WebGL2RenderingContext, framebuffer: WebGLFramebuffer, texture?: WebGLTexture): void;
    function bindRenderbuffer(gl: WebGLRenderingContextBase, framebuffer: WebGLFramebuffer, colorRenderBuffer?: WebGLRenderbuffer): void;
}
declare namespace WindEngine {
    const Shaders: {
        DrawVert: string;
        DrawFrag: string;
        QuadVert: string;
        UpdateFrag: string;
        ScreenVert: string;
        ScreenFrag: string;
    };
}
declare namespace WindEngine {
    /** 参数体 */
    type WindGLDataOption = {
        data?: ArrayLike<number>;
        datau?: ArrayLike<number>;
        datav?: ArrayLike<number>;
        noDataValueU?: number;
        noDataValueV?: number;
        width: number;
        height: number;
        extent: number[];
        flipY?: boolean;
    };
    /**
     * 基于WebGL的风场绘制模块
     */
    class WindGL {
        private _memCanvas;
        private _memContext;
        private _numParticles;
        /**
         * 点的尺寸
         */
        pointSize: number;
        /**
         * 不透明度
         */
        opacity: number;
        /**
         * 速度过滤器
         */
        spdFilterMin: number;
        spdFilterMax: number;
        /**
         * 淡化因子
         * how fast the particle trails fade on each frame
         */
        fadeOpacity: number;
        /**
         * 速度因子
         * how fast the particles move
         */
        speedFactor: number;
        /**
        * 随机掉落
        * how often the particles move to a random place/drop rate increase relative to individual particle speed
        */
        dropRate: number;
        dropRateBump: number;
        /**
         * 粒子寿命因子
         */
        pointAge: number;
        private _tag;
        /**
         * 用于保存粒子的纹理尺寸
         * 粒子数目等于 纹理尺寸的平方
         */
        private particleStateResolution;
        /**
         * 绘制粒子的shader
         */
        private _drawProgram;
        /**
         * 绘制纹理的shader
         */
        private _screenProgram;
        /**
         * 更新粒子状态的shader
         */
        private _updateProgram;
        /**
         * 矩形的顶点缓冲区，用于绘制的代理集合体
         * 由6个顶点<0,0>,<1,0>,<0,1>,<0,1>,<1,0>,<1,1>
         * 2个三角形构成
         */
        private _quadBuffer;
        private _framebuffer;
        private _RTTframebuffer;
        /**
         * 数据空间范围
         */
        private _extent;
        /**
         * 数据的分辨率
         */
        private _width;
        private _height;
        private _maxValue;
        private _maxColor;
        /** 绘制范围 */
        private _drawExtent;
        /** 单位绘制范围 */
        private _inExtent;
        /** 后台缓冲区 */
        private _backgroundRenderBuffer;
        /** 前台缓冲区 */
        private _screenRenderBuffer;
        private _biltTexture;
        /** 色表 */
        private _colorRampTexture;
        /** 风场数据纹理 */
        private _windTexture;
        /** 粒子状态纹理 */
        private _particleStateTexture0;
        private _particleStateTexture1;
        /** 粒子顶点缓冲区 */
        private _vertexBuffer;
        /** 粒子的索引缓冲区 */
        private _indexBuffer;
        /**
         * 构造一个新的风场绘制对象
         */
        constructor();
        /**
         * 设置风场数据
         * @param datau 风场数据U
         * @param datav 风场数据V
         * @param width 数据列数
         * @param height 数据行数
         * @param extent 数据空间范围
         */
        setWindUV(datau: ArrayLike<number>, datav: ArrayLike<number>, width: number, height: number, extent: number[]): void;
        /**
         * 设置风场数据
         * @param data 风场数据
         * @param width 数据列数
         * @param height 数据行数
         * @param extent 数据范围
         */
        setWind(data: ArrayLike<number>, width: number, height: number, extent: number[]): void;
        /**
         * 获取参数信息
         */
        get params(): Object;
        /**
         * 设置参数信息
         */
        set params(config: Object);
        /**
         * 设置风场数据
         * @param option
         */
        setWindData(option: WindGLDataOption): void;
        /**
         * 设置色表
         * @param colors
         */
        setColors(colors: Array<string | {
            min: number;
            max: number;
            color: string;
        }>): void;
        /**
         * 设置粒子的数目
         */
        set numParticles(numParticles: number);
        get numParticles(): number;
        /**
         * 更新画布大小
         * @param width 画布宽度
         * @param height 画布高度
         */
        updateSize(width: number, height: number): void;
        /**
         * 更新绘制范围
         * @param extent
         */
        updateExtent(extent: number[]): void;
        /**
         * 销毁当前对象
         */
        destroy(): void;
        /**
         * 获取画布
         */
        get canvas(): HTMLCanvasElement;
        /**
         * 创建内存 Canvas缓存
         */
        private _createMemoryCanvas;
        /**
         * 绘制一帧
         */
        draw(): void;
        /**
         * 绘制
         */
        private _drawScreen;
        /**
         * 绘制粒子
         */
        private _drawParticles;
        /**
         * 绘制纹理
         * @param texture
         * @param opacity
         */
        private _drawTexture;
        /**
         * 更新粒子状态
         */
        private _updateParticles;
    }
}
declare namespace WindEngine {
    class WindOlLayer {
        private _map;
        private _view;
        private _layer;
        private _source;
        private _wind;
        private _afHandle;
        constructor(map: any);
        get layer(): any;
        get windGL(): WindGL;
        setWindUV(datau: ArrayLike<number>, datav: ArrayLike<number>, width: number, height: number, extent: number[]): void;
        setWind(data: ArrayLike<number>, width: number, height: number, extent: number[]): void;
        setWindData(option: WindGLDataOption): void;
        /**
         * 销毁图形对象
         */
        destroy(): void;
        /**
         * 创建openlayers图层
         */
        private _createLayer;
        /**
         * ImageCanvas数据源的处理回调函数
         * @param extent
         * @param resolution
         * @param pixelRatio
         * @param size
         * @param projection
         */
        private _canvasFunction;
        private _flagNum;
        private _flag;
        private _render;
    }
}
