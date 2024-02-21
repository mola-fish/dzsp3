import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
/** all / none 组件 */
declare class AllComp extends CompInterface {
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
export default AllComp;
