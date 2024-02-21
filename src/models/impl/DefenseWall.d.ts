import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
/** 防攀爬网组件实现类 */
declare class DefenseWall extends CompInterface {
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
export default DefenseWall;
