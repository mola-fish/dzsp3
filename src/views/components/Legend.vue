<template>
  <div class="legend_container">
    <div class="arrow" @click="showlegend = !showlegend">
      <div class="arrow_item" :class="showlegend ? '' : 'getmore'"></div>
    </div>

    <div class="Legend" v-show="showlegend && !nodata">
      <!-- 分类块 -->
      <div
        class="type_classify type1"
        v-for="(item, index) in classfiylist"
        :key="index"
        :class="index == 1 ? 'notop' : ''"
      >
        <!-- 具体单个类型 -->
        <div
          class="legend_item"
          v-for="(i, inx) in item.type"
          :key="inx"
          @click="legendpoints(i)"
        >
          <div class="item_cover">
            <img :src="i.icon" />
          </div>
          <div
            class="item_name"
            :class="activetype.includes(i.name) ? 'active_item_name' : ''"
          >
            {{ i.name }}({{ i.value }})
          </div>
        </div>
      </div>
    </div>

    <div class="Legend nodata" v-show="showlegend && nodata">暂无数据</div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import EventBus from "@/utils/EventBus";
import { getCurrentInstance } from "vue";
import { SiteRequest } from "@/api/axios";
import { SitesData } from "@/types/site";
import siteabout from "@/LayerInfo/siteabout";
const proxy: any = getCurrentInstance();
const that: any = proxy?.appContext.config.globalProperties;
// 图例栏展开和收起
let showlegend = ref<boolean>(true);
// 是否无数据
let nodata = ref<boolean>(false);
// 当前激活类型
let activetype = ref<string[]>([]);
// 当前类型个数(图例交互中使用)
let activeNum = ref<number>(0);
// 总列表
let allList = ref<SitesData[]>([]);
// 分类后展示列表
let classfiylist = ref<any[]>(that.$legendType);




// 图例点击回调
let legendpoints = (type: any) => {
  // 激活列表全选则单独选择该图例项
  activetype.value.length == activeNum.value?activetype.value = [type.name]:
  // 激活列表包括点击的图例项则失活该图例项
  activetype.value.includes(type.name)?activetype.value = activetype.value.filter(item => item != type.name):activetype.value.push(type.name)

  // 激活列表为空
  activetype.value.length == 0?
  classfiylist.value.forEach((item: any) => {
      activetype.value.push(...item.allclass);
  }):null
  siteabout.filterSitePointsByType(activetype.value)
  console.warn(activetype.value);
};

// 获取站点列表
let getallSite = async () => {
  let res = await SiteRequest.getTotal();
  if (res.data.success) {
    let list: any[] = [];
    list = res.data.data.rows;
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
    let temp: any[] = [];
    list.forEach((item) => {
      let obj: any = {};
      (obj.name = item.name), (obj.value = item.value);
      obj.icon = that.$url_svg + "/" + map[item.name] + ".png";
      temp.push(obj);
      activetype.value.push(item.name);
    });
    // 设置当前类型个数
    activeNum.value = activetype.value.length
    // 初始化展示列表
    temp.forEach((item) => {
      classfiylist.value.forEach((chi: any) => {
        if (chi.allclass.includes(item.name)) {
          chi.type.push(item);
        }
      });
    });
    // 初始化总展示分类
    if (!allList.value.length) {
      allList.value = classfiylist.value;
    }
  }
};

onMounted(async () => {
  await getallSite();
  EventBus.on("setLegend", (name: any) => {
    // 设置展示列表
    if (name == "全部站点") {
      classfiylist.value = allList.value;
    } else {
      classfiylist.value = allList.value.filter((item) => {
        return item.name == name;
      });
    }
    // 设置激活类型
    activetype.value = [];
    classfiylist.value.forEach((item: any) => {
      activetype.value.push(...item.allclass);
    });
    // 设置当前类型个数
    activeNum.value = activetype.value.length
  });
});

</script>
<style lang="less" scoped>
.legend_container {
  z-index: 9;
  display: flex;
  align-items: center;
  position: absolute;
  right: 0.05rem;
  bottom: 0.05rem;
}

.Legend {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 2.43rem;
  min-height: 0.77rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0.05rem;
  box-sizing: border-box;
  padding: 0.12rem 0.18rem 0 0.18rem;
  overflow: hidden;

  .legend_item {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    height: 0.27rem;

    font-size: 0.14rem;
    font-family: Source Han Sans CN;
    font-weight: 400;
    margin-bottom: 0.05rem;

    .item_cover {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0.35rem;
      height: 0.35rem;
      border-radius: 50%;
      // border: 1px solid #97A2A1;
      // background-color: #D3D8D8;
      margin-right: 0.09rem;

      img {
        width: 0.35rem;
        height: 0.35rem;
        transform: translateY(0px);
      }
    }

    .item_name {
      color: #ffffff;
      opacity: 0.6;
    }

    .active_item_name {
      color: #ffffff;
      opacity: 1;
    }
  }
}

.arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.26rem;
  height: 0.77rem;
  background: url("../../assets/image/arrow.png");
  margin-right: 0.02rem;
  cursor: pointer;

  .arrow_item {
    width: 0.125rem;
    height: 0.216rem;
    background: url("../../assets/image/arrrow_a.png") no-repeat center center;
    background-size: 100% 100%;
  }
}

.getmore {
  transform: rotate(180deg);
}

.nodata {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  height: 5.79rem;
  font-size: 0.2rem;
}

.type_classify {
  border-top: 2px dashed #fff;

  &:first-child {
    border-top: none;
  }

  padding: 2px 0;
}

.notop {
  &:first-child {
    border-top: none;
  }

  padding: 2px 0;
}
</style>
