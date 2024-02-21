import { usemapState } from "@/store/mapState";
import EventBus from "@/utils/EventBus";
let flag1: boolean = false;
let flag1Tlist: any[] = [];
let flashtimer:any = null
const Methods = {
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
  //异步方法
  //执行方法 - 延迟几秒 - 下一步
  delayT(fn: any, ms: any) {
    var p = new Promise(function (resolve, reject) {
      let t = setTimeout(function () {
        if (flag1) {
          resolve(fn);
        } else {
          reject("失败");
        }
      }, ms);
      flag1Tlist.push(t);
    });
    return p;
  },

  //根据传值显示地形地貌对应图层
  openArea(type:string[]){
    let mapLayerControls:any = usemapState().mapLayerControls
    if (type.length == 0) return
    const layer = mapLayerControls.findByName('地形地貌')[0]
    layer && layer.children.filter((item:any) => {
        return type.includes(item.name)
    }).forEach((item:any) => {
        item.visible = true
    })
  },

  //图层闪烁
  flashLayer(type:string){
    clearInterval(flashtimer)
    let mapLayerControls:any = usemapState().mapLayerControls
    const layer = mapLayerControls.findByName('地形地貌')[0]
    flashtimer = setInterval(() => {
        let lakelayer = layer.children.filter((item:any) => {
            return item.name == type
        })
        lakelayer[0].visible = !lakelayer[0].visible
    }, 800)
  },

  closeallTe() {},

  async test0() {
    flag1 = true;
    // 跳转到湖北省介绍
    await this.delayT(this.RlA0(), 6000);
  },

  RlA0() {
    let type = ["市面", "省面"];
    let position = [111.58954171058923, 28.528664253362816, 649995.3319204929];
    let h = 9.88386431708011;
    let p = -295.4231079630554;
    let r = 1.8223523296324517e-12;
    this.setCamera(position, h, p, r);
    this.openArea(type);
    this.flashLayer("市面");
    EventBus.$emit("changeshowct", "position");
  },
};
export default { ...Methods };
