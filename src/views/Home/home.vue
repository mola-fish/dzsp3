<template>
  <div class="home">
    <!-- 登录 -->
    <Login />

    <!-- 系统标题 -->
    <div class="earth_title animated fadeIn" v-show="showTitle">
      <div class="title1" @click="showcom('SiteAbout')"></div>
      <div class="title2"></div>
    </div>

    <!-- 新导航栏左 -->
    <div v-if="showBtn" class="newmap_btn">
        <div class="nbt_item" @click="showcom('SiteAbout')" :class="showSiAb?'act_nbt':''"><span class="nbt_icon"></span>
          <span class="nbt_name">网</span>
        </div>
        <div class="nbt_item" @click="showcom('showMonAb')" :class="showMonAb?'act_nbt':''"><span class="nbt_icon"></span>
          <span class="nbt_name">协</span>
        </div>
        <div class="nbt_item" @click="showcom('showAirAb')" :class="showAirAb?'act_nbt':''"><span class="nbt_icon"></span>
          <span class="nbt_name">孪</span>
        </div>
        <div class="nbt_item" @click="showcom('showFAb')" :class="showFAb?'act_nbt':''"><span class="nbt_icon"></span>
          <span class="nbt_name">服</span>
        </div>
        <div class="nbt_item" @click="showcom('showTeAb')" :class="showTeAb?'act_nbt':''"><span class="nbt_icon"></span>
          <span class="nbt_name">貌</span>
        </div>
    </div>

    <!-- 页面内容 -->
    <div>
      <!-- 站网分布 -->
      <SiteAbout v-show="showSiAb" />
      <!-- 地市地貌 -->
      <TeAbout v-if="showTeAb" />
      <!-- 协同观测 -->
      <MonAbout v-show="showMonAb" />
      <!-- 孪生大气 -->
      <AirAbout v-show="showAirAb" />
      <!-- 应急服务 -->
      <FAbout v-show="showFAb" />
    </div>

    <!-- 主内容 -->
    <div
      class="main"
      :class="{ 'main--home': infoPanelShow }"
      v-show="showtype == 'map'"
    >
      <div class="main__map">
        <ZMap :debug="false">
          <transition name="to-right"> </transition>
        </ZMap>
      </div>
      <div class="box-shadow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mounted, Methods, State } from "@/LayerInfo/index";
import { ref, reactive, onMounted } from "vue";
import { usemapState } from "@/store/mapState";
import { SiteRequest } from "@/api/axios";
import { SitesData } from "@/types/site";
import axios from "axios";
import qs from "qs";
import { getCurrentInstance } from "vue";
import home from "@/LayerInfo/home";
import EventBus from "@/utils/EventBus";

import ZMap from "@/layout/WidgetMapContainer.vue";
import Login from "@/layout/Login.vue";
import SiteAbout from "@/views/About/SiteAbout.vue";
import TeAbout from "@/views/About/TeAbout.vue";
import MonAbout from "@/views/About/MonAbout.vue";
import AirAbout from "../About/AirAbout.vue";
import FAbout from "@/views/About/FAbout.vue";

let proxy: any = getCurrentInstance();
let that: any = proxy?.appContext.config.globalProperties;

let infoPanelShow = ref<boolean>(false);
// 页面展示
let showtype = ref<string>("map");
// 标题
let showTitle = ref<boolean>(false);
// 导航图标
let showBtn = ref<boolean>(false);
// 站网分布
let showSiAb = ref<boolean>(false);
// 地势地貌
let showTeAb = ref<boolean>(false);
// 协同观测
let showMonAb = ref<boolean>(false);
// 孪生大气
let showAirAb = ref<boolean>(false);
// 应急服务
let showFAb = ref<boolean>(false);

// 重置页面展示
let resetViews = (): void => {
  showTitle.value = false;
  showSiAb.value = false;
  showTeAb.value = false;
  showMonAb.value = false;
  showAirAb.value = false;
  showFAb.value = false;
};

// 还原站网分布相关
let clearAll = ():void => {
  EventBus.emit("clearSite");
  EventBus.emit("clearMon");
}

// 页面导航
let showcom = function (name: string): void {
  // 停止地球旋转,隐藏标题
  home.stopearthSurround();
  resetViews();
  clearAll();
  showBtn.value = true
  switch (name) {
    case "SiteAbout":// 网
      showSiAb.value = true;
      EventBus.emit("resetSiA");
      break;
    case "showTeAb":// 貌
      showTeAb.value = true;
      EventBus.emit("resetTeA");
      break;
    case "showMonAb":// 协
      showMonAb.value = true;
      EventBus.emit("resetMonA");
      break;
    case "showAirAb":// 孪
      showAirAb.value = true;
      EventBus.emit("resetTeA");
      break;
    case "showFAb":// 服
      showFAb.value = true;
      EventBus.emit("resetTeA");
      break;
  }
};

