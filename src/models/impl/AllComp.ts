import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";

/** all / none 组件 */
class AllComp extends CompInterface {
    // eslint-disable-next-line no-useless-constructor
    constructor (type: MapLayerMenuEnum) {
        super(type);
    }

    click({e, args, el}): void {
    }

    hover({e, args, el}): void {
    }

}

export default AllComp;
