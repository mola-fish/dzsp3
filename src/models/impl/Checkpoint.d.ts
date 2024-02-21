import CompInterface from '../interface/CompInterface';
/** 检查站组件实现类 */
declare class Checkpoint extends CompInterface {
    constructor();
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
export default Checkpoint;
