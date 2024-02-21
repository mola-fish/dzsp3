import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import EventBus from '../../utils/EventBus'
import ModelsEventEnum from '../enum/ModelsEventEnum';

/** 摄像头组件实现类 */
class CameraComponents extends CompInterface {
    // eslint-disable-next-line no-useless-constructor
    constructor () {
        super(MapLayerMenuEnum.CAMERA);
    }
    zoomTo(): void {
      throw new Error('Method not implemented.');
    }
    lookAt(): void {
      throw new Error('Method not implemented.');
    }
    destroy(): boolean {
      throw new Error('Method not implemented.');
    }

    openCamera () {

    }

    click({e, args, el}): void {
        const [pickedFeature , pickedLayer, instance] = args;
        //
        const prop = pickedFeature.properties;
        console.log('后台数据：', prop);
        
        /// do something
        EventBus.emit(ModelsEventEnum.RECORD_CAMERA_CLICK, [e, pickedFeature , pickedLayer, instance])
    }

    hover({e, args, el}): void {
        const [pickedFeature , pickedLayer, instance] = args;
        console.log(e.type);
    }
}

export default CameraComponents;
