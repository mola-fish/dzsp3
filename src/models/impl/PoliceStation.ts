import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";

/** 警务站组件实现类 */
class PoliceStation extends CompInterface {
    // eslint-disable-next-line no-useless-constructor
    constructor (type: MapLayerMenuEnum) {
        super(type);
    }

    openCamera () {
    }

    click({e, args, el}): void {
    }

    hover({e, args, el}): void {
    }
}

export default PoliceStation;
