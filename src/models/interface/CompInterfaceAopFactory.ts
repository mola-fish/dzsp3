import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import CompInterface from "./CompInterface";
import Beidou from "../impl/Beidou";
import BoundaryTablets from "../impl/BoundaryTablets";
import CameraComponents from "../impl/CameraComponents";
import Checkpoint from "../impl/Checkpoint";
import DutyRoom from "../impl/DutyRoom";
import ElectronicFence from "../impl/ElectronicFence";
import GridLineComponts from "../impl/GridLineComponts";
import ManagementDoor from "../impl/ManagementDoor";
import PhotoelectricBall from "../impl/PhotoelectricBall";
import PoliceStation from "../impl/PoliceStation";
import Radar from "../impl/Radar";
import Road from "../impl/Road";
import DefenseWall from "../impl/DefenseWall";
import VideoMeeting from "../impl/VideoMeeting";
import WireMesh from "../impl/WireMesh";
import AllComp from "../impl/AllComp";

type CompInterfaceAop = {
  key: MapLayerMenuEnum,
  fun: {new (type: MapLayerMenuEnum): CompInterface};
}


class CompInterfaceAopFactory {
  public static members: Array<CompInterfaceAop> = [];

  static register (key:MapLayerMenuEnum, value: {new (type: MapLayerMenuEnum): CompInterface}) {
      this.members.push({
        key,
        fun: value,
      })
  }

  static find (key: MapLayerMenuEnum) {
    const member = this.members.find(member => member.key === key)
    if(member){
        return member.fun;
    } else {
        return null;
    }
  }
}

CompInterfaceAopFactory.register(MapLayerMenuEnum.界碑, BoundaryTablets);
CompInterfaceAopFactory.register(MapLayerMenuEnum.CAMERA, CameraComponents);
CompInterfaceAopFactory.register(MapLayerMenuEnum.检查站, Checkpoint);
CompInterfaceAopFactory.register(MapLayerMenuEnum.执勤房, DutyRoom);
CompInterfaceAopFactory.register(MapLayerMenuEnum.门禁, ManagementDoor);
CompInterfaceAopFactory.register(MapLayerMenuEnum.防攀爬网, DefenseWall);
CompInterfaceAopFactory.register(MapLayerMenuEnum.光电球, PhotoelectricBall);
CompInterfaceAopFactory.register(MapLayerMenuEnum.警务站, PoliceStation);
CompInterfaceAopFactory.register(MapLayerMenuEnum.雷达, Radar);
CompInterfaceAopFactory.register(MapLayerMenuEnum.道路, Road);
CompInterfaceAopFactory.register(MapLayerMenuEnum.视频会议, VideoMeeting);
CompInterfaceAopFactory.register(MapLayerMenuEnum.铁丝网, WireMesh);
CompInterfaceAopFactory.register(MapLayerMenuEnum.北斗终端机, Beidou);
CompInterfaceAopFactory.register(MapLayerMenuEnum.北斗指挥机, Beidou);
CompInterfaceAopFactory.register(MapLayerMenuEnum.ALL, AllComp);

export default CompInterfaceAopFactory;
