<template>
  <div style="width: 100%">
    <!-- 搜索 -->
    <div ref="form">
      <a-form class="form" :model="formInline">
        <a-row :gutter="[16, 0]" justify="start">
          <a-col
            v-for="(item, index) in searchForm"
            :key="index"
            v-show="item.form_hide ? open_ : true"
            :span="6"
          >
            <a-form-item :label="item.label + ':'">
              <!-- 默认表单 -->

              <a-input
                @keyup.enter="onSubmit"
                size="small"
                v-if="item.type == 'input'"
                v-model:value="formInline[item.prop]"
                :placeholder="item.placeholder"
              >
              </a-input>

              <!-- 下拉框 -->
            </a-form-item>
          </a-col>

          <!-- 功能 -->

          <a-col :span="1.5">
            <a-form-item>
              <a-button
                v-oneOpt="1000"
                size="small"
                type="primary"
                @click="onSubmit"
                ><template #icon> <allIcon.SearchOutlined /> </template>查询
              </a-button>
            </a-form-item>
          </a-col>
          <a-col :span="1.5">
            <a-form-item>
              <a-button v-oneOpt="1000" size="small" @click="onRest"
                ><template #icon> <allIcon.ReloadOutlined /> </template>重置
              </a-button>
            </a-form-item>
          </a-col>
          <a-col
            v-show="seacrhDataFilter(tableConfig.columData).length > 4"
            :span="1.5"
          >
            <a-form-item>
              <a-button
                style="font-size: 12px; color: #333"
                size="small"
                type="text"
                @click="hideformitem"
              >
                展开/折叠
                <allIcon.CaretDownOutlined
                  :style="{ color: '#409eff' }"
                  v-show="!open_"
                />
                <allIcon.CaretUpOutlined
                  :style="{ color: '#409eff' }"
                  v-show="open_"
                />
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 工具栏 -->

    <div class="tools">
      <div class="toolitem">
        <a-row :gutter="24">
          <a-col class="gutter-row" :span="7">
            <a-button
              v-oneOpt="1000"
              v-if="toolsConfig.addBtn.isShow"
              @click="adds"
              size="small"
              type="primary"
              ><template #icon> <allIcon.PlusOutlined /> </template>新增
            </a-button>
          </a-col>
          <a-col class="gutter-row" :span="7">
            <a-button
              v-oneOpt="1000"
              v-if="toolsConfig.delBtn"
              @click="delets"
              size="small"
              danger
              ><template #icon> <allIcon.DeleteOutlined /> </template>删除
            </a-button>
          </a-col>
          <a-col class="gutter-row" :span="7">
            <a-button
              v-oneOpt="1000"
              v-if="toolsConfig.openBtn.isShow"
              @click="open"
              size="small"
              danger
              >启用
            </a-button>
          </a-col>
        </a-row>
      </div>
      <div class="toolitem">
        <a-row :gutter="24">
          <a-col class="gutter-row" :span="8" v-if="toolsConfig.uploads.isShow">
            <a-tooltip :title="toolsConfig.uploads.tooltipCon" placement="top">
              <app-upload-btn type="primary" @change="upload" multiple>
              </app-upload-btn>
              <!-- <a-upload @change="upload">
                <a-button shape="circle" type="file" size="small">
                  <template #icon>
                    <allIcon.UploadOutlined />
                  </template>
                </a-button>
              </a-upload> -->
            </a-tooltip>
          </a-col>
          <a-col
            class="gutter-row"
            :span="6"
            v-if="toolsConfig.downloads.isShow"
          >
            <a-tooltip
              :title="toolsConfig.downloads.tooltipCon"
              placement="top"
            >
              <a-button
                :loading="btnloading"
                @click="downloadFile(toolsConfig.downloads.name)"
                shape="circle"
                size="small"
              >
                <template #icon>
                  <allIcon.DownloadOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col
            class="gutter-row"
            :span="4"
            v-if="toolsConfig.printTableData.isShow"
          >
            <a-tooltip
              :title="toolsConfig.printTableData.tooltipCon"
              placement="top"
            >
              <a-button v-print="'#printMe'" shape="circle" size="small">
                <template #icon>
                  <allIcon.PrinterOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col
            class="gutter-row"
            :span="4"
            v-if="toolsConfig.refreshTable.isShow"
          >
            <a-tooltip
              :title="toolsConfig.refreshTable.tooltipCon"
              placement="top"
            >
              <a-button @click="refreshs" shape="circle" size="small">
                <template #icon>
                  <allIcon.ReloadOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col
            class="gutter-row"
            :span="4"
            v-if="toolsConfig.fullScreen.isShow"
          >
            <a-tooltip
              :title="toolsConfig.fullScreen.tooltipCon"
              placement="top"
            >
              <a-button @click="changeFull" shape="circle" size="small">
                <template #icon>
                  <allIcon.FullscreenOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col
            class="gutter-row"
            :span="6"
            v-if="toolsConfig.columnsFilter.isShow"
          >
            <a-tooltip
              auto-close
              :content="toolsConfig.columnsFilter.tooltipCon"
              effect="customized"
              placement="top"
            >
              <a-button @click="showColumn" shape="circle" size="small">
                <template #icon>
                  <allIcon.AppstoreOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </a-col>
        </a-row>
        <div v-show="columnBoxbtn" class="columnBox">
          <div class="head">
            <a-checkbox
              :checked="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </a-checkbox>
          </div>
          <div class="main">
            <a-checkbox-group
              :value="checkedNow"
              :options="plainOptions"
              @change="handleCheckedCitiesChange"
            >
              <!-- <a-row justify="start">
                  <a-col style="display:flex;" :span="24" v-for="(item, index) in allData" :key="index">
                    <a-checkbox checked="true" :value="item.label">{{item.label}}</a-checkbox>
                  </a-col>
                </a-row> -->
            </a-checkbox-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据展示 -->
    <!-- :max-height="maxheight"  可固定表格高度 -->
    <a-table
      :row-selection="rowSelection"
      :row-key="(record) => record.id"
      v-loading="tableConfig.loading"
      :pagination="false"
      class="table"
      :dataSource="data"
      :columns="dataFilter(tableConfig.columData)"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-else-if="column.key === 'type'">
          <span>
            <a-tag
              :color="
                record.type == '1'
                  ? 'volcano'
                  : record.type == '2'
                  ? 'geekblue'
                  : 'green'
              "
            >
              {{
                record.type == "1"
                  ? "目录"
                  : record.type == "2"
                  ? "菜单"
                  : "按钮"
              }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'icon'">
          <span>
            <svg-icon
              v-if="!!record.icon"
              size="2rem"
              :name="record.icon || ''"
            ></svg-icon>
            <span v-else>{{ "--" }}</span>
          </span>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-row :gutter="[16, 16]">
            <a-col
              :span="8"
              v-for="(item, index) in tableConfig.operationData"
              :key="index"
            >
              <a-button
                v-oneOpt="1000"
                v-hasBtn="item.authstr"
                style="margin-left: 5px"
                v-if="!item.isHide"
                :type="item.btnType || ''"
                size="small"
                @click="operatiosFun(record, $index, item.operationName)"
                >{{
                  item.operationName === "启用" && record.status === "0"
                    ? "禁用"
                    : item.operationName
                }}</a-button
              >
            </a-col>
          </a-row>
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
    <a-pagination
      v-show="pagination.isShow"
      size="small"
      :total="pagination.total"
      show-size-changer
      v-model:current="pagination.current"
      v-model:pageSize="pagination.size"
      :pageSizeOptions="pagination.pageSizeOptions"
      show-quick-jumper
      :show-total="pagination.showTotal"
      @showSizeChange="handleSizeChange"
      @change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from "vue";
// import * as allIcon from '@element-plus/icons-vue'
import * as allIcon from "@ant-design/icons-vue";
import { fullscreen } from "@/store/fullscreen";
import print from "vue3-print-nb";
import { message } from "ant-design-vue";
import { loggerDao, uploadFile } from "@/utils/request/api";
import { permison } from "@/store/permison";
import { dFile } from "@/utils/request/downloads";
import watermark from "watermark-h5";
const permisonData = permison();
watermark.init({
  parentDomName: "body",
  show: true,
  color: "rgba(0, 0, 0, .2)",
  title: permisonData.userinfo.userName,
  width: 200,
  height: 200,
  fontNum: 15,
  rotate: -25,
  zIndex: 9999,
});
const multipleTable = ref(null);

//打印指令

const vPrint = print;

//动态表格高
const maxheight = ref(0);
const form = ref(null);
const pagesconttrol = ref(null);
maxheight.value = document.body.clientHeight - 210; //210
onMounted(() => {
  watermark.init({
    parentDomName: "table",
    show: true,
    color: "rgba(0, 0, 0, .2)",
    title: permisonData.userinfo.userName,
    width: 200,
    height: 200,
    fontNum: 15,
    rotate: -25,
    zIndex: 9999,
  });
  // if (!!pagesconttrol.value) {
  //   maxheight.value = document.body.clientHeight - pagesconttrol.value.clientHeight - form.value.clientHeight - 80
  // } else {
  //   maxheight.value = document.body.clientHeight - form.value.clientHeight - 80
  // }
  //210
  window.onresize = () => {
    return (() => {
      // if (!!pagesconttrol.value) {
      //   maxheight.value = document.body.clientHeight - pagesconttrol.value.clientHeight - form.value.clientHeight - 80
      // } else {
      //   maxheight.value = document.body.clientHeight - form.value.clientHeight - 80
      // }
      maxheight.value = document.body.clientHeight - 210;
      if (open_.value) {
        maxheight.value = document.body.clientHeight - 250;
      }
    })();
  };
});
const fullscreenData = fullscreen();

//参数接收--------------------------------------------------------------------------------

function dataFilter(ctx) {
  return ctx.filter((item) => item.title != "");
}
function seacrhDataFilter(ctx) {
  return ctx.filter((item) => item.search);
}
const props = defineProps({
  data: {
    //表格数据
    type: Array,
    required: true,
  },
  tableConfig: {
    //表格配置(数据列配置、搜索表单配置)
    type: Object,
    required: true,
  },
  toolsConfig: {
    //工具栏配置
    type: Object,
    required: true,
  },
  loading: {
    //加载数据loading
    type: Boolean,
    required: false,
  },
  pagination: {
    //是否显示分页
    type: Object,
    required: false,
  },
});
const { pagination, toolsConfig } = toRefs(props);
// 注册事件------defineEmits：子组件向父组件事件传递；-----------------------------------

const emitFun = defineEmits([
  "query",
  "doOperatio",
  "adds",
  "dels",
  "tableBtnEvent",
]);

//搜索栏------------------------------------------------------------------------------

//查询

//start-end time
const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
const searchForm = [...props.tableConfig.columData].filter(
  (item) => item.search
);
const formInline = ref({});
const onSubmit = () => {
  formInline.value.current = pagination.value.current;
  formInline.value.size = pagination.value.size;
  if (!!formInline.value.time && formInline.value.time.length) {
    formInline.value.beginTime = formInline.value.time[0];
    formInline.value.endTime = formInline.value.time[1];
    delete formInline.value.time;
  }
  emitFun("query", formInline.value);
};

//重置

const originpagedata = { ...pagination.value }; //分页原数据
const onRest = () => {
  formInline.value = {};
  pagination.value.current = originpagedata.current;
  if (pagination.value.searchall) {
    pagination.value.size = -1;
    onSubmit();
    pagination.value.size = originpagedata.size;
    return;
  }
  pagination.value.size = originpagedata.size;
  onSubmit();
};

//刷新

const refreshs = () => {
  onRest();
};

// 展开搜索框

const open_ = ref(false);
const hideformitem = () => {
  open_.value = !open_.value;
  // if (!!pagesconttrol.value) {
  //   maxheight.value = document.body.clientHeight - pagesconttrol.value.clientHeight - form.value.clientHeight - 80
  // } else {
  //   maxheight.value = document.body.clientHeight - form.value.clientHeight - 80
  // }

  if (open_.value) {
    maxheight.value = document.body.clientHeight - 250;
  } else {
    maxheight.value = document.body.clientHeight - 210;
  }
};

// 工具栏----------------------------------------------------------

//新增

const adds = () => {
  emitFun("adds");
};

//删除

const delarr = ref([]);
const openArr = ref([]);
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    delarr.value = selectedRows;
    openArr.value = selectedRows;
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
});

