<template>
  <div id="app">
      <router-view class="app-router-view"></router-view>
  </div>
</template>

<script lang="ts" setup>
import EventBus from './utils/EventBus';
import { onMounted } from 'vue'
const mes = () => {
  EventBus.emit('ces')
  
}
</script>

<style lang="less" scoped>
#app {
  width: 100vw;
  height: 100vh;
  color: black;
  font-size: 20px;
}

.tesxt {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  z-index: 999;
}

.item {
  cursor: pointer;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  margin-bottom: 10px;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}
</style>
