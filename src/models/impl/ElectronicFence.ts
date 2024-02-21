import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";

/** @deprecated 电子围栏组件实现类 */
class ElectronicFence extends CompInterface {
    // eslint-disable-next-line no-useless-constructor
    constructor (type: MapLayerMenuEnum) {
        super(type);
    }

    click({e, args, el}): void {
    }

    hover({e, args, el}): void {
    }

}

export default ElectronicFence;