//删除选中行
const delets = () => {
  if (delarr.value.length == 0) {
    message.warning("请至少选一项！");
  } else {
    emitFun("dels", delarr.value);
  }
};

//启用选中行
const open = () => {
  if (openArr.value.length == 0) {
    message.warning("请至少选一项！");
  } else {
    emitFun("open", openArr.value);
  }
};

//上传
const upload = (file) => {
  const formData = new FormData();
  formData.set("file", file[0]);
  uploadFile(formData).then((res) => {
    if (res.code !== 200) {
      message.error(res.message);
      return false;
    }
    message.success(res.message);
  });
};

//下载
const btnloading = ref(false);
const downloadFile = (ctx) => {
  btnloading.value = true;
  switch (ctx) {
    case "数据日志":
      const { size, current } = pagination.value;
      loggerDao({ size, current }).then((res) => {
        btnloading.value = false;
        dFile(res, "数据日志", "xlsx");
      });
      break;

    default:
      break;
  }
};

//全屏

const changeFull = () => {
  fullscreenData.changeToggle();
  // if (!!pagesconttrol.value) {
  //   maxheight.value = document.body.clientHeight - pagesconttrol.value.clientHeight - form.value.clientHeight - 80
  // } else {
  //   maxheight.value = document.body.clientHeight - form.value.clientHeight - 80
  // }
};
//列展示

