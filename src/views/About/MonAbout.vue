<template>
    <div class="MonAbout">
    <!-- 动画按钮 -->
    <div class="player">
      <div class="player_btn" :class="active_player == 'player0' ? 'active_player' : ''" @click="TTEST0"></div>
      <div class="player_btn" :class="active_player == 'player1' ? 'active_player' : ''" @click="TTEST1"></div>
      <div class="player_btn" :class="active_player == 'player2' ? 'active_player' : ''" @click="TTEST2"></div>
      <div class="player_line"></div>
      <div class="player_line2" ref="btn"></div>
    </div>
  </div>
</template>


<script setup lang="ts">
import monabout from '@/LayerInfo/monabout'
import { ref, reactive,onMounted} from 'vue'
import EventBus from '@/utils/EventBus';
import axios from 'axios';
import { usemapState } from '@/store/mapState';

// 当前激活按钮
let active_player = ref<string>('');
// 进度条
let btn = ref<any>(null)


// 按钮0
let TTEST0 = function() {
  const that_:any = usemapState().that
  btn.value.style && (btn.value.style.width = '10%')
  active_player.value = 'player0'
  monabout.closeMon()
  monabout.MonA1()
  // axios.post(that_.$url_bor, {
  //       "netstationId": "123",
  //       "netstationName": "测试站点",
  //       "type": 'test1',
  //       'screentype': 'showlayoutmon'
  //     }).then(() => {
  //     })
};
// 按钮1
let TTEST1 = function() {
  const that_:any = usemapState().that
  btn.value.style && (btn.value.style.width = '50%')
  active_player.value = 'player1'
  monabout.closeMon()
  monabout.MonA2()
      // axios.post(that_.$url_bor, {
      //   "netstationId": "123",
      //   "netstationName": "测试站点",
      //   "type": 'test3',
      //   'screentype': 'showlayoutmon'
      // }).then(() => {
      // })
};
// 按钮2
let TTEST2 = function() {
  const that_:any = usemapState().that
  btn.value.style && (btn.value.style.width = '341px')
  active_player.value = 'player2'
  monabout.closeMon()
  monabout.MonA3()
      // axios.post(that_.$url_bor, {
      //   "netstationId": "123",
      //   "netstationName": "测试站点",
      //   "type": 'test4',
      //   'screentype': 'showlayoutmon'
      // }).then(() => {
      // })
};

onMounted(() => {
  EventBus.on('resetMonA',() => {
    TTEST0()
  })

  EventBus.on('clearMon',() => {
    monabout.closeMon()
  })
})
</script>

<style lang="less" scoped>
.player {
  position: absolute;
  bottom: 23px;
  left: 40%;
  display: flex;
  justify-content: space-around;
  width: 361px;
  z-index: 999;

  .player_btn {
    width: 43px;
    height: 43px;
    background: url('../../assets/image/player_btn.png')no-repeat center;
    background-size: 100% 100%;
    cursor: pointer;
    z-index: 99;
  }

  .active_player {
    background: url('../../assets/image/active_player.png')no-repeat center;
    background-size: 100% 100%;
  }

  .player_line {
    position: absolute;
    top: 0;
    left: 0;
    width: 361px;
    height: 19px;
    background: url('../../assets/image/player_line.png')no-repeat center;
    background-size: 100% 100%;
    transform: translateY(10px);
  }

  .player_line2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 10%;
    height: 3px;
    background-color: #77E9FF;
    z-index: 9;
    transform: translate(10px, 18px);
    transition: width 0.5s;
  }
}


.county {
  position: absolute;
  top: 113px;
  right: 13px;
  width: 0.49rem;
  height: 0.49rem;
  background: url('../../assets/image/county.png') no-repeat center;
  background-size: 100% 100%;
  z-index: 9;
  border-style: none !important;
  cursor: pointer;
}

.county2 {
  position: absolute;
  top: 184px;
  right: 13px;
  width: 0.49rem;
  height: 0.49rem;
  background: url('../../assets/image/county.png') no-repeat center;
  background-size: 100% 100%;
  z-index: 9;
  border-style: none !important;
  cursor: pointer;
}
</style>