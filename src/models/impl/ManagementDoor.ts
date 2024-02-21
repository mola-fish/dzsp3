import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import EventBus from '../../utils/EventBus'
import ModelsEventEnum from "../enum/ModelsEventEnum";

/** 门禁组件实现类 */
class ManagementDoor extends CompInterface {
    // eslint-disable-next-line no-useless-constructor
    constructor (type: MapLayerMenuEnum) {
        super(type);
    }

    click({e, args, el}): void {
        const [pickedFeature , pickedLayer, instance] = args;
        /// do something
        EventBus.emit(ModelsEventEnum.RECORD_DOOR_CLICK, [e, pickedFeature , pickedLayer, instance])
    }

    hover({e, args, el}): void {
    }

}

export default ManagementDoor;
