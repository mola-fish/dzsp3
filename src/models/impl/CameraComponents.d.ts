import CompInterface from '../interface/CompInterface';
/** 摄像头组件实现类 */
declare class CameraComponents extends CompInterface {
    constructor();
    zoomTo(): void;
    lookAt(): void;
    destroy(): boolean;
    openCamera(): void;
    click({ e, args, el }: {
        e: any;
        args: any;
        el: any;
    }): void;
    hover({ e, args, el }: {
        e: any;
        args: any;
        el: any;
    }): void;
}
export default CameraComponents;