const columnBoxbtn = ref(false);
const showColumn = () => {
  columnBoxbtn.value = !columnBoxbtn.value;
};
document.addEventListener("mouseup", (e) => {
  var columnBox = document.querySelector(".columnBox");
  var columnBtn = document.querySelector(".columnbtn");
  if (columnBox && columnBtn) {
    if (!columnBox.contains(e.target) && !columnBtn.contains(e.target)) {
      columnBoxbtn.value = false;
    }
  }
});
const checkAll = ref(true);
const isIndeterminate = ref(true);
const allData = [...props.tableConfig.columData];
const checkedNow = ref([]);
const plainOptions = ref([]);
checkedNow.value = allData.map((i) => {
  return i.label;
});
plainOptions.value = allData.map((i) => {
  return i.label;
});
const handleCheckAllChange = (e) => {
  // checkedList: e.target.checked ? plainOptions : [],
  console.log(e);
  checkAll.value = !checkAll.value;
  checkedNow.value = e.target.checked ? plainOptions : [];
  props.tableConfig.columData = checkedNow.value;
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value) => {
  if (value && value.length) {
    value.forEach((i) => {
      props.tableConfig.columData.find((i1) => {
        if (i1.label == i) {
          i1.ishide = false;
        } else {
          i1.ishide = true;
        }
      });
    });
  }
  // props.tableConfig.columData = value
  const checkedCount = value.length;
  checkAll.value = checkedCount === allData.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < allData.length;
};

