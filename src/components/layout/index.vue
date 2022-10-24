<!--  -->

<template>
  <a-layout>
    <a-layout-sider class="_aside">
      <div v-show="!toggleKey" class="_logo">
        <svg-icon size="2rem" name="houtai" />
        <p style="margin-left: 10px" class="title">后台管理系统</p>
      </div>
      <div v-show="toggleKey" class="_logo">
        <svg-icon size="2rem" name="houtai" />
      </div>
      <leftmenus class="menu"></leftmenus>
    </a-layout-sider>
    <a-layout style="height: 100vh">
      <a-layout-head class="header">
        <heade class="h_t" />
        <navbar class="h_d" />
      </a-layout-head>
      <a-layout-content class="content">
        <mainrouterview />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import screenfull from "screenfull";
import { hamburg } from "@/store/hamburg";
import { fullscreen } from "@/store/fullscreen";
import { storeToRefs } from "pinia"; //用于结构仓库数据，且依然是响应式的
import { ref, watch, onMounted } from "vue";
import leftmenus from "./components/leftmenus/index.vue";
import heade from "./components/header/index.vue";
import navbar from "./components/navbar/index.vue";
import mainrouterview from "./components/main/index.vue";
import SvgIcon from "../../icons/components/svgIcon.vue";

const hamburgData = hamburg();
const fullscreenData = fullscreen();
const { aisdeWidth, toggleKey } = storeToRefs(hamburgData);

const pinia = "pinia";
const top_height = "3.25rem"; //顶栏统一高度（logo、header）
const head_height = "4.65rem";

//订阅pinia状态变化
fullscreenData.$subscribe((mutation, state) => {
  if (screenfull.isEnabled) {
    screenfull.toggle(document.documentElement);
  }
});
</script>
<style lang="less" scoped>
:deep(.el-aside) {
  width: v-bind(aisdeWidth);
  transition: all linear 0.15s;

  color: #333;
  /*text-align: center;*/
}

._aside {
  transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -moz-transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -o-transition: width 0.15s;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  box-shadow: 0.1rem 0 0.2rem #333;
  background: url("@/assets/imgs/side0.jpg");
  // background: url('../../assets/imgs/b1.webp');
  background-size: cover;

  ._logo {
    background-color: #ccc !important;
    background: url("@/assets/imgs/titlebg.png");
    background-size: cover;
    background-position: 0 2px;
    height: v-bind(top_height);
    color: #333;
    font-weight: 600;
    line-height: v-bind(top_height);
    font-size: 1.7rem;
    letter-spacing: 0.2rem;
    border-bottom: 1px solid #ccc;
    align-items: center;
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
    width: v-bind(asidewidth);

    .title {
      display: block;
      width: v-bind(asidewidth);
      overflow: hidden;
    }

    .svg-icon {
      margin-top: 0.3rem;
    }
  }

  //菜单
  .a-menu {
    flex: 1;
    overflow-y: scroll;
    width: 100%;
    background: transparent;
    background: rgba(255, 255, 255, 0.3);

    &::-webkit-scrollbar {
      width: 2px;
      height: 100px;
    }

    &::-webkit-scrollbar-thumb {
      //滑块部分
      border-radius: 1px;
      background-color: rgba(196, 193, 193, 0.2);
    }

    &::-webkit-scrollbar-track {
      //轨道部分
      box-shadow: inset 0 0 5px rgba(196, 193, 193, 0.2);
      background: transparent;
      border-radius: 5px;
      // display: none;
    }
  }
}

.header {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding: 0 0 0 0.6rem;

  .h_t {
    height: v-bind(head_height);
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
  }

  .h_d {
    height: v-bind(head_height);
  }
}

.content {
  background: #ffff;
  margin: 0.4rem 0.1rem 1rem 1rem;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0;
  // padding-left: 1rem;
  overflow-y: scroll;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
