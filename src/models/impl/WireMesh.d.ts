import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
/** 铁丝网组件实现类 */
declare class WireMesh extends CompInterface {
    constructor(type: MapLayerMenuEnum);
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
export default WireMesh;
