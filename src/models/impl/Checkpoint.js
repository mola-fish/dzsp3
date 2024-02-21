import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
/** 检查站组件实现类 */
class Checkpoint extends CompInterface {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super(MapLayerMenuEnum.警务站);
    }
    openCamera() {
    }
    click({ e, args, el }) {
    }
    hover({ e, args, el }) {
    }
}
export default Checkpoint;
