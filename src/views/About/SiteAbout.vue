<template>
  <div>
  <!-- 右侧图例 -->
  <Legend />
  <!-- 站网分布按钮 -->
  <div class="change_scene">
    <div
      class="change_item"
      :class="activetn == '雷达观测' ? 'active_tn' : ''"
      @click="handleClick('雷达观测')">雷达观测
    </div>

    <div
      class="change_item"
      :class="activetn == '垂直观测' ? 'active_tn' : ''"
      @click="handleClick('垂直观测')">垂直观测
    </div>

    <div
      class="change_item"
      :class="activetn == '地面观测' ? 'active_tn' : ''"
      @click="handleClick('地面观测')">地面观测
    </div>

    <el-dropdown trigger="click" @command="handleCommand">
      <div
        class="change_item"
        :class="activetn == '交通气象观测' || activetn == '农业气象观测'? 'active_tn': ''">
        {{ traffic_farm }}
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="交通气象观测"
            >交通气象观测</el-dropdown-item>
          <el-dropdown-item command="农业气象观测"
            >农业气象观测</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown trigger="click" @command="handleCommand">
      <div
        class="change_item"
        :class="activetn == '站网分布' || activetn == '立体观测' ? 'active_tn' : ''">
        {{ horizon_vertical }}
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="站网分布">站网分布</el-dropdown-item>
          <el-dropdown-item command="立体观测">立体观测</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  </div>
</template>

<script lang="ts">
import EventBus from "@/utils/EventBus";
import siteabout from "@/LayerInfo/siteabout";
import Legend from '@/views/components/Legend.vue'
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getCurrentInstance } from "vue";
const proxy: any = getCurrentInstance()
const that: any = proxy?.appContext.config.globalProperties
// 按钮激活
let activetn = ref<string>("站网分布");
//下拉框选项
let traffic_farm = ref<string>("专业观测"); //交通，农业
let horizon_vertical = ref<string>("站网分布"); //站网，垂直



// 按钮的点击回调
let handleClick = function (name: string): void {
  if (activetn.value == name) {
    return;
  }
  siteabout.switchRadar()
  activetn.value = name;
  let position: number[]
  let heading: number
  let pitch: number
  let roll: number
  switch (name) {
    case "雷达观测":
        position = [114.30027178904851, 27.91348236012957, 385231.4286840459];
        heading = 358.49685168637905;
        pitch = 60.59707848355174;
        roll = 1.8223523296324517e-12;
        siteabout.setCamera(position, heading, pitch, roll);
        siteabout.switchRadar(true)
        break;
    case "垂直观测":
        position = [114.38636753293594, 29.575648298756935, 72100.38510162177];
        heading = 357.33072144164714;
        pitch = 38.380761217325926;
        roll = 1.8223523296324517e-12;
        siteabout.setCamera(position, heading, pitch, roll);
        break;
    case "地面观测":
        position = [114.38636753293594, 29.575648298756935, 72100.38510162177];
        heading = 357.33072144164714;
        pitch = 38.380761217325926;
        roll = 1.8223523296324517e-12;
        siteabout.setCamera(position, heading, pitch, roll);
        break;
  }
  // 设置右侧图例
  EventBus.emit('setLegend',name)
  // 上点
  let types:string[] = selectPoint(name)
  siteabout.filterSitePointsByType(types)
};

// 站点类型筛选
let selectPoint = (seletype:string):string[] => {
    let type = that.$siteType.filter((item:any) => {
        return item.name == seletype
    })[0].type
    return type
}


// 下拉框回调
let handleCommand = function (command: string) {
  siteabout.switchRadar()
  let position: number[]
  let heading: number
  let pitch: number
  let roll: number
  let types:string[] = []
  if (command == "站网分布" || command == "立体观测") {
        horizon_vertical.value = command;
        position = [114.2998257928932, 30.43433399846672, 177319.1386913664];
        heading = 358.4260200820771;
        pitch = 83.06304448470473;
        roll = 1.8223523296324517e-12;
        siteabout.setCamera(position, heading, pitch, roll);
        siteabout.setAllSitePoints()
        EventBus.emit('setLegend','全部站点') 
  } else {
        traffic_farm.value = command;
        position = [114.38636753293594, 29.575648298756935, 72100.38510162177];
        heading = 357.33072144164714;
        pitch = 38.380761217325926;
        roll = 1.8223523296324517e-12;
        siteabout.setCamera(position, heading, pitch, roll);
        types = selectPoint('专业观测')
        siteabout.filterSitePointsByType(types)       
        EventBus.emit('setLegend','专业气象观测') 
  }
  activetn.value = command;
};


onMounted(() => {
  EventBus.on("resetSiA", () => {
    handleCommand("站网分布")
  });
  EventBus.on("clearSite", () => {
    siteabout.clearSite()
  });
});
</script>
<style lang="less" scoped>
.change_scene {
  z-index: 9;
  position: absolute;
  bottom: 0.2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: nowrap;

  .change_item {
    width: 1.28rem;
    height: 0.5rem;
    text-align: center;
    line-height: 0.5rem;
    font-size: 16px;
    color: #fff;
    opacity: 0.8;
    cursor: pointer;
    margin-right: 0.15rem;
    background: url("../../assets/image/simage/tebtn.png") no-repeat center
      center;
    background-size: 100% 100%;

    &:last-child {
      margin-right: 0;
    }
  }

  .active_tn {
    opacity: 1;
    background: url("../../assets/image/simage/tebtn_active.png") no-repeat
      center center;
    background-size: 100% 100%;
  }
}
.el-dropdown {
  margin-right: 0.15rem;
}

.el-dropdown-menu {
  background-color: #188db7;
  border-style: none;
}

</style>

<style lang="less" scoped>
:deep(.el-dropdown-menu__item) {
  color: #fff;
  width: 140px;
  justify-content: center;
  padding: 0;
  line-height: 36px;
  font-size: 16px;
}

.el-popper.is-light{
  border-style: none;
}

:deep(.el-scrollbar) {
  --el-scrollbar-hover-bg-color: none;
}

:deep(.el-popper) {
  border: none;
}
</style>

<style>
.el-popper.is-light{
  border-style: none;
}

.el-popper__arrow::before{
  display: none;
}

</style>
