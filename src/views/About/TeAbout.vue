<template>
  <div class="TeAbout">
    <!-- 底部按钮 -->
    <div class="buttton">
      <div
        class="btn_item"
        v-for="item in btnoptions"
        :key="item.name"
        @click="chose(item.name, item.cmp)"
        :class="activetn == item.name ? 'active_tn' : ''"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="panel">
      <component :is="currenview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef, markRaw } from "vue";
import EventBus from "@/utils/EventBus";
import page1 from "./Tecomp/page1.vue";
import page2 from "./Tecomp/page2.vue";
import page3 from "./Tecomp/page3.vue";
import page4 from "./Tecomp/page4.vue";
import page5 from "./Tecomp/page5.vue";
import page6 from "./Tecomp/page6.vue";
// 按钮选项
let btnoptions = ref<any[]>([
  {
    name: "两江三镇",
    cmp: markRaw(page1),
  },
  {
    name: "九省通衢",
    cmp: markRaw(page2),
  },
  {
    name: "百湖之城",
    cmp: markRaw(page3),
  },
  {
    name: "山川地貌",
    cmp: markRaw(page4),
  },
  {
    name: "气象概况",
    cmp: markRaw(page5),
  },
  {
    name: "气象灾害",
    cmp: markRaw(page6),
  },
]);
// 激活按钮
let activetn = ref<string>("两江三镇");
// 动态组件
let currenview = shallowRef<any>(page1);

// 点击按钮回调
let chose = function (name: string, cmp: any) {
  activetn.value = name;
  currenview.value = cmp;
  console.warn(name);
};

onMounted(() => {
  EventBus.on("resetTeA", () => {
    let cmp:any = markRaw(page1)
    chose("两江三镇",cmp);
  });
});
</script>
<style lang="less" scoped>
.TeAbout {
  .buttton {
    z-index: 999;
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;

    .btn_item {
      width: 1.28rem;
      height: 0.5rem;
      text-align: center;
      letter-spacing: 5px;
      line-height: 0.5rem;
      color: #fff;
      opacity: 0.9;
      background: url("../../assets/image/simage/tebtn.png") no-repeat center
        center;
      background-size: 100% 100%;
      margin-right: 10px;
      cursor: pointer;
      font-size: 16px;

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
}
</style>
