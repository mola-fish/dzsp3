// 图层操作相关
// / <reference types="@/assets/dts/czmap-s.d.ts" />
import MapManager from "@/mapTool/MapManager";
import MapLayerControls from "@/models/control3D/MapLayerControls";
import EventBus from "@/utils/EventBus";
import Old from "@/mapTool/Old";
import Config from "@/tools/Config";
import { ref, onMounted, reactive, warn } from "vue";
import { usemapState } from "@/store/mapState";
import { SiteRequest } from "@/api/axios";
import { SitesData, Pointcg } from "@/types/site";
import axios from "axios";
import qs from "qs";
import { modeConfig } from "./ModeConfig";

const { Cesium } = Old;
const { CZMAP } = Old;
let map: any;
let that: any = {};
let mapLayerControls: any;
let smallpic: string[] = [
  "气象观测站",
  "智能气象感知设备",
  "交通气象站",
  "生态农业气象站",
];

let alreadymode:any[] = ['风廓线仪', 'X波段天气雷达', '浮标气象站', '气象观测站', '微波辐射仪', '气溶胶激光雷达', '毫米波测云仪', '垂直梯度观测站', '国家气象站', '测风激光雷达']

export const State = reactive({
  layerTreeInfo: [],
  mapLayerControls: null,
});

// 初始化
export const Mounted = async () => {
  Methods.getConfigFile();
  const mapManager = await MapManager.getStore("webContainer");
  map = mapManager.map;
  map.view.setCloud({ scale: 10, height: 1 }); //设置云层高度（不需要可去除）
  mapLayerControls = new MapLayerControls(mapManager.map);
  (window as any)._mapLayerControls = mapLayerControls;
  const mapState = usemapState();
  (window as any)._CZMAP = CZMAP;
  mapState.mapLayerControls = mapLayerControls;
  const config = await mapLayerControls.loadConfigByLocalUrl(
    Config.getConfigFile()
  );
};

