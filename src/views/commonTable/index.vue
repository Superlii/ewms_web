<template>

  <div style="width: 100%;">
    <!-- 搜索 -->
    <div ref="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline form">
        <el-row :gutter="10" justify="start">
          <el-col v-for="(item, index) in searchForm " :key="index" v-show="item.form_hide ? open_ : true" :md="6"
            :lg="6" :xl="4">
            <el-form-item :label="item.label + ':'">

              <!-- 默认表单 -->

              <el-input @keyup.enter="onSubmit" size="small" v-if="item.type == 'input'" v-model="formInline[item.prop]"
                :placeholder="item.placeholder">
              </el-input>

              <!-- 下拉框 -->

              <el-select @keyup.enter="onSubmit" v-if="item.type == 'select'" size="small"
                v-model="formInline[item.prop]" :placeholder="item.placeholder">
                <el-option v-for="(selectitem, selectindex) in item.selectOptionData" :key="selectindex"
                  :label="selectitem.label" :value="selectitem.value" />
              </el-select>

              <!-- start-end -->

              <el-date-picker @keyup.enter="onSubmit" v-if="item.type == 'date'" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" v-model="formInline.time" type="daterange" unlink-panels range-separator="To"
                start-placeholder="Start time" end-placeholder="End time" :shortcuts="shortcuts" size="small" />
            </el-form-item>
          </el-col>

          <!-- 功能 -->

          <el-col :span="1.5">
            <el-form-item>
              <el-button v-oneOpt="1000" size="small" :icon="allIcon.Search" type="primary" @click="onSubmit">查询
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item>
              <el-button v-oneOpt="1000" size="small" :icon="allIcon.RefreshRight" type="success" @click="onRest">重置
              </el-button>
            </el-form-item>
          </el-col>
          <el-col v-show="seacrhDataFilter(tableConfig.columData).length > 4" :span="1.5">
            <el-form-item>
              <el-button plain style="font-size: 12px;color: #333;" size="small" type="text" @click="hideformitem">展开/折叠
                <el-icon v-show="!open_" color="#409eff">
                  <allIcon.CaretBottom />
                </el-icon>
                <el-icon v-show="open_" color="#409eff">
                  <allIcon.CaretTop />
                </el-icon>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 工具栏 -->

    <div class="tools">
      <div class="toolitem">
        <el-button v-oneOpt="1000" v-hasBtn="toolsConfig.addBtn.authstr" v-if="toolsConfig.addBtn.isShow" @click="adds"
          size="small" type="primary" :icon="allIcon.Plus">新增
        </el-button>
        <el-button v-oneOpt="1000" v-hasBtn="toolsConfig.addBtn.authstr" v-if="toolsConfig.delBtn" @click="delets"
          size="small" type="warning" :icon="allIcon.Delete">删除
        </el-button>
      </div>
      <div class="toolitem">
        <el-tooltip v-if="toolsConfig.uploads.isShow" auto-close :content="toolsConfig.uploads.tooltipCon"
          effect="customized" placement="top">
          <el-button size="small" circle type="text" :icon="allIcon.Upload" />
        </el-tooltip>
        <el-tooltip v-if="toolsConfig.downloads.isShow" auto-close :content="toolsConfig.downloads.tooltipCon"
          effect="customized" placement="top">
          <el-button :loading="btnloading" @click="downloadFile(toolsConfig.downloads.name)" size="small" circle
            type="text" :icon="allIcon.Download" />
        </el-tooltip>
        <el-tooltip v-if="toolsConfig.printTableData.isShow" auto-close :content="toolsConfig.printTableData.tooltipCon"
          effect="customized" placement="top">
          <el-button v-print="'#printMe'" size="small" circle type="text" :icon="allIcon.Printer" />
        </el-tooltip>
        <el-tooltip v-if="toolsConfig.refreshTable.isShow" auto-close :content="toolsConfig.refreshTable.tooltipCon"
          effect="customized" placement="top">
          <el-button @click="refreshs" size="small" circle type="text" :icon="allIcon.Refresh" />
        </el-tooltip>
        <el-tooltip v-if="toolsConfig.fullScreen.isShow" auto-close :content="toolsConfig.fullScreen.tooltipCon"
          effect="customized" placement="top">
          <el-button @click="changeFull" size="small" circle type="text" :icon="allIcon.FullScreen" />
        </el-tooltip>
        <el-tooltip v-if="toolsConfig.columnsFilter.isShow" auto-close :content="toolsConfig.columnsFilter.tooltipCon"
          effect="customized" placement="top">
          <el-button class="columnbtn" @click="showColumn" size="small" circle type="text" :icon="allIcon.Grid" />
        </el-tooltip>
        <div v-show="columnBoxbtn" class="columnBox">
          <div class="head">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
            </el-checkbox>
          </div>
          <div class="main">
            <el-checkbox-group v-model="checkedNow" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(item, index) in allData" :key="index" :label="item">{{
                  item.label
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据展示 -->
    <!-- :max-height="maxheight"  可固定表格高度 -->
    <el-table id="printMe" ref="multipleTable" v-loading="tableConfig.loading" class="table" :data="data" row-key="id"
      :border="tableConfig.border" :tree-props="tableConfig.treeprops" @selection-change="handleSelectionChange">

      <!-- 序号 -->

      <el-table-column label="序号" v-if="tableConfig.index" align="center" type="index" width="50">
        <template #default="{ row, $index }">
          {{ (pagination.current - 1) * pagination.size + $index + 1 }}
        </template>
      </el-table-column>

      <!-- 选项框 -->

      <el-table-column v-if="tableConfig.select" align="left" type="selection" width="40" />

      <!-- 普通栏 -->

      <el-table-column show-overflow-tooltip v-for="(item, index) in dataFilter(tableConfig.columData) " :key="index"
        :prop="item.prop" :label="item.label" :align="item.align || 'left'" :width="item.width">
        <template #default="{ row, $index }">

          <!-- 默认展示 -->

          <span v-if="item.show == 'text'">
            {{
                row[item.prop] || '--'
            }}
          </span>

          <!-- svg图标展示 -->

          <span v-if="item.show == 'svg'">
            <svg-icon v-if="!!row[item.prop]" size="2rem" :name="row[item.prop] || ''"></svg-icon>
            <span v-else>{{ '--' }}</span>
          </span>

          <!-- 图片展示 -->
          <el-popover :width="190" v-if="item.show == 'img' && row[item.prop] != ''" placement="top" trigger="hover">
            <img style="width: 160px;" :src="row[item.prop]" alt="#" />
            <template #reference>
              <el-image style="width: 80px;" :src="row[item.prop]">
              </el-image>
            </template>
          </el-popover>

          <!-- tag标签展示 -->

          <span v-if="item.show == 'tagNum'">
            <el-tag v-if="row[item.prop] == 1" size="small" effect="light" class="mx-1" type="success">已启用
            </el-tag>
            <el-tag v-if="row[item.prop] == 0" size="small" effect="light" class="mx-1" type="info">未启用</el-tag>
          </span>

          <span v-if="item.show == 'tagBoolen'">
            <el-tag v-if="row[item.prop] == false" size="small" effect="light" class="mx-1" type="info">否
            </el-tag>
            <el-tag v-if="row[item.prop] == true" size="small" effect="light" class="mx-1" type="success">是</el-tag>
          </span>

          <!-- el-button展示 -->

          <span v-if="item.show == 'btn'">

            <el-button @click="tableBtnClick(row, item.label)" size="small" type="text">{{
                item.btnName
            }}</el-button>
          </span>

          <!-- 自定义内容 -->
          <span v-if="item.show == 'ownDefined'">
            <template v-if="Object.prototype.toString.call(item.definedFun(row, $index)) === '[object Object]'">
              <el-tag size="small" v-if="item.definedFun(row, $index).param == 1" class="ml-2"> {{
                  item.definedFun(row, $index).state
              }}</el-tag>
              <el-tag size="small" v-if="item.definedFun(row, $index).param == 2" class="ml-2" type="success"> {{
                  item.definedFun(row, $index).state
              }}</el-tag>
              <el-tag size="small" v-if="item.definedFun(row, $index).param == 3" class="ml-2" type="info"> {{
                  item.definedFun(row, $index).state
              }}</el-tag>
            </template>
            <template v-else>
              {{ item.definedFun(row, $index) }}
            </template>
          </span>
        </template>
      </el-table-column>>

      <!-- 操作栏 -->

      <el-table-column v-if="tableConfig.operationData.length" align="center" fixed="right" label="操作" width="200">
        <template #default="{ row, $index }">
          <template v-for="(item, index) in tableConfig.operationData" :key="index">
            <el-button v-oneOpt="1000" v-hasBtn="item.authstr" :icon="allIcon[item.icon] || ''"
              style="margin-left: 5px;" v-if="!item.isHide" :type="item.btnType || ''" size="small"
              @click="operatiosFun(row, $index, item.operationName)">{{
                  item.operationName
              }}</el-button>
          </template>


          <!-- 按钮较多处理(大于2个放下拉菜单) -->

          <el-dropdown v-if="tableConfig.operationData.length > 2" class="drops">
            <span class="el-dropdown-link con">
              <el-button type="default" size="small">更多<el-icon color="#67c23a" style="cursor: pointer;">
                  <allIcon.CaretBottom />
                </el-icon>
              </el-button>

            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="(item, index) in tableConfig.operationData" :key="index">
                  <el-dropdown-item v-if="item.isHide">

                    <el-button v-oneOpt="1000" v-hasBtn="item.authstr" :icon="allIcon[item.icon] || ''"
                      :type="item.btnType || ''" size="small" @click="operatiosFun(row, $index, item.operationName)">{{
                          item.operationName
                      }}
                    </el-button>

                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </template>

      </el-table-column>

      <!-- 空 -->

      <template #empty>
        <el-empty v-show="data.length == 0" description="暂无数据~" />
      </template>
    </el-table>

    <!-- 分页 -->

    <el-pagination ref="pagesconttrol" v-if="pagination.isShow" class="pages" v-model:currentPage="pagination.current"
      v-model:page-size="pagination.size" :page-sizes="pagination.pageSizes" small :disabled="disabled"
      :background="background" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

  </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from 'vue'
