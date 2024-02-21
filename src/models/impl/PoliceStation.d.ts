import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
/** 警务站组件实现类 */
declare class PoliceStation extends CompInterface {
    constructor(type: MapLayerMenuEnum);
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
export default PoliceStation;