//数据展示---------------------------------------------------------------------------------

// 列事件

const tableBtnClick = (row, label) => {
  emitFun("tableBtnEvent", { row, label });
};

// 列操作

const operatiosFun = (row, index, name) => {
  emitFun("doOperatio", { row, index, name });
};

// 分页------------------------------------------------------------------------------------

const background = ref(true);
const disabled = ref(false);
const handleSizeChange = (val, c) => {
  console.log(val, c, "size");
  pagination.value.size = c;
  onSubmit();
};
const handleCurrentChange = (val, c) => {
  console.log(val, c, "cur");
  pagination.value.current = val;
  onSubmit();
};

// 导出子组件属性defineExpose：组件暴露自己的属性-----------------------------------------------
defineExpose({
  onSubmit,
  onRest,
});
</script>

<style lang="less" scoped>
.drops {
  margin-left: 5px;

  .el-button {
    color: #333;
  }

  .con {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.form {
  margin: 0 0 5px 5px;

  :deep(.el-form-item) {
    margin: 0;
    width: 100%;
  }

  .el-col {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .ant-col {
    position: relative;
    max-width: 100%;
    /* min-height: 1px; */
    height: 34px;
  }

  :deep(.ant-form-item-label > label) {
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    height: 32px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 12px;
  }
}

.tools {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 0 0 10px 5px;

  .toolitem:last-of-type {
    margin-right: 10px;
    display: flex;
    justify-content: space-around;

    :deep(.ant-btn-circle.ant-btn-sm) {
      border: 1px solid #ccc;
    }

    .a-button {
      border: 1px solid #ccc;
      color: #333;
      background-color: transparent;
    }
  }

  .columnBox {
    position: absolute;
    right: 10px;
    top: 30px;
    width: 200px;
    max-height: 350px;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 9999999;
    box-shadow: 0 0 5px #333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    background-color: #ffff;

    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: #333 !important;
    }

    .el-checkbox {
      &:hover {
        border-radius: 3px;
        background-color: rgba(111, 122, 211, 0.2);
      }
    }

    .head,
    .foot {
      height: 4rem;
      width: 100%;
      padding: 5px 10px;
    }

    .head {
      border-bottom: 1px solid #ccc;

      .el-checkbox {
        width: 100%;
        margin: 2px;
      }
    }

    .foot {
      border-top: 1px solid #ccc;
    }

    .main {
      padding: 5px 10px;
      flex: 1;
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;

      .a-checkbox {
        width: 100%;
        margin: 2px;
      }

      .a-col {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}

.table,
:deep(.ant-table) {
  // margin-bottom: 28px;
  font-size: 12px !important;
  color: #333 !important;
  width: 100%;
}

.pages,
:deep(.ant-pagination) {
  // position: fixed;
  // bottom: 0;
  margin-top: 10px;
  margin-bottom: 5px;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
  font-size: 12px;
}
</style>

<style media="print">
@page {
  size: 12px;
  margin: 3mm;
}

@media print {
  html {
    background-color: #ffffff;
    height: auto;
    margin: 0px;
  }

  body {
    border: solid 1px #ffffff;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    /* margin: 10mm 15mm 10mm 15mm; */
  }

  html,
  body {
    height: auto;
    color: #333 !important;
  }

  #printMe .el-table__header-wrapper .el-table__header {
    width: 100% !important;
    color: #333 !important;
    /* border: solid 1px #333; */
  }

  .el-table thead {
    color: #333 !important;
    font-weight: 900;
  }

  #printMe .el-table__body-wrapper .el-table__body {
    width: 100% !important;
    color: #333 !important;
  }
}
</style>
