import CompInterface from '../interface/CompInterface';
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import EventBus from '../../utils/EventBus'
import ModelsEventEnum from "../enum/ModelsEventEnum";

/** 视频会议组件实现类 */
class VideoMeeting extends CompInterface { 
    // eslint-disable-next-line no-useless-constructor
    constructor (type: MapLayerMenuEnum) {
        super(type);
    }

    click({e, args, el}): void {
      const [pickedFeature , pickedLayer, instance] = args;
      const prop = pickedFeature.properties;

      /// do something
      EventBus.emit(ModelsEventEnum.RECORD_VIDEO_MEETING_CLICK, prop);

    }

    hover({e, args, el}): void {
    }

}

export default VideoMeeting;
