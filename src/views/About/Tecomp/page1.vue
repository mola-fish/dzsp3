<template>
  <!-- 动画按钮 -->
  <div class="player">
    <div
      class="player_btn"
      :class="active_player == 'player0' ? 'active_player' : ''"
      @click="TTEST0"
    ></div>
    <div
      class="player_btn"
      :class="active_player == 'player1' ? 'active_player' : ''"
      @click="TTEST1"
    ></div>
    <div
      class="player_btn"
      :class="active_player == 'player2' ? 'active_player' : ''"
      @click="TTEST2"
    ></div>
    <div class="player_line"></div>
    <div class="player_line2" ref="btn"></div>
  </div>

  <!-- 文字描述 -->
  <div class="panelcontainer">
    <!-- 地理位置 -->
    <div
      class="top animated fadeIn"
      :class="showcontent == 'position' ? '' : 'animated fadeOut'"
    >
      <div class="topnewscanner">
        武汉因水而兴,因江而盛,所以也叫江城武汉,是国家中心城市,位于湖北省东部,地势以平原和丘陵为主。
      </div>
    </div>

    <!-- 人口介绍 -->
    <div class="first_txt" :class="showcontent == 'position' ? '' : 'fade'">
      <div class="newscanner">
        <div class="test">
          拥有<span class="num">8569</span>平方公里土地,下辖<span class="num"
            >13</span
          >个区,人口为<span class="num">1400</span>万。
        </div>
        <canvas id="can1" width="100px" height="200px"></canvas>
      </div>
    </div>

    <div
      class="rtTitle animated fadeInDown"
      v-show="showtag == 'rtTitle'"
      :class="showtag == 'rtTitle' ? '' : 'animated fadeOut'"
    >
      “两江三镇”是武汉的地理特点
    </div>

    <!-- 长江总里程 -->
    <div class="rlone newscanner" v-show="showtag == 'rlone'">
      <canvas id="can2" width="100px" height="100px"></canvas>
      <div class="test2">
        长江武汉段总长度约<span class="num">200</span>公里
      </div>
    </div>

    <!-- 两江交汇点 -->
    <div>
      <div class="redtitle animated fadeIn" v-show="showtag == 'redpoint'">
        三角洲
      </div>
      <div class="redpoint pulsate_fwd" v-show="showtag == 'redpoint'"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import teinfo from "@/LayerInfo/Teinfo";
import EventBus from "@/utils/EventBus";
// 当前激活按钮
let active_player = ref<string>("");
// 进度条
let btn = ref<any>(null);
// 文字展示
let showcontent = ref<string>('')
// tag展示
let showtag = ref<string>('')

// 动画按钮1
let TTEST0 = () => {
  btn.value.style && (btn.value.style.width = "10%");
  active_player.value = "player0";
  teinfo.test0();
};

// 动画按钮2
let TTEST1 = () => {
  btn.value.style && (btn.value.style.width = "50%");
  active_player.value = "player1";
};

// 动画按钮3
let TTEST2 = () => {
  btn.value.style && (btn.value.style.width = "341px");
  active_player.value = "player2";
};

// 绘制线
let getcanvas = () => {
    var canvas = document.getElementById('can1');
    // 获取canvas的上下文（2d渲染）
    var ctx = (canvas as any).getContext('2d');
    // 绘制长方形
    ctx.beginPath();
    ctx.lineWidth = 3; //线宽
    ctx.setLineDash([4]);//设定实线与空白的大小
    ctx.moveTo(0, 40);
    ctx.lineTo(100, 0);
    ctx.strokeStyle = 'white'; //描边颜色
    ctx.stroke();

    var canvas = document.getElementById('can2');
    var ctx = (canvas as any).getContext('2d');
    ctx.lineWidth = 3; //线宽
    ctx.setLineDash([4]);//设定实线与空白的大小
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 100);
    ctx.strokeStyle = 'white'; //描边颜色
    ctx.stroke();
}

onMounted(() => {
  TTEST0();
  getcanvas()
});
</script>

<style scoped lang="less">
.player {
  position: absolute;
  bottom: 73px;
  left: 40%;
  display: flex;
  justify-content: space-around;
  width: 361px;
  z-index: 999;

  .player_btn {
    width: 43px;
    height: 43px;
    background: url("../../../assets/image/player_btn.png") no-repeat center;
    background-size: 100% 100%;
    cursor: pointer;
    z-index: 99;
  }

  .active_player {
    background: url("../../../assets/image/active_player.png") no-repeat center;
    background-size: 100% 100%;
  }

  .player_line {
    position: absolute;
    top: 0;
    left: 0;
    width: 361px;
    height: 19px;
    background: url("../../../assets/image/player_line.png") no-repeat center;
    background-size: 100% 100%;
    transform: translateY(10px);
  }

  .player_line2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 10%;
    height: 3px;
    background-color: #77e9ff;
    z-index: 9;
    transform: translate(10px, 18px);
    transition: width 0.5s;
  }
}
</style>

