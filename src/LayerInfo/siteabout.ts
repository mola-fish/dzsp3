import { usemapState } from "@/store/mapState";
import type { SitesData } from "@/types/site";
import { getCurrentInstance } from "vue";
const proxy: any = getCurrentInstance();
const that: any = proxy?.appContext.config.globalProperties;

const Methods = {
  /**还原站点相关
   * 站点图标
   * 天气，时间
   * 雷达扫描
   * 白模
   */
  clearSite(){
    let mapLayerControls: any = usemapState().mapLayerControls;
    let layer:any = mapLayerControls.findByName('全部站点')[0]
    layer && (layer.visible = false)
    this.switchRadar()
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

  // 打开/关闭雷达扫描效果
  switchRadar(bol:boolean = false){
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer = mapLayerControls.findByName('雷达')
    layer && layer[0].children.forEach((item:any) => {
      item.visible = bol
    })
  },
  
  // 根据类型筛选站点
  filterSitePointsByType(type:string[] | string) {
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer = mapLayerControls.findByName('全部站点')[0]
    return layer && layer.children
        .filter((pointLayer:any) => {
            const prop = pointLayer.properties;
            pointLayer.visible = Methods.isCross([prop.type], type as any[])
            return pointLayer.visible;
        })
        .map((pointLayer:any) => {
            return pointLayer.properties;
        })
  },

  // 展示所有站点
  setAllSitePoints(vis:boolean = true){
    let mapLayerControls: any = usemapState().mapLayerControls;
    const layer = mapLayerControls.findByName('全部站点')[0]
    return layer && layer.children
    .filter((pointLayer:any) => {
        const prop = pointLayer.properties;
        pointLayer.visible = vis
        return pointLayer.visible;
    })
    .map((pointLayer:any) => {
        return pointLayer.properties;
    })
  },

  // 兩個數組是否有交集
  isCross(arr1:any[], arr2:any[]) {
    return arr1.filter(item => {
        return arr2.includes(item)
    }).length > 0
  },


};

export default {
  ...Methods,
};
