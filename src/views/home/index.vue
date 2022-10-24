<template>
  <a-table :dataSource="dataSource" :columns="columns" />
  <a-tabs v-model:activeKey="activeKey" class="tab">
    <LeftOutlined @click="preClick" />
    <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.value">{{
      item.value
    }}</a-tab-pane>
    <RightOutlined @click="nextClick" />
  </a-tabs>
</template>
<script>
import { reactive, ref } from "vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { message } from 'ant-design-vue';
export default {
  components: {
    LeftOutlined,
    RightOutlined,
  },
  setup() {
    const activeKey = ref(0);
    const tabList = reactive([
      {
        key: 0,
        value: "Tab1",
      },
      {
        key: 1,
        value: "Tab2",
      },
      {
        key: 2,
        value: "Tab3",
      },
    ]);
    const preClick = () => {
      if(activeKey.value > 0) {
        activeKey.value--
      } else activeKey.value = 2
    };
    const nextClick = () => {
      if(activeKey.value < 2) {
        activeKey.value++
      } else activeKey.value = 0
    };
    return {
      activeKey,
      tabList,
      preClick,
      nextClick,
    };
  },
};
</script>
<style lang="less" scoped>
.tab {
  margin: 0 20px;

  /deep/.ant-tabs-tabpane {
    width: 97%;
  }
}
</style>
