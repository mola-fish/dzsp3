//定义关于counter的store
import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";
const proxy: any = getCurrentInstance()
const that: any = proxy?.appContext.config.globalProperties
//defineStore 是返回一个函数 函数命名最好有use前缀，根据函数来进行下一步操作
export const usemapState = defineStore("mapState", {
  state: () => {
    return {
        layerTreeInfo: [],
        mapLayerControls:null,
        that:null
    };
  },
});
