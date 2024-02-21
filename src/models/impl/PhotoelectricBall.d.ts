import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
/** 光电球组件实现类 */
declare class PhotoelectricBall extends CompInterface {
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
export default PhotoelectricBall;
