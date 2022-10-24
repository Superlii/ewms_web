<template>
  <div style="width: 100%">
    <!-- 数据展示、工具栏、搜索栏 -->
    <atable ref="mytable" v-on="tableEvent" v-bind="configsOfTable" />
    <!-- 预览文件的地方（用于渲染） -->
    <Teleport to="body">
      <div v-show="docDialog || xlsxDialog">
        <div class="filbtn">
          <a-button v-print="printObj" :icon="Printer" type=""> 打印</a-button>
          <a-button @click="tui" :icon="CloseBold" type=""> 退出</a-button>
        </div>

        <div id="docFil">
          <div v-show="docDialog" class="fil" ref="file"></div>
          <div v-show="xlsxDialog" class="fil">
            <div class="file-pre">
              <a-tabs v-model="activeName" type="border-card">
                <a-tab-pane
                  v-for="(item, index) in excelSheet"
                  :key="index"
                  :label="item.name"
                  :name="item.name"
                >
                  <div class="table" v-html="item.innerHTML"></div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { fileList, downFile, downFile2 } from "@/utils/request/api";
import { dFile } from "@/utils/request/downloads";
import { printFun } from "@/utils/print/blobPrint";
import { renderAsync } from "docx-preview"; // 引入异步渲染方法
import * as XLSX from "xlsx"; // vue3可用此引入
import print from "vue3-print-nb";
import { CloseBold, Printer } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import atable from "./component/table.vue";
const dataAll = reactive({
  configsOfTable: {
    //表格--
    data: [],
    tableConfig: {
      border: false, //表格边框
      loading: true, //数据加载loading
      index: true, //序号
      select: false, //选择框
      // search:是否放入搜索表单、type:表单类型、form_hide:表单是否折叠（默认false）、show:table数据展示类型、align:内容位置(默认left)
      columData: [
        {
          prop: "bucket",
          label: "文件桶",
          align: "center",
          search: false,
          type: "input",
          form_hide: false,
          placeholder: "请输入文件名称",
          show: "text",
        },
        {
          prop: "fileName",
          label: "文件名",
          align: "center",
          search: true,
          type: "input",
          show: "text",
        },
        {
          prop: "path",
          label: "文件路径",
          align: "center",
          search: false,
          type: "input",
          placeholder: "****",
          show: "text",
        },
        {
          prop: "url",
          label: "下载地址",
          align: "center",
          search: true,
          type: "input",
          placeholder: "****",
          show: "text",
        },
      ],
      operationData: [
        {
          operationName: "预览",
          btnType: "info",
          icon: "Printer",
          authstr: "file-print",
        },
        {
          operationName: "下载",
          btnType: "success",
          icon: "Download",
          authstr: "file-download",
        },
      ],
      treeprops: { children: "children", hasChildren: "hasChildren" },
    },
    toolsConfig: {
      addBtn: { isShow: false, authstr: "" }, //新增
      delBtn: { isShow: false, authstr: "" }, //删除（多个）
      printTableData: { isShow: true, tooltipCon: "打印" }, //打印表格
      uploads: { isShow: false, tooltipCon: "上传" }, //上传
      downloads: { isShow: false, tooltipCon: "下载" }, //下载
      refreshTable: { isShow: true, tooltipCon: "刷新" }, //刷新
      fullScreen: { isShow: true, tooltipCon: "全屏" }, //全屏,
      columnsFilter: { isShow: true, tooltipCon: "列过滤" }, //列过滤
    },
    pagination: {
      //分页配置
      isShow: false,
      pageSizes: [-1, 10, 15, 20, 30],
      total: 0,
      current: 1,
      size: 10,
      searchall: false, //初始是否查所有(size:-1)
    },
  },
  //弹窗
  editdata: {},
  tableEvent: {
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

      fileList(ctx).then((res) => {
        configsOfTable.value.tableConfig.loading = false;
        configsOfTable.value.data = res.data.records;
        if (ctx.size != -1) {
          configsOfTable.value.pagination.total = res.data.total;
          configsOfTable.value.pagination.size = res.data.size;
          configsOfTable.value.pagination.current = res.data.current;
        }
      });
    },
    doOperatio(ctx) {
      let filetype =
        ctx.row.fileName.split(".")[ctx.row.fileName.split(".").length - 1];
      switch (ctx.name) {
        case "预览":
          let obj1 = {};
          obj1.fileName = ctx.row.url;
          if (filetype == "docx") {
            docDialog.value = true;
            xlsxDialog.value = false;
            downFile(obj1).then((res) => {
              console.log(res);
              if (res.size > 100) {
                renderAsync(res, file.value); // 渲染到页面
              } else {
                ElMessage({
                  type: "warning",
                  message: "文件不存在！",
                });
                docDialog.value = false;
              }
            });
          } else if (filetype == "doc") {
            ElMessage({
              type: "warning",
              message: "仅支持docx格式文档预览！",
            });
          } else if (filetype == "xlsx") {
            xlsxDialog.value = true;
            docDialog.value = false;
            downFile2(obj1).then((res) => {
              console.log(res);
              if (res.byteLength > 100) {
                let workbook = XLSX.read(new Uint8Array(res), {
                  type: "array",
                }); // 解析数据
                // let worksheet = workbook.Sheets[workbook.SheetNames[0]]; // workbook.SheetNames 下存的是该文件每个工作表名字,这里取出第一个工作表
                // xlsxBox.value = XLSX.utils.sheet_to_html(worksheet); // 渲染
                console.log(workbook.SheetNames);
                const sheetList = workbook.SheetNames.filter(
                  (v) => v.indexOf("数据源") === -1
                );
                activeName.value = sheetList[0];
                sheetList.forEach((sheet) => {
                  const worksheet = workbook.Sheets[sheet];
                  if (worksheet) {
                    const innerHTML = XLSX.utils.sheet_to_html(worksheet);
                    excelSheet.value.push({
                      name: sheet,
                      innerHTML: innerHTML,
                    });
                  } else {
                    excelSheet.value.push({
                      name: sheet,
                      innerHTML: "暂无数据",
                    });
                  }
                });
              } else {
                ElMessage({
                  type: "warning",
                  message: "文件不存在！",
                });
                xlsxDialog.value = false;
              }
            });
          } else if (filetype == "xls") {
            ElMessage({
              type: "warning",
              message: "仅支持xlsx格式表格预览！",
            });
          } else {
            downFile(obj1).then((res) => {
              if (res.size > 100) {
                printFun(res, filetype);
              } else {
                ElMessage({
                  type: "warning",
                  message: "文件不存在！",
                });
                docDialog.value = false;
              }
            });
          }

          break;
        case "下载":
          let obj2 = {};
          obj2.fileName = ctx.row.url;
          downFile(obj2).then((res) => {
            if (res.size > 100 || res.byteLength > 100) {
              dFile(res, ctx.row.fileName, filetype);
            } else {
              ElMessage({
                type: "warning",
                message: "文件不存在！",
              });
              docDialog.value = false;
            }
          });
          break;
        default:
          console.log("未定义操作名operationName");
      }
    },
  },
});

