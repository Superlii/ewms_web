<template>
  <div style="width: 100%">
    <!-- 数据展示、工具栏、搜索栏 -->
    <common-table
      ref="mytable"
      @query="getList"
      :pagination="paginationConfig"
      :data="tableData"
      :tableConfig="tableConfig"
      :toolsConfig="toolsConfig"
    />
  </div>
</template>

<script setup>
import atable from "./component/table.vue";
import { ref, reactive, toRefs } from "vue";
import { bussinessLoggertList, userList } from "@/utils/request/api";
const data = reactive({
  //表格--
  tableData: [],
  tableConfig: {
    border: false, //表格边框
    loading: true, //数据加载loading
    index: true, //序号
    select: false, //选择框
    // search:是否放入搜索表单、type:表单类型、form_hide:表单是否折叠（默认false）、show:table数据展示类型、align:内容位置(默认left)
    columData: [
      {
        prop: "param",
        label: "日志内容",
        search: true,
        type: "input",
        placeholder: "****",
        show: "text",
      },
      {
        prop: "createBy",
        label: "创建者",
        show: "ownDefined",
        definedFun: (cur) => {
          return getUserById(cur.createBy);
        },
        align: "center",
      },
      { prop: "createTime", label: "创建时间", search: false, show: "text" },
      {
        prop: "",
        label: "日期",
        search: true,
        type: "date",
        placeholder: "****",
        show: "text",
      },
      { prop: "isDel", label: "是否已删除", search: false, show: "tagBoolen" },
    ],
    operationData: [],
    treeprops: { children: "children", hasChildren: "hasChildren" },
  },
  toolsConfig: {
    addBtn: false, //新增
    delBtn: false, //删除（多个）
    printTableData: { isShow: true, tooltipCon: "打印" }, //打印表格
    uploads: { isShow: false, tooltipCon: "上传" }, //上传
    downloads: { isShow: false, tooltipCon: "下载", name: "业务日志" }, //下载
    refreshTable: { isShow: true, tooltipCon: "刷新" }, //刷新
    fullScreen: { isShow: true, tooltipCon: "全屏" }, //全屏,
    columnsFilter: { isShow: true, tooltipCon: "列过滤" }, //列过滤
  },
  paginationConfig: {
    //分页配置
    isShow: false,
    pageSizes: [10, 15, 20, 30],
    total: 0,
    current: 1,
    size: 10,
    searchall: false, //初始是否查所有(size:-1)
  },
});

//data数据结构
const { tableData, tableConfig, toolsConfig, paginationConfig } = toRefs(data);

//查询
const getList = (ctx) => {
  tableConfig.value.loading = true;
  if (ctx.size != -1) {
    paginationConfig.value.size = ctx.size;
    paginationConfig.value.current = ctx.current;
    paginationConfig.value.isShow = true;
  }
  if (ctx.size == -1) {
    paginationConfig.value.isShow = false;
  }

  bussinessLoggertList(ctx).then((res) => {
    tableConfig.value.loading = false;
    tableData.value = res.data.records;
    if (ctx.size != -1) {
      paginationConfig.value.total = res.data.total;
      paginationConfig.value.size = res.data.size;
      paginationConfig.value.current = res.data.current;
    }
  });
};

//查操作用户
const alluser = ref([]);

userList({ size: -1 }).then((res) => {
  alluser.value = res.data.records;
});
const getUserById = (ctx) => {
  let cur = "--";
  if (alluser.value.length) {
    alluser.value.forEach((item) => {
      if (item.id == ctx) {
        cur = item.userName;
      }
    });

    return cur;
  }
};

if (paginationConfig.value.searchall) {
  getList({ size: -1 }); //初始化
} else {
  const { size, current } = paginationConfig.value;
  getList({ size, current }); //初始化
}

// 操作列
const mytable = ref(null);
</script>
<style lang="less" scoped></style>