import * as allIcon from '@element-plus/icons-vue'
import { fullscreen } from "@/store/fullscreen";
import print from 'vue3-print-nb'
import { ElMessage } from 'element-plus'
import { loggerDao } from '@/utils/request/api'
import { permison } from "@/store/permison";
import { dFile } from '@/utils/request/downloads'
import watermark from 'watermark-h5'
const permisonData = permison()
watermark.init({
  parentDomName: 'body',
  show: true,
  color: 'rgba(0, 0, 0, .2)',
  title: permisonData.userinfo.userName,
  width: 200,
  height: 200,
  fontNum: 15,
  rotate: -25,
  zIndex: 9999
}
)
const multipleTable = ref(null)

//打印指令

const vPrint = print

//动态表格高
const maxheight = ref(0)
const form = ref(null)
const pagesconttrol = ref(null)
maxheight.value = document.body.clientHeight - 210 //210
onMounted(() => {
  watermark.init({
    parentDomName: 'table',
    show: true,
    color: 'rgba(0, 0, 0, .2)',
    title: permisonData.userinfo.userName,
    width: 200,
    height: 200,
    fontNum: 15,
    rotate: -25,
    zIndex: 9999
  }
  )
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
      maxheight.value = document.body.clientHeight - 210
      if (open_.value) {
        maxheight.value = document.body.clientHeight - 250
      }
    })()
  }
})
const fullscreenData = fullscreen()

