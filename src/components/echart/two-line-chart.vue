<template>
  <div class="flex-1">
    <div :id="id" class="chart"></div>
  </div>
</template>

<script setup name="chart">
import * as echarts from "echarts";
import _ from "lodash";
import {
  ref,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
  toRefs,
  getCurrentInstance,
} from "vue";

//接收参数
const props = defineProps({
  getTrendList: {
    type: Object,
    required: true,
  },
  id: {
    type: String,
    default: "",
  },
  param1: {
    type: String,
    default: "",
  },
  param2: {
    type: String,
    default: "",
  },
});

let ctx = getCurrentInstance();
const { id, getTrendList, param1, param2 } = props;

watch(getTrendList, (n, o) => {
  ctx?.myChart && ctx.myChart.setOption(n);
});

const init = () => {
  const obj = Object.assign({}, getTrendList);
  ctx.myChart = echarts.init(document.getElementById(id));
  var option;

  // this.getDicTrendList.forEach((item) => {
  //   obj.date.push(item["x"]);
  //   obj.inData.push(item["y_in"]);
  //   obj.outData.push(item["y_out"]);
  // });

  option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: [param1, param2],
      icon: "circle",
      x: "left",
    },
    grid: {
      x: 0,
      y: 50,
      x2: 30,
      y2: 30,
      borderWidth: 1,
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: obj.date,
        axisLine: {
          lineStyle: {
            color: "#a9b2c9",
            fontSize: 12,
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#a9b2c9",
            fontSize: 12,
          },
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        name: "入库",
        type: "line",
        stack: "总量",
        showSymbol: false,
        // areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: obj.inData,
      },
      {
        name: "出库",
        type: "line",
        stack: "总量",
        showSymbol: false,
        // areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: obj.outData,
      },
    ],
  };

  ctx.myChart.setOption(option);
  window.onresize = function () {
    // 自适应大小
    ctx.myChart.resize();
  };
};

// resize: _.debounce(function () {
//   myChart && myChart.resize();
// }, 100);

// const onResize = () => {
//   resize();
// };
onMounted(() => {
  init();
  // onResize();
  // window.addEventListener("resize", onResize);
});
onBeforeUnmount(() => {
  // window.removeEventListener("resize", onResize);
});
</script>
<style lang="less" scoped>
// @import url(); 引入公共css类

.chart {
  height: calc(100vh - 400px);
}
</style>