// 地球跳转
let goearth = () => {
  resetViews();
  showBtn.value = false
  home.earthSurround();
  setTimeout(() => {
    showTitle.value = true;
  }, 1000);
};

// 获取站点列表
let getallSite = async () => {
  let data = {
    rows: 1000,
  };
  let res = await SiteRequest.getListData(data);
  if (res.data.success) {
    let temp: SitesData[] = res.data.data.rows;
    // 替换抬高高度
    let heightlist: number[][] = [];
    temp.forEach((item: any) => {
      heightlist.push([parseFloat(item.lng), parseFloat(item.lat)]);
    });
    let templist = JSON.stringify(heightlist);
    axios
      .post("/zs/data/DEMO/dem/dem", qs.stringify({ points: templist }))
      .then((res: any) => {
        temp.forEach((item, index) => {
          item.height = res.data[index] * that.$url_degree + that.$url_height;
        });
        let list: any = temp;
        Methods.addSitePoints("全部站点", list);
      });
  }
};

// 点击登录
let bindViewLoad = function (): void {
  const button: any = document.querySelector(".map-mapview-cloud-connect");
  const loadData = () => {
    setTimeout(() => {
      button.removeEventListener("click", loadData);
      home.earthSurround();
      setTimeout(() => {
        showTitle.value = true;
      }, 1000);
    }, 50);
  };
  button.addEventListener("click", loadData);
};

onMounted(() => {
  Mounted();
  bindViewLoad();
  getallSite();
});
</script>

<!-- 导航图标样式 -->
<style scoped lang="less">
.newmap_btn{
  position: absolute;
  top: 141px;
  left: 23px;
  z-index: 999;
}

.act_nbt{
  background: url('../../assets/image/site_about/nbt_item_at.png')no-repeat center !important;
  background-size: 100% 100% !important;
  .nbt_name{
    margin-left: 43px !important;
    color: yellow !important;
    transform: translateY(4px) !important;
    opacity: 1 !important;
    text-transform: uppercase;
	  text-shadow: 0 0 20px #ffc600;
  }
}
.nbt_item{
  cursor: pointer;
  width: 119px;
  height: 66px;
  background: url('../../assets/image/site_about/nbt_item.png')no-repeat center;
  background-size: 100% 100%;
  opacity: 1;
  margin-bottom: 18px;

  .nbt_name{
    display: inline-block;
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 24px;
    margin-left: 43px;
    transform: translateY(4px);
    opacity: 0.7;
  }
}
</style>

<style scoped lang="less">
.home {
  width: 100%;
  height: 100%;
  background: gray;
}
.earth_title {
  position: absolute;
  display: flex;
  align-items: center;
  min-width: 800;
  height: 141px;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  font-size: 30px;
  color: white;
  z-index: 999;

  .title1 {
    width: 366px;
    height: 100%;
    background: url("../../assets/image/title1.png") no-repeat center;
    margin-right: 90px;
    cursor: pointer;
    background-size: 100% 100%;
  }

  .title2 {
    width: 366px;
    cursor: pointer;
    height: 100%;
    background: url("../../assets/image/titile2.png") no-repeat center;
    background-size: 100% 100%;
  }
}

.map_btn {
  position: absolute;
  top: 35px;
  right: 92px;
  z-index: 99;

  .side_btn {
    display: block;
    width: 0.49rem;
    height: 0.49rem;
    z-index: 9;
    border-style: none !important;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .earth_btn {
    width: 0.49rem;
    height: 0.49rem;
    background: url("../../assets/image/earth_btn.png") no-repeat center;
    background-size: 100% 100%;
    z-index: 9;
    border-style: none !important;
    cursor: pointer;
  }

  .sfu {
    background: url("../../assets/image/btn/fu.png") no-repeat center;
    background-size: 100% 100%;
  }

  .luan {
    background: url("../../assets/image/btn/luan.png") no-repeat center;
    background-size: 100% 100%;
  }

  .mao {
    background: url("../../assets/image/btn/mao.png") no-repeat center;
    background-size: 100% 100%;
  }

  .wang {
    background: url("../../assets/image/btn/wang.png") no-repeat center;
    background-size: 100% 100%;
  }

  .xie {
    background: url("../../assets/image/btn/xie.png") no-repeat center;
    background-size: 100% 100%;
  }
}

button:active {
  transform: scale(0.7);
  border: none !important;
}

button:focus {
  outline: 0;
}
</style>