//参数接收--------------------------------------------------------------------------------

function dataFilter(ctx) {
  return ctx.filter(item => item.prop != '')
}
function seacrhDataFilter(ctx) {
  return ctx.filter(item => item.search)
}
const props = defineProps({
  data: {//表格数据
    type: Array,
    required: true,
  },
  tableConfig: {//表格配置(数据列配置、搜索表单配置)
    type: Object,
    required: true,
  },
  toolsConfig: {//工具栏配置
    type: Object,
    required: true,
  },
  loading: {//加载数据loading
    type: Boolean,
    required: false
  },
  pagination: {//是否显示分页
    type: Object,
    required: false
  }
})
const { pagination, toolsConfig } = toRefs(props)
// 注册事件------defineEmits：子组件向父组件事件传递；-----------------------------------

const emitFun = defineEmits(["query", "doOperatio", "adds", "dels", "tableBtnEvent"])

//搜索栏------------------------------------------------------------------------------

//查询

//start-end time
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const searchForm = [...props.tableConfig.columData].filter(item => item.search)
const formInline = ref({
})
const onSubmit = () => {
  formInline.value.current = pagination.value.current
  formInline.value.size = pagination.value.size
  if (!!formInline.value.time && formInline.value.time.length) {
    formInline.value.beginTime = formInline.value.time[0]
    formInline.value.endTime = formInline.value.time[1]
    delete formInline.value.time
  }
  emitFun('query', formInline.value)
}


