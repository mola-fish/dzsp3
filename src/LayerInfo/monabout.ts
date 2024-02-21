import { usemapState } from "@/store/mapState";
import Old from "@/mapTool/Old";
let { CZMAP } = Old;
import axios from "axios";

let flag2: boolean = true;
let flag2Tlist: any[] = [];
let flashtimerI: any;
let flashtimerT: any;
let AirConfig: any;

// 漫游
let roam: any;
let roam2: any;

axios
  .get("/AirConfig.jsonc")
  .then((res) => {
    const params = eval("(" + res.data + ")");
    AirConfig = params.Airconfigs;
  })
  .catch((e) => {
    console.warn(new Error(e));
  });

const Methods = {
  // 协同观测还原操作
  closeMon() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    flag2 = false;
    clearTimeout(flashtimerT);
    clearInterval(flashtimerI);

    let layer = mapLayerControls.findByName('全部模型')[0].children.filter((item: any) => {
      return item._option.name != '国家气象站'
    }).forEach((item: any) => {
        item.visible = false
    })
    const layer2 = mapLayerControls.findByName("协同观测模型")[0];
    layer2 &&
      layer2.children.forEach((item: any) => {
        item.visible = false;
      });

    const layer3 = mapLayerControls.findByName("协同观测")[0];
    layer3 &&
      layer3.children.forEach((item: any) => {
        item.visible = false;
      });

    const layer4 = mapLayerControls.findByName("雷达")[0];
    layer4 &&
      layer4.children.forEach((item: any) => {
        item.visible = false;
      });

    const layer8 = mapLayerControls.findByName("协同线图标")[0];
    layer8 &&
      layer8.children.forEach((item: any) => {
        item.visible = false;
      });

    const layer9 = mapLayerControls.findByName("协同图标")[0];
    layer9 &&
      layer9.children.forEach((item: any) => {
        item.visible = false;
      });

    roam && roam.close();
    roam2 && roam2.close();
    if (flag2Tlist.length != 0) {
      flag2Tlist.forEach((item) => {
        clearTimeout(item);
      });
      flag2Tlist = [];
    }
  },

  //设置镜头
  setCamera(position: number[], heading: number, pitch: number, roll: number) {
    let mapLayerControls: any = usemapState().mapLayerControls;
    mapLayerControls.map.view.setViewInfo({
      position: position,
      heading: heading,
      pitch: pitch,
      roll: roll,
    });
  },

  // 飞行
  setflyCamera(
    position: number[],
    heading: number,
    pitch: number,
    roll: number
  ) {
    let mapLayerControls: any = usemapState().mapLayerControls;
    mapLayerControls.map.view.fly({
      position: position,
      heading: heading,
      pitch: pitch,
      roll: roll,
      distance: 0,
      duration: 2,
    });
  },

  // 天气改变
  changeWeather(type: any) {
    switch (type) {
      case "晴天":
        this.addWeather("晴天", (CZMAP as any).WeatherType.Sunny);
        break;
      case "小雨":
        this.addWeather("小雨", (CZMAP as any).WeatherType.Rain_Light);
        break;
      case "小雪":
        this.addWeather("小雪", (CZMAP as any).WeatherType.Snow_Light);
        break;
      case "雾":
        this.addWeather("雾", (CZMAP as any).WeatherType.Foggy);
        break;
      case "多云":
        this.addWeather("多云", (CZMAP as any).WeatherType.Cloudy);
        break;
      case "中雨":
        this.addWeather("中雨", (CZMAP as any).WeatherType.Rain);
        break;
      case "中雪":
        this.addWeather("小雪", (CZMAP as any).WeatherType.Snow_Light);
        break;
      case "扬尘":
        this.addWeather("扬尘", (CZMAP as any).WeatherType.Sand_Dust_Calm);
        break;
      case "阴天":
        this.addWeather("阴天", (CZMAP as any).WeatherType.Overcast);
        break;
      case "暴雨":
        this.addWeather("暴雨", (CZMAP as any).WeatherType.Rain_Thunderstorm);
        break;
      case "暴雪":
        this.addWeather("暴雪", (CZMAP as any).WeatherType.Snow_Blizzard);
        break;
      case "沙尘暴":
        this.addWeather("沙尘暴", (CZMAP as any).WeatherType.Sand_Dust_Storm);
        break;
    }
  },

  // 添加天气
  addWeather(name:string, weathor:any) {
    let mapLayerControls: any = usemapState().mapLayerControls;
    let map = mapLayerControls.map
    map.view.setWeather({
      weatherType: weathor,
      duration: 5,
    });
  },

  //异步方法
  //执行方法 - 延迟几秒 - 下一步
  MdelayT(fn: any, ms: any) {
    var p = new Promise(function (resolve, reject) {
      let t = setTimeout(function () {
        if (flag2) {
          resolve(fn);
        } else {
          reject("失败");
        }
      }, ms);
      flag2Tlist.push(t);
    });
    return p;
  },

  //云层移动
  Mroma(position: any, scale = [400, 400, 400], rotate = [0, 0, 0]) {
    let mapLayerControls: any = usemapState().mapLayerControls;
    roam = mapLayerControls.map.view.createPathRoam();
    roam.open(position, {
      // offset: [-100, 0, 50],
      // speed: 500,
      jumpToPath: false,
      trackLine: {
        show: false,
      },
      model: {
        /** 模型路径 */
        url: "/ZMapAssets/Models/Sundry/Cloud/Cloud1/BP_Cloud1",
        /** 模型缩放 */
        // scale: number,
        scale: scale,
        rotate: rotate,
        offset: [0, 0],
      },
    });
    roam.showline = false;
    roam.lockview = false;
    roam.follow = false;
    roam.firstview = false;
    roam.speed = 1;
    roam.modelForward = true;
    roam.loop = (CZMAP as any).PathRoamLoopType.NONE;
    roam.lineWidth = 10;
    roam.lineColor = "red";
    roam.start();
  },

  Mroma2(position: any) {
    let mapLayerControls: any = usemapState().mapLayerControls;
    roam2 = mapLayerControls.map.view.createPathRoam();
    roam2.open(position, {
      // offset: [-100, 0, 50],
      // speed: 500,
      jumpToPath: false,
      trackLine: {
        show: false,
      },
      model: {
        /** 模型路径 */
        url: "/ZMapAssets/Models/Sundry/QIqiu/BP_Qiqiu",
        /** 模型缩放 */
        // scale: number,
        scale: [5000, 5000, 5000],
        rotate: [-50, 0, 0],
        offset: [0, 0],
      },
    });
    roam2.showline = false;
    roam2.lockview = false;
    roam2.follow = false;
    roam2.firstview = false;
    roam2.speed = 1;
    roam2.modelForward = true;
    roam2.loop = (CZMAP as any).PathRoamLoopType.RETURN_TO_START;
    roam2.lineWidth = 10;
    roam2.lineColor = "red";
    roam2.start();
  },

  // 闪烁效果
  Mflash(arry: any[]) {
    flashtimerI = setInterval(() => {
      arry.forEach((item) => {
        item.visible = !item.visible;
      });
    }, 700);
    flashtimerT = setTimeout(() => {
      clearInterval(flashtimerI);
      arry.forEach((item) => {
        item.visible = true;
      });
    }, 4000);
  },

  //动画按钮1
  async MonA1() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    Methods.closeMon();
    flag2 = true;
    const layer9 = mapLayerControls.findByName("协同图标")[0];
    layer9 &&
      layer9.children.forEach((item: any) => {
        item.visible = true;
      });
    await Methods.MdelayT(Methods.Mon1(), 5000);
    await Methods.MdelayT(Methods.Mon2(), 5000);
  },

  // 动画一
  /*
    跳转至湖北省（标记），武汉市（标记）
    120km,60km,20km线展示
    上方展示卫星，云团向120km线移动
  */
  Mon1() {
    let position = AirConfig.camera1.position;
    let mapLayerControls: any = usemapState().mapLayerControls;
    let h = AirConfig.camera1.h;
    let p = AirConfig.camera1.p;
    let r = AirConfig.camera1.r;
    Methods.setCamera(position, h, p, r);
    const layer3 = mapLayerControls.findByName("协同观测")[0];
    layer3 &&
      layer3.children
        .filter((item: any) => {
          return (
            item.name == "省面" ||
            item.name == "卫星" ||
            item.name == "20km" ||
            item.name == "60km" ||
            item.name == "120km"
          );
        })
        .forEach((item: any) => {
          item.visible = true;
        });
    let rposition = AirConfig.cloudroma1;
    let scale = AirConfig.cloudscale1;
    Methods.Mroma(rposition, scale, [80, 80, 0]);

    const layer4 = mapLayerControls.findByName("雷达")[0];
    layer4 &&
      layer4.children.forEach((item: any) => {
        item.visible = true;
      });

    const layer5 = mapLayerControls.findByName("协同线图标")[0];
    layer5 &&
      layer5.children.forEach((item: any) => {
        item.visible = true;
      });
    console.warn(layer5);
  },

  /**
   * 到达120km
   * 120km线闪烁，雷达开始扫描
   */
  Mon2() {
    const that_: any = usemapState().that;
    let mapLayerControls: any = usemapState().mapLayerControls;
    let layer = mapLayerControls
      .findByName("协同观测")[0]
      .children.filter((item: any) => {
        return item.name == "120km";
      });
    Methods.Mflash(layer);
    // axios
    //   .post(that_.$url_bor, {
    //     netstationId: "123",
    //     netstationName: "测试站点",
    //     type: "test2",
    //     screentype: "showlayoutmon",
    //   })
    //   .then((data) => {});
  },

  /**
   * 动画按钮2
   * 60km
   * 探空气球
   */
  async MonA2() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    Methods.closeMon();
    console.warn(AirConfig);
    flag2 = true;
    // 初始化
    let position = AirConfig.camera1.position;
    let h = AirConfig.camera1.h;
    let p = AirConfig.camera1.p;
    let r = AirConfig.camera1.r;
    Methods.setCamera(position, h, p, r);
    const layer3 = mapLayerControls.findByName("协同观测")[0];
    layer3 &&
      layer3.children
        .filter((item: any) => {
          return (
            item.name == "省面" ||
            item.name == "20km" ||
            item.name == "60km" ||
            item.name == "120km"
          );
        })
        .forEach((item: any) => {
          item.visible = true;
        });
    const layer4 = mapLayerControls.findByName("雷达")[0];
    layer4 &&
      layer4.children.forEach((item: any) => {
        item.visible = true;
      });
    const layer7 = mapLayerControls.findByName("协同观测模型")[0];
    layer7 &&
      layer7.children.forEach((item: any) => {
        item.visible = true;
      });
    const layer6 = mapLayerControls.findByName("协同线图标")[0];
    layer6 &&
      layer6.children.forEach((item: any) => {
        item.visible = true;
      });
    await Methods.MdelayT(Methods.Mon4(), 2000);
    await Methods.MdelayT(Methods.Mon4_2(), 4000);
    await Methods.MdelayT(Methods.Mon5(), 4000);
    await Methods.MdelayT(Methods.Mon5_2(), 10000);
    await Methods.MdelayT(Methods.Mon6_2(), 12000);
  },

  /**
   * 视角跳转至60km范围处，
   * 云团继续移动，到达60km
   */
  Mon4() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    let position = AirConfig.camera2.position;
    let h = AirConfig.camera2.h;
    let p = AirConfig.camera2.p;
    let r = AirConfig.camera2.r;
    Methods.setflyCamera(position, h, p, r);
    roam && roam.close();
  },

  Mon4_2() {
    let rposition = AirConfig.cloudroma2;
    let scale = AirConfig.cloudscale2;
    Methods.Mroma(rposition, scale, [-120, 80, 0]);
  },

  /**
   * 到达60km，60km线闪烁
   * 设置雷达模型大小
   */
  Mon5() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    let layer2 = mapLayerControls
      .findByName("协同观测")[0]
      .children.filter((item: any) => {
        return item.name == "卫星";
      })
      .forEach((item: any) => {
        item.visible = false;
      });

    let layer = mapLayerControls
      .findByName("协同观测")[0]
      .children.filter((item: any) => {
        return item.name == "60km";
      });
    Methods.Mflash(layer);
  },

  /**
   * 雷达闪烁
   */
  Mon5_2() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer = mapLayerControls
      .findByName("协同观测模型")[0]
      .children.filter((pointLayer: any) => {
        return pointLayer.name == "X波段天气雷达";
      });
    Methods.Mflash(layer);
    let position = [114.35527146310845, 29.48733915374042, 122333.20650479954];
    let h = -1.5742556542826378;
    let p = 48.063106583958195;
    let r = 0;
    Methods.setflyCamera(position, h, p, r);
    roam && roam.close();
    roam2 && roam2.close();
    let rposition = [
      {
        position: [114.16815025410028, 30.66760228940204, 5104.9605696677545],
        speed: 6000,
        target: [],
      },
      {
        position: [116.17068996924051, 30.6545530090813, 60103.76775529592],
        speed: 6000,
        target: [],
      },
    ];
    Methods.Mroma2(rposition);
  },

  /**
   * 视角移近，
   * 探空气球放飞
   * 更换图标（？）
   * 关闭120,60km
   * 关闭大小雷达
   */
  Mon6_2() {
    roam2 && roam2.close();
  },

  /**
   * 动画按钮3
   * 20km
   */
  async MonA3() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    this.closeMon();
    flag2 = true;
    // 初始化
    let position = [114.35527146310845, 29.48733915374042, 122333.20650479954];
    let h = -1.5742556542826378;
    let p = 48.063106583958195;
    let r = 0;
    this.setCamera(position, h, p, r);
    const layer3 = mapLayerControls.findByName("协同观测")[0];
    layer3 &&
      layer3.children
        .filter((item: any) => {
          return (
            item.name == "20km" ||
            item.name == "垂直观测" ||
            item.name == "60km" ||
            item.name == "120km"
          );
        })
        .forEach((item: any) => {
          item.visible = true;
        });
    const layer7 = mapLayerControls.findByName("协同观测模型")[0];
    layer7 &&
      layer7.children.forEach((item: any) => {
        item.visible = true;
      });
    const layer8 = mapLayerControls.findByName("协同线图标")[0];
    layer8 &&
      layer8.children.forEach((item: any) => {
        item.visible = true;
      });
    await this.MdelayT(this.Mon7(), 5000);
    await this.MdelayT(this.Mon8(), 6200);
    await this.MdelayT(this.Mon8_2(), 8000);
    // await this.MdelayT(this.Mon9(), 4000)
    await this.MdelayT(this.Mon9_2(), 6000);
    await this.MdelayT(this.Mon10(), 6000);
    await this.MdelayT(this.Mon11(), 6000);
  },

  /**
   * 移至20km出
   * 云团进入武汉市内
   */
  Mon7() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer4 = mapLayerControls.findByName("雷达")[0];
    layer4 &&
      layer4.children.forEach((item: any) => {
        item.visible = false;
      });
    roam && roam.close();
    let position = [114.36589702515822, 29.63596769835629, 150387.2384666107];
    let h = -7.323963960001009;
    let p = 59.56362650920515;
    let r = 1.0614355508146781e-14;
    this.setflyCamera(position, h, p, r);

    let rposition = [
      {
        position: [114.04972161944867, 29.659667962657196, 100387.2384666107],
        speed: 10000,
        target: [],
      },
      {
        position: [114.22256377198758, 29.922997186162663, 68997.56176288115],
        speed: 10000,
        target: [],
      },
    ];
    this.Mroma(rposition, [400, 400, 400], [30, 0, 0]);
  },

  /**
   * 20km线闪烁
   */

  Mon8() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    let layer = mapLayerControls
      .findByName("协同观测")[0]
      .children.filter((item: any) => {
        return item.name == "20km";
      });
    this.changeWeather("多云");
    this.Mflash(layer);
  },

  /**
   * 雷达闪烁
   * 雷达追踪
   */
  Mon8_2() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer = mapLayerControls
      .findByName("协同观测模型")[0]
      .children.filter((pointLayer: any) => {
        return pointLayer.name == "X波段天气雷达";
      });
    this.Mflash(layer);
    const layer4 = mapLayerControls.findByName("雷达")[0];
    layer4 &&
      layer4.children.forEach((item: any) => {
        if (item.name == "X波段天气雷达" && item.position[1] > 30.31087) {
          item.visible = true;
        }
      });
    let layer2 = mapLayerControls
      .findByName("协同观测")[0]
      .children.filter((item: any) => {
        return item.name == "X雷达往复" || item.name == "X雷达往复2";
      })
      .forEach((item: any) => {
        item.visible = true;
      });
  },

  // 垂直观测系统闪烁
  Mon9() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer = mapLayerControls
      .findByName("协同观测模型")[0]
      .children.filter((pointLayer: any) => {
        return (
          pointLayer.name == "国家气象站" || pointLayer.name == "垂直观测站"
        );
      });
    this.Mflash(layer);
  },

  /**
   * 视角跳转垂直观测系统
   * 关闭图标
   */
  Mon9_2() {
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer3 = mapLayerControls.findByName("协同观测")[0];
    layer3 &&
      layer3.children.forEach((item: any) => {
        item.visible = false;
      });
    const layer5 = mapLayerControls.findByName("协同线图标")[0];
    layer5 &&
      layer5.children.forEach((item: any) => {
        item.visible = false;
      });
    const layer = mapLayerControls.findByName("协同观测")[0];
    layer &&
      layer.children
        .filter((item: any) => {
          return item.name == "垂直观测" || item.name == "气象观测站";
        })
        .forEach((item: any) => {
          item.visible = true;
        });

    const layer2 = mapLayerControls.findByName("协同观测模型")[0];
    layer2 &&
      layer2.children.forEach((item: any) => {
        item.visible = false;
      });

    const layer4 = mapLayerControls.findByName("雷达")[0];
    layer4 &&
      layer4.children.forEach((item: any) => {
        item.visible = false;
      });

    let position = [113.96028686534179, 30.34522499398825, 5172.667174129544];
    let h = 19.80509828009525;
    let p = 10.250101234995782;
    let r = 0.00027569351828594203;
    this.setflyCamera(position, h, p, r);
  },

  Mon10() {
    this.changeWeather("暴雨");
  },

  Mon11() {
    this.changeWeather("晴天");
  },
};

export default {
  ...Methods,
};