<!-- 文字描述 -->
<style lang="less" scoped>
@import url(../../../assets/css/scanner.less);

.panelcontainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
}

.title {
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 20px;
}

.titlemark {
  width: 0.2rem;
  height: 0.2rem;
  background: url("../../../assets/image/panelmark.png") no-repeat center;
  background-size: 100% 100%;
}

.detail {
  font-size: 14px;
  line-height: 25px;
}

.left {
  position: absolute;
  top: 50%;
  left: 200px;
  transform: translateY(-50%);
  z-index: 99;
}

.right {
  position: absolute;
  top: 50%;
  right: 2.15rem;
  z-index: 99;
  transform: translateY(-50%);
}

.info_item {
  min-height: 1.3rem;
  color: #fff;
  box-sizing: border-box;
  padding: 0.2rem;
  background: url("../../../assets/image/detaulepaenl.png") no-repeat center;
  background-size: 100% 100%;
  margin-bottom: 10px;
}

.num {
  font-size: 0.3rem;
  color: yellow;
}

.top {
  display: flex;
  position: absolute;
  top: 1.45rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.top_left {
  position: relative;
  left: 0px;
  padding: 0.34rem 0.18rem 0.06rem;
  box-sizing: border-box;
  margin-bottom: 30px;
  background: url("../../../assets/image/top_left.png") no-repeat center;
  background-size: 100% 100%;
}

.top_right {
  width: 2.72rem;
  padding: 0.34rem 0.18rem 0.06rem;
  margin-bottom: 30px;
  box-sizing: border-box;
  background: url("../../../assets/image/top_left.png") no-repeat center;
  background-size: 100% 100%;
}

.top_item {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.2rem;
}

.ti_info {
  width: 94%;
  color: #fff;
}

.river1 {
  position: absolute;
  top: 49%;
  right: 11rem;
  width: 0.847rem;
  height: 0.268rem;
  line-height: 0.268rem;
  font-size: 0.1561rem;
  letter-spacing: 10px;
  border: 3px solid #fff;
  border-radius: 2px;
  box-shadow: 0px 2px 2px 0px #061535;
  color: #fff;
  text-align: center;
  background-color: #36c0c9;
  z-index: 99;

  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: breathe;
  -webkit-animation-duration: 1500ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

@-webkit-keyframes breathe {
  0% {
    opacity: 0.7;
    box-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1.5;
    box-shadow: 0 1px 30px rgba(59, 255, 255, 1);
  }
}

.river2 {
  position: absolute;
  top: 48%;
  right: 7.8rem;
  width: 0.847rem;
  height: 0.268rem;
  line-height: 0.268rem;
  font-size: 0.1561rem;
  letter-spacing: 10px;
  border: 3px solid #fff;
  border-radius: 2px;
  box-shadow: 0px 2px 2px 0px #061535;
  color: #fff;
  text-align: center;
  background-color: #36c0c9;
  z-index: 99;

  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: breathe;
  -webkit-animation-duration: 1500ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

.rtTitle {
  position: absolute;
  top: 167px;
  left: 38%;
  transform: translateY(-50%);
  font-size: 32px;
  color: #fff;
  font-weight: bolder;
  z-index: 99;
  letter-spacing: 5px;
  text-shadow: #000 3px 4px 5px;
}

.rlone {
  position: absolute;
  bottom: 25%;
  left: 46%;
  transform: translateY(-50%);
  font-size: 32px;
  color: #fff;
  font-weight: bolder;
  z-index: 99;
  letter-spacing: 5px;
}

.redpoint {
  position: absolute;
  bottom: 50%;
  left: 47%;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  z-index: 99;
}

.redtitle {
  position: absolute;
  bottom: 50%;
  left: 47%;
  color: red;
  font-size: 20px;
  z-index: 99;
  letter-spacing: 3px;
  font-weight: bolder;
  transform: translateY(-22px);
}

.pulsate_fwd {
  -webkit-animation: pulsate_fwd 1s ease-in-out infinite both;
  animation: pulsate_fwd 1s ease-in-out infinite both;
}

@keyframes pulsate_fwd {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.first_txt {
  position: absolute;
  top: 47%;
  right: 0%;
  color: #fff;
  z-index: 99;

  // div{
  //   overflow: hidden;
  //   white-space: nowrap;
  //   width: 0;
  //   animation: typing 2s forwards;
  //   font-size: 20px;
  //   font-weight: bold;
  //   letter-spacing: 2px;

  //   span{
  //     letter-spacing: 0;
  //   }
  // }
}

.newscanner {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  color: #fff;
  animation: typing 5s forwards;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;

  span {
    letter-spacing: 0;
  }
}

.topnewscanner {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  color: #fff;
  animation: typing 2s forwards;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;

  span {
    letter-spacing: 0;
  }
}

.test {
  margin-left: 100px;
}

.test2 {
  margin-left: 92px;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.fade {
  display: none;
}
</style>
