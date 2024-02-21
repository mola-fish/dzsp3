import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";

/** 北斗组件实现类 */
class Beidou extends CompInterface {
    constructor (type: MapLayerMenuEnum) {
        super(type);
    }

    click({e, args, el}): void {
    }

    hover({e, args, el}): void {
    }
}


export default Beidou;
