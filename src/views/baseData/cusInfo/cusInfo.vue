<template>
  <div class="w-full">
    <!-- 数据展示、工具栏、搜索栏 -->
    <atable ref="mytable" v-on="tableEvent" v-bind="configsOfTable" />

    <!-- dialog弹窗 -->
    <Teleport to="body">
      <mydialog
        @resettable="resettable"
        @cancel="cancel"
        :editdata="editdata"
        :dialogVisible="dialogVisible"
        :dialogtype="dialogtype"
        ref="dialog"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, createVNode, nextTick } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { cusInfoList, cusInfoOpen, cusInfoDel } from "@/utils/request/api";
import mydialog from "./component/dialog.vue";
//add、edite弹窗控制
const dialog = ref(null);
const dialogVisible = ref(false);
const dialogtype = ref("add");
const dataAll = reactive({
  configsOfTable: {
    data: [],
    tableConfig: {
      border: false, //表格边框
      loading: true, //数据加载loading
      index: false, //序号
      select: true, //选择框
      // search:是否放入搜索表单、type:表单类型、form_hide:表单是否折叠（默认false）、show:table数据展示类型、align:内容位置(默认left)
      columData: [
        {
          title: "客户编码",
          dataIndex: "code",
          key: "code",
          prop: "code",
          label: "客户编码",
          show: "text",
          align: "center",
        },
        {
          title: "客户名称",
          dataIndex: "cusName",
          key: "cusName",
          prop: "cusName",
          label: "客户名称",
          align: "center",
          search: true,
          type: "input",
          form_hide: false,
          placeholder: "请输入客户名称",
          show: "text",
          align: "center",
        },
        {
          title: "客户地址",
          dataIndex: "address",
          key: "address",
          prop: "address",
          label: "客户地址",
          align: "center",
          show: "text",
        },
        {
          title: "客户联系方式",
          dataIndex: "phone",
          key: "phone",
          prop: "phone",
          label: "客户联系方式",
          show: "text",
          align: "center",
        },
        {
          title: "所属组织",
          dataIndex: "organization",
          key: "organization",
          prop: "organization",
          label: "所属组织",
          align: "center",
          search: false,
          show: "text",
          search: true,
          type: "input",
          form_hide: false,
          placeholder: "请输入客户名称",
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "creater",
          key: "creater",
          prop: "creater",
          label: "创建人",
          align: "center",
          search: false,
          show: "text",
          search: true,
          type: "input",
          form_hide: false,
          placeholder: "请输入客户名称",
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "create_time",
          key: "create_time",
          prop: "create_time",
          label: "创建时间",
          align: "center",
          show: "text",
        },
        {
          title: "备注",
          dataIndex: "remark",
          key: "remark",
          prop: "remark",
          label: "备注",
          align: "center",
          show: "text",
        },
        {
          title: "操作",
          key: "operation",
          fixed: "right",
          align: "center",
          label: "操作",
          width: 150,
        },
      ],
      operationData: [
        { operationName: "修改", btnType: "", authstr: "update-cusInfo" },
        { operationName: "删除", btnType: "danger", authstr: "delete-cusInfo" },
        { operationName: "启用", btnType: "success", authstr: "open-cusInfo" },
      ],
      treeprops: { children: "children", hasChildren: "hasChildren" },
    },
    toolsConfig: {
      addBtn: { isShow: true, authstr: "add-cusInfo" }, //新增
      delBtn: { isShow: true, authstr: "delete-cusInfo" }, //删除（多个）
      openBtn: { isShow: true, authstr: "open-cusInfo" }, //启用
      printTableData: { isShow: false, tooltipCon: "打印" }, //打印表格
      uploads: { isShow: true, tooltipCon: "上传" }, //上传
      downloads: { isShow: true, tooltipCon: "下载" }, //下载
      refreshTable: { isShow: false, tooltipCon: "刷新" }, //刷新
      fullScreen: { isShow: false, tooltipCon: "全屏" }, //全屏,
      columnsFilter: { isShow: true, tooltipCon: "列过滤" }, //列过滤
    },
    pagination: {
      //分页配置
      isShow: false,
      searchall: true, //初始是否查所有(size:-1)
      current: 1,
      size: 10,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20", "30", "40", "100"],
      showTotal: (total) => `共 ${total} 条数据`,
    },
  },
  editdata: {},
  tableEvent: {
    adds() {
      dialogVisible.value = true;
      dialogtype.value = "add";
    },
    edits(ctx) {
      dialogVisible.value = true;
      dialogtype.value = "edit";
      editdata.value.name = ctx.name;
      for (var k in ctx) {
        editdata.value[k] = ctx[k];
      }
    },
    dels(ctx) {
      let delArr = [];
      let delNames = "";
      if (ctx instanceof Array) {
        ctx.forEach((item) => {
          delArr.push(item.id);
          delNames += "[::" + item.name + "::]、";
        });
      } else {
        delNames = ctx.name;
        delArr.push(ctx.id);
      }
      Modal.confirm({
        title: "修改提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定删除客户'${delNames}'吗?`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          cusInfoDel(delArr).then((res) => {
            if (res) {
              message.success("删除成功！");
              resettable();
            }
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      });
    },
    open(ctx) {
      let delArr = [];
      let delNames = "";
      if (ctx instanceof Array) {
        ctx.forEach((item) => {
          delArr.push(item.id);
          delNames += "[::" + item.name + "::]、";
        });
      } else {
        delNames = ctx.name;
        delArr.push(ctx.id);
      }
      Modal.confirm({
        title: "修改提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定启用客户'${delNames}'吗?`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          cusInfoOpen(delArr).then((res) => {
            if (res) {
              message.success("启用成功！");
              resettable();
            }
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      });
    },
    query(ctx) {
      configsOfTable.value.tableConfig.loading = true;
      if (ctx.size != -1) {
        configsOfTable.value.pagination.size = ctx.size;
        configsOfTable.value.pagination.current = ctx.current;
        configsOfTable.value.pagination.isShow = true;
      }
      if (ctx.size == -1) {
        configsOfTable.value.pagination.isShow = false;
      }

      // cusInfoList(ctx).then(res => {
      configsOfTable.value.tableConfig.loading = false;
      configsOfTable.value.data = []; //res.data.records
      if (ctx.size != -1) {
        configsOfTable.value.pagination.total = 0; //res.data.total
        configsOfTable.value.pagination.size = 10; //res.data.size
        configsOfTable.value.pagination.current = 1; //res.data.current
      }

      // })
    },
    doOperatio(ctx) {
      switch (ctx.name) {
        case "修改":
          tableEvent.value.edits(ctx.row);
          break;
        case "删除":
          tableEvent.value.dels(ctx.row);
          break;
        case "启用":
          tableEvent.value.open(ctx.row);
          break;
        case "禁用":
          tableEvent.value.disable(ctx.row);
          break;
        default:
          console.log("未定义操作名operationName");
      }
    },
  },
});

//data数据结构
const { configsOfTable, editdata, tableEvent } = toRefs(dataAll);

//查询

//更新菜单
function resettable() {
  mytable.value.onRest(); //调用子组件方法刷新列表(子组件须先导出改属性)
}

//取消弹窗
function cancel() {
  dialogVisible.value = false;
}

if (configsOfTable.value.pagination.searchall) {
  tableEvent.value.query({ size: -1 }); //初始化
} else {
  const { size, current } = configsOfTable.value.pagination;
  tableEvent.value.query({ size, current }); //初始化
}

// 操作列
const mytable = ref(null);
</script>

<style lang="less" scoped></style>