// 方法
export const Methods = {
  // 获取配置参数
  async getConfigFile() {
    let res = await axios.get("./config.jsonc");
    const params = eval("(" + res.data + ")").params;
    Object.keys(params).forEach((item) => {
      that[item] = params[item];
    });
  },

  // 夸张地形
  aboutarea() {
    const that_: any = usemapState().that;
    mapLayerControls.map.rootLayer.terrains.filter((item:any) => {
      return item.visible
    })[0].setExaggeration(that.$url_degree);
  },

  /**
   * 站网分布
   */
  // 添加站点
  addSitePoints(name: string, points: SitesData[]) {
    const that_: any = usemapState().that;
    if (points.length === 0) return;
    interface MapType {
      [key: string]: string;
    }
    const map: MapType = {
      S波段天气雷达: "1",
      X波段天气雷达: "2",
      测风激光雷达: "3",
      城市冠层观测站: "4",
      "GNSS/MET水汽观测站": "5",
      风廓线仪: "6",
      港口能见度监测站: "7",
      高空气象观测站: "8",
      国家农业试验气象站: "9",
      国家气象站: "10",
      毫米波测云仪: "11",
      浮标气象站: "12",
      交通气象站: "13",
      气溶胶激光雷达: "14",
      桥梁风场及冰凌监测站: "15",
      生态农业气象站: "16",
      微波辐射仪: "17",
      智能气象感知设备: "18",
      气象观测站: "19",
      空间天气观测站: "20",
      气象卫星地面站: "21",
    };
    points.forEach((item) => {
      item.enType = map[item.type];
    });
    let layerConfig1 = {
      name: name,
      visible: true,
      type: "point",
      enableCluster: false,
      enableAnimation: false,
      data: {
        data: points,
        meta: {
          //epsg: 'type',
          x: "lng",
          y: "lat",
          z: "height",
        },
      },
      style: {
        label: {
          text: "{code}{abbreviation}",
          font: "18px 黑体",
          offset: [0, -100],
          color: "black",
          backgroundColor: "rgba(58,216,235,0.5)",
          backgroundBouderColor: "red",
          backgroundBorderWidth: 2,
          backgroundBorderRadius: 5,
          background: true,
          visible: false,
          visibleRange: [0, 50000],
          depthDistance: 10000000000,
        },
        icon: {
          src: that_.$url_svg + "/{enType}-{build_state}.png",
          width: 54,
          height: 54,
          offset: [0, 0],
          visibleRange: [400, 1769744],
          scaleDistance: [200, 1.6, 326974, 0.2],
          depthDistance: 10000000000,
        },
      },
    };
    mapLayerControls.addLayer(layerConfig1);
    Methods.setOffset();
    let ppoint = points.filter((item) => {
      return item.type == "S波段天气雷达" || item.type == "X波段天气雷达";
    });
    // 全部模型
    Methods.addModePoints(points)
    // 协同观测
    Methods.addMonPPoints(ppoint);
    Methods.addMonPoints();
    Methods.addAirModePoints(points);

    // 雷达
    let radarlist = points.filter((item: any) => {
      return item.type == "X波段天气雷达" || item.type == "S波段天气雷达";
    });
    Methods.addRadar(radarlist);

    // 地形夸张
    Methods.aboutarea()
  },

  // 添加模型
  addModePoints(points:any) {
    let children:any[] = [];
    let that:any = usemapState().that
    let surl = that.$url_debug?'http://192.168.8.215':'http://10.108.66.169'
    points.forEach((item:any) => {
      if (alreadymode.includes(item.type)) {
        if (item.type == "微波辐射仪" || item.type == "毫米波测云仪") {
          item.height = item.height - 0.9;
        }
        if (item.type == "垂直梯度观测站") {
          item.height = item.height - 2;
        }
        if (item.type == "国家气象站") {
          item.height = item.height - 1;
        }
        let p = [parseFloat(item.lng), parseFloat(item.lat), item.height];
        let url = surl + modeConfig[item.type].url;
        let layerConfig1 = {
          name: item.type,
          visible: true,
          type: "3dtiles",
          url: url,
          position: p,
          pose: [19, 0, 0],
        };
        children.push(layerConfig1);
      } else {
        let position = [
          parseFloat(item.lng),
          parseFloat(item.lat),
          parseFloat(item.height),
        ];
        let url =surl +  modeConfig["temp"].url;
        let layerConfig1 = {
          name: item.type,
          visible: true,
          type: "3dtiles",
          url: url,
          position: position,
          pose: [19, 0, 0],
        };
        children.push(layerConfig1);
      }
    });
    let folder = {
      type: "folder",
      name: "全部模型",
      children: children,
    };
    mapLayerControls.addLayer(folder);
  },

  // 针对站点进行大小修改
  setOffset() {
    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return pro.type == "微波辐射仪";
      })
      .forEach((item: any) => {
        item.style.icon.offset = [70 / 2, 0] as number[];
      });

    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return pro.type == "微波辐射仪";
      })
      .forEach((item: any) => {
        item.style.icon.offset = [-(70 / 2), 0];
      });

    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return pro.type == "测风激光雷达";
      })
      .forEach((item: any) => {
        item.style.icon.offset = [70 / 2, 0];
      });

    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return pro.type == "气溶胶激光雷达";
      })
      .forEach((item: any) => {
        item.style.icon.offset = [0, 70 / 2];
      });

    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return pro.type == "城市冠层观测站";
      })
      .forEach((item: any) => {
        item.style.icon.offset = [0, -(70 / 2)];
      });

    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return pro.type == "风廓线仪";
      })
      .forEach((item: any) => {
        item.style.icon.offset = [70 / 2, 70 / 2];
      });
    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return smallpic.includes(pro.type);
      })
      .forEach((item: any) => {
        item.style.icon.width = 54 / 2;
        item.style.icon.height = 54 / 2;
      });

    mapLayerControls
      .findByName("全部站点")[0]
      .children.filter((item: any) => {
        let pro = item.properties;
        return pro.type == "智能气象感知设备";
      })
      .forEach((item: any) => {
        item.style.icon.width = 54 / 4;
        item.style.icon.height = 54 / 4;
      });
  },

  /**
   * 协同观测
   */
  // 协观测站点（图标）
  addMonPPoints(p: any) {
    const that_: any = usemapState().that;
    let points = JSON.parse(JSON.stringify(p));
    interface MapType {
      [key: string]: string;
    }
    const map: MapType = {
      S波段天气雷达: "1",
      X波段天气雷达: "2",
      风廓线仪: "6",
      国家气象站: "10",
    };
    points.forEach((item: any) => {
      item.enType = map[item.type] + "-已建设";
    });
    let layerConfig1 = {
      name: "协同图标",
      visible: true,
      type: "point",
      enableCluster: false,
      enableAnimation: false,
      data: {
        data: points,
        meta: {
          //epsg: 'type',
          x: "lng",
          y: "lat",
          z: "height",
        },
      },
      style: {
        icon: {
          src: that_.$url_svg + "/{enType}.png",
          width: 54,
          height: 54,
          offset: [0, 0],
          visibleRange: [400, 1769744],
          scaleDistance: [200, 1.6, 326974, 1],
          depthDistance: 10000000000,
        },
      },
    };
    mapLayerControls.addLayer(layerConfig1);
  },

  // 协观测站点（线图标）
  addMonPoints() {
    const that_: any = usemapState().that;
    let points = [];
    interface LinePit {
      [name: string]: any;
    }
    let oute: LinePit = {
      lat: 30.603246304575357,
      lng: 112.47281567828742,
      height: 5132.213923157347,
      enType: "120km",
      width: 88 / 0.8,
      h: 35 / 0.8,
      offset: [0, 0],
      name: "120km",
    };
    let center: LinePit = {
      lat: 30.611777978225764,
      lng: 113.33778610491612,
      height: 5132.213923157347,
      enType: "60km",
      width: 88 / 0.8,
      h: 35 / 0.8,
      offset: [-20, 0],
      name: "60km",
    };
    let inner: LinePit = {
      lat: 30.964279191353416,
      lng: 113.76064252952123,
      height: 5132.213923157347,
      enType: "20km",
      width: 88 / 0.8,
      h: 35 / 0.8,
      offset: [0, 0],
      name: "20km",
    };
    points.push(oute);
    points.push(center);
    points.push(inner);
    let layerConfig1 = {
      name: "协同线图标",
      visible: true,
      type: "point",
      enableCluster: false,
      enableAnimation: false,
      data: {
        data: points,
        meta: {
          //epsg: 'type',
          x: "lng",
          y: "lat",
          z: "height",
        },
      },
      style: {
        icon: {
          src: that_.$url_svg + "/{enType}.png",
          width: "{width}",
          height: "{h}",
          offset: "{offset}",
          visibleRange: [400, 1769744],
          // scaleDistance: '{scaleDistance}',
          depthDistance: 10000000000,
        },
      },
    };
    mapLayerControls.addLayer(layerConfig1);
  },

  // 协同观测模型
  addAirModePoints(p: any) {
    const that_: any = usemapState().that;
    let children: any[] = [];
    let tempp = JSON.parse(JSON.stringify(p));
    let points = tempp.filter((item: any) => {
      return (
        item.type == "S波段天气雷达" ||
        item.type == "X波段天气雷达" ||
        item.type == "国家气象站" ||
        item.type == "风廓线仪"
      );
    });

    if (!that_.$url_debug) {
      var url = "http://10.108.66.169";
    } else {
      var url = "http://192.168.8.215";
    }
    interface MapType {
      [name: string]: any;
    }
    let modecfg: MapType = {
      S波段天气雷达: {
        url: url + "/data/3dtiles/03/tileset.json",
        scale: [100, 100, 100],
      },
      X波段天气雷达: {
        url: url + "/data/3dtiles/15/tileset.json",
        scale: [4000, 4000, 4000],
      },
      国家气象站: {
        url: url + "/data/3dtiles/13/tileset.json",
        scale: [200, 200, 200],
        pitch: 30,
      },
      风廓线仪: {
        url: url + "/data/3dtiles/04/tileset.json",
        scale: [900, 900, 900],
      },
    };

    points.forEach((item: any) => {
      if (item.type == "国家气象站") {
        item.height = item.height - 400;
      }
      if (item.type == "X波段天气雷达") {
        item.height = item.height - 4000;
      }
      if (item.type == "风廓线仪") {
        item.lng = item.lng - 0.1;
      }
      let p = [parseFloat(item.lng), parseFloat(item.lat), item.height];
      let url = modecfg[item.type].url;
      let scale = modecfg[item.type].scale;
      let layerConfig1;
      if (item.type != "风廓线仪") {
        layerConfig1 = {
          name: item.type,
          visible: false,
          type: "3dtiles",
          url: url,
          position: p,
          pose: [19, 0, 0],
          scale: scale,
        };
      } else {
        layerConfig1 = {
          name: "风廓线仪",
          visible: false,
          type: "dynActor",
          path: "/ZMapAssets/Models/Sundry/Radar/Radar6/BP_Radar6",
          position: p,
          pose: [100, 0, 0],
          scale: scale,
        };
      }
      children.push(layerConfig1);
    });
    let folder = {
      type: "folder",
      name: "协同观测模型",
      children: children,
    };
    mapLayerControls.addLayer(folder);
  },

  // 雷达
  addRadar(list: any) {
    let radarlist = list;
    let children: any[] = [];
    interface MapType {
      [name: string]: string;
    }
    let map: MapType = {
      S波段天气雷达: "/Radar8/BP_Radar8_2",
      X波段天气雷达: "/Radar7/BP_radar7_1",
      X波段天气雷达追踪: "/Radar7/BP_Radar7_3",
    };
    // 雷达扫描
    radarlist.forEach((item: any) => {
      item.murl = map[item.type];
      let temp = {
        type: "dynActor",
        name: item.type,
        build_state: item.build_state,
        county: item.county,
        speciality: "",
        path: "/ZMapAssets/Models/Sundry/Radar" + item.murl,
        visible: false,
        position: [parseFloat(item.lng), parseFloat(item.lat), item.height],
        pose: [0, 0, 0],
        scale: [100000, 100000, 100000],
      };
      children.push(temp);
    });
    let layerConfig = {
      type: "folder",
      name: "雷达",
      children: children,
    };
    mapLayerControls.addLayer(layerConfig);
  },
};