//data数据结构
const { configsOfTable, editdata, tableEvent } = toRefs(dataAll);

//打印指令

const vPrint = print;
//查询
if (configsOfTable.value.pagination.searchall) {
  tableEvent.value.query({ size: -1 }); //初始化
} else {
  const { size, current } = configsOfTable.value.pagination;
  tableEvent.value.query({ size, current }); //初始化
}

//图片回显

// 操作列
const mytable = ref(null);
const file = ref(null);
const docDialog = ref(false); //doc预览
const xlsxDialog = ref(false); //xlsx预览
const excelSheet = ref([]); //xlsx内容列表
const activeName = ref(""); //xlsx
const printObj = reactive({
  id: "docFil",
  closeCallback: () => {},
});

const tui = () => {
  docDialog.value = xlsxDialog.value = false;
  excelSheet.value = [];
};
</script>
<style lang="less" scoped>
.fil {
  position: absolute;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
}

.filbtn {
  position: fixed;
  z-index: 1000;
  right: 100px;
  top: 5px;
  color: blue;
  background-color: transparent;
  border: none;
  font-size: 25px;
}
</style>
<style media="print">
@page {
  size: 12px;
  margin: 3mm;
}

@media print {
  #docFil {
    height: 100vh;
  }

  html {
    /* background-color: #ffffff; */
    height: auto;
    margin: 0px;
  }

  body {
    /* border: solid 1px #ffffff; */
    -webkit-print-color-adjust: exact;
    /* margin: 10mm 15mm 10mm 15mm; */
  }

  html,
  body {
    height: auto;
    /* background-color: #ffffff; */
  }

  #docFil .a-table__header-wrapper .a-table__header {
    width: 100% !important;
    /* border: solid 1px #333; */
  }

  #docFil .a-table__body-wrapper .a-table__body {
    width: 100% !important;
  }
}
</style>
<style lang="less">
.docx {
  padding: 0 !important;
}

.docx-wrapper {
  background: #ffff !important;
}

.docx-wrapper > section.docx {
  box-shadow: none !important;
}

.file-pre {
  height: 100vh;
  // padding: 20px;

  .table-html-wrap {
    &:deep(table) {
      border-right: 1px solid #e8eaec;
      border-bottom: 1px solid #e8eaec;
      border-collapse: collapse;
      margin: auto;
    }
  }

  .table-html-wrap {
    &:deep(table td) {
      border-left: 1px solid #e8eaec;
      border-top: 1px solid #e8eaec;
      white-space: wrap;
      text-align: left;
      // min-width: 100px;
      padding: 4px;
    }
  }

  table {
    border-top: 1px solid #ebeef5 !important;
    border-left: 1px solid #ebeef5 !important;
    width: 100% !important;
    // overflow: auto !important;

    tr {
      height: 44px;
    }

    td {
      // min-width: 200px;
      // max-width: 400px;
      padding: 4px 8px;
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
    }
  }

  :deep(el-tabs) {
    // height: 100vh;
  }

  .el-tabs--border-card {
    height: 100%;
    background-color: #ffff;
  }

  .el-tabs--border-card > .el-tabs__content {
    overflow: auto;
    // height: 100vh;
    padding: 0;
  }
}
</style>
