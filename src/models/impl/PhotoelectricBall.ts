import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";

/** 光电球组件实现类 */
class PhotoelectricBall extends CompInterface {
    // eslint-disable-next-line no-useless-constructor
    constructor (type: MapLayerMenuEnum) {
        super(type);
    }

    click({e, args, el}): void {
    }

    hover({e, args, el}): void {
    }

}

export default PhotoelectricBall;
