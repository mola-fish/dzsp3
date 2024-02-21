import {usemapState} from '@/store/mapState';
let etimer:any

// 初始化
const Mounted = async () => {};

// 方法
const Methods = {
  earthSurround():void{
    let position = [134.5989498046696, 36.02424137323404, 9542699.579527497];
    let h = 0.22200405224236874;
    let p = 89.19766383618975;
    let r = 1.8223523296324517e-12;
    this.setCamera(position, h, p, r);
    etimer = setInterval(() => {
      position[0]--;
      this.setCamera(position, h, p, r);
    }, 50);
  },

  setCamera(position:number[], heading:number, pitch:number, roll:number) {
    let mapLayerControls:any = usemapState().mapLayerControls
    mapLayerControls.map.view.setViewInfo({
      position: position,
      heading: heading,
      pitch: pitch,
      roll: roll,
    });
  },

  stopearthSurround():void{
    clearInterval(etimer)
  },

};

export default {
    ...Methods,
    Mounted
}