//重置

const originpagedata = { ...pagination.value }//分页原数据
const onRest = () => {
  formInline.value = {}
  pagination.value.current = originpagedata.current
  if (pagination.value.searchall) {
    pagination.value.size = -1
    onSubmit()
    pagination.value.size = originpagedata.size
    return
  }
  pagination.value.size = originpagedata.size
  onSubmit()
}

//刷新

const refreshs = () => {
  onRest()
}

// 展开搜索框

const open_ = ref(false)
const hideformitem = () => {
  open_.value = !open_.value
  // if (!!pagesconttrol.value) {
  //   maxheight.value = document.body.clientHeight - pagesconttrol.value.clientHeight - form.value.clientHeight - 80
  // } else {
  //   maxheight.value = document.body.clientHeight - form.value.clientHeight - 80
  // }

  if (open_.value) {
    maxheight.value = document.body.clientHeight - 250
  } else {
    maxheight.value = document.body.clientHeight - 210
  }
}

// 工具栏----------------------------------------------------------

//新增

const adds = () => {
  emitFun('adds')
}

//删除

const delarr = ref([])
const handleSelectionChange = (val) => {
  delarr.value = val
}
const delets = () => {
  if (delarr.value.length == 0) {
    ElMessage({
      message: '请至少选一项！',

      type: 'warning',
    })
  } else {
    emitFun('dels', delarr.value)
  }

}

//下载
const btnloading = ref(false)
const downloadFile = (ctx) => {
  btnloading.value = true
  switch (ctx) {
    case '数据日志':
      const { size, current } = pagination.value
      loggerDao({ size, current }).then((res) => {
        btnloading.value = false
        dFile(res, "数据日志", "xlsx");
      });
      break;

    default:
      break;
  }
}

//全屏

const changeFull = () => {
  fullscreenData.changeToggle()
  // if (!!pagesconttrol.value) {
  //   maxheight.value = document.body.clientHeight - pagesconttrol.value.clientHeight - form.value.clientHeight - 80
  // } else {
  //   maxheight.value = document.body.clientHeight - form.value.clientHeight - 80
  // }
}
//列展示

const columnBoxbtn = ref(false)
const showColumn = () => {
  columnBoxbtn.value = !columnBoxbtn.value
}
document.addEventListener('mouseup', (e) => {
  var columnBox = document.querySelector('.columnBox')
  var columnBtn = document.querySelector('.columnbtn')
  if (columnBox && columnBtn) {
    if (!columnBox.contains(e.target) && !columnBtn.contains(e.target)) {

      columnBoxbtn.value = false
    }
  }
})
const checkAll = ref(true)
const isIndeterminate = ref(true)
const allData = [...props.tableConfig.columData]
const checkedNow = ref([])
checkedNow.value = allData
const handleCheckAllChange = (val) => {
  checkedNow.value = val ? allData : []
  props.tableConfig.columData = checkedNow.value
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value) => {
  props.tableConfig.columData = value
  const checkedCount = value.length
  checkAll.value = checkedCount === allData.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allData.length
}


//数据展示---------------------------------------------------------------------------------

// 列事件

const tableBtnClick = (row, label) => {
  emitFun('tableBtnEvent', { row, label })
}

// 列操作


const operatiosFun = (row, index, name) => {

  emitFun('doOperatio', { row, index, name })
}

// 分页------------------------------------------------------------------------------------

const background = ref(true)
const disabled = ref(false)
const handleSizeChange = (val) => {
  pagination.value.size = val
  onSubmit()
}
const handleCurrentChange = (val) => {
  pagination.value.current = val
  onSubmit()
}




// 导出子组件属性defineExpose：组件暴露自己的属性-----------------------------------------------
defineExpose({
  onSubmit, onRest
})
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

    .el-button {
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

    :deep(.el-checkbox__input.is-checked+.el-checkbox__label) {
      color: #333 !important;
    }

    .el-checkbox {
      &:hover {
        border-radius: 3px;
        background-color: rgba(111, 122, 211, .2);
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

      .el-checkbox {
        width: 100%;
        margin: 2px;
      }

    }
  }
}

.table {
  // margin-bottom: 28px;
  font-size: 12px;
  color: #333;
  width: 100%;


}


.pages {
  // position: fixed;
  // bottom: 0;
  margin-top: 10px;
  z-index: 999;
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

