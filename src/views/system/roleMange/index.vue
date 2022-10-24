<template>


  <div style="width: 100%;">
    <!-- 数据展示、工具栏、搜索栏 -->
    <common-table ref="mytable" v-on="tableEvent" v-bind="configsOfTable" />

    <!-- dialog弹窗 -->
    <Teleport to="body">
      <mydialog @resettable="resettable" :editdata='editdata' ref="dialog" />
    </Teleport>

  </div>
</template>

<script setup >

import { ref, reactive, toRefs } from 'vue';
import { permison } from "@/store/permison";
import { roleList, roleDel } from '@/utils/request/api'
import { ElMessageBox, ElMessage } from 'element-plus'
import mydialog from './component/index.vue' //mydialog:组件名保持一致
const dialog = ref(null)
const permisonData = permison()//permison仓库数据
const dataAll = reactive({
  configsOfTable: {  //表格--
    data: [],
    tableConfig: {
      border: false,//表格边框
      loading: true,//数据加载loading
      index: false,//序号
      select: true,//选择框
      // search:是否放入搜索表单、type:表单类型、form_hide:表单是否折叠（默认false）、show:table数据展示类型、align:内容位置(默认left)
      columData: [
        { prop: 'name', label: '角色名', search: true, type: 'input', form_hide: false, placeholder: '请输入角色名称', show: 'text' },
        { prop: 'isDefault', label: '是否是默认角色', align: 'center', search: false, show: 'tagBoolen' },
        { prop: 'status', label: '当前状态', search: true, type: 'select', selectOptionData: [{ label: '启用中', value: 1 }, { label: '未启用', value: 0 }], form_hide: false, placeholder: '****', show: 'tagNum' },
      ],
      operationData: [{ operationName: '修改', btnType: '', authstr: 'update-role' },
      { operationName: '删除', btnType: 'danger', authstr: 'delete-role' },],
      treeprops: { children: 'children', hasChildren: 'hasChildren' },


    },
    toolsConfig: {
      addBtn: { isShow: true, authstr: 'save-role' },//新增
      delBtn: { isShow: true, authstr: 'delete-role' },//删除（多个）
      printTableData: { isShow: true, tooltipCon: '打印' },//打印表格
      uploads: { isShow: false, tooltipCon: '上传' },//上传
      downloads: { isShow: false, tooltipCon: '下载' },//下载
      refreshTable: { isShow: true, tooltipCon: '刷新' },//刷新
      fullScreen: { isShow: true, tooltipCon: '全屏' },//全屏,
      columnsFilter: { isShow: true, tooltipCon: '列过滤' },//列过滤
    },
    pagination: {//分页配置
      isShow: false,
      pageSizes: [10, 15, 20, 30],
      total: 0,
      current: 1,
      size: 10,
      searchall: false,//初始是否查所有(size:-1)
    },
  },
  //弹窗
  editdata: {},
  tableEvent: {
    adds() {
      dialog.value.dialogVisible = true
      dialog.value.dialogtype = 'add'
    },
    edits(ctx) {
      dialog.value.dialogVisible = true
      dialog.value.dialogtype = 'edit'
      editdata.value.name = ctx.name
      for (var k in ctx) {
        editdata.value[k] = ctx[k]
      }
    },
    dels(ctx) {
      let delArr = []
      let delNames = ''
      if (ctx instanceof Array) {
        ctx.forEach(item => {
          delArr.push(item.id)
          delNames += '[::' + item.name + '::]、'
        })
      } else {
        delNames = ctx.name
        delArr.push(ctx.id)
      }
      ElMessageBox.confirm(`确定删除'${delNames}'吗?`, '删除提示',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          roleDel(delArr).then(res => {
            if (res) {
              ElMessage({
                type: 'success',
                message: '删除成功！',
              })
              resettable()
            }
          })
        })
        .catch(() => {
          // catch error
        })
    },
    query(ctx) {
      configsOfTable.value.tableConfig.loading = true
      if (ctx.size != -1) {
        configsOfTable.value.pagination.size = ctx.size
        configsOfTable.value.pagination.current = ctx.current
        configsOfTable.value.pagination.isShow = true
      }
      if (ctx.size == -1) {
        configsOfTable.value.pagination.isShow = false
      }
      roleList(ctx).then(res => {
        configsOfTable.value.tableConfig.loading = false
        configsOfTable.value.data = res.data.records
        if (ctx.size != -1) {
          configsOfTable.value.pagination.total = res.data.total
          configsOfTable.value.pagination.size = res.data.size
          configsOfTable.value.pagination.current = res.data.current
        }

      })
    },
    doOperatio(ctx) {
      switch (ctx.name) {
        case '修改':
          tableEvent.value.edits(ctx.row)
          break;
        case '删除':
          tableEvent.value.dels(ctx.row)
          break;
        default:
          console.log('未定义操作名operationName');
      }
    }

  }
})

//data数据结构
const { configsOfTable, editdata, tableEvent } = toRefs(dataAll)
//更新角色
function resettable() {
  // mytable.value.onSubmit()//调用子组件方法刷新列表(子组件须先导出改属性)
  mytable.value.onRest()//调用子组件方法刷新列表(子组件须先导出改属性)
  permisonData.menutree()//更新角色菜单(仓库),调用peimiosn仓库menutree方法
}

if (configsOfTable.value.pagination.searchall) {
  tableEvent.value.query({ size: -1 })//初始化
} else {
  const { size, current } = configsOfTable.value.pagination
  tableEvent.value.query({ size, current })//初始化
}

// 操作列
const mytable = ref(null)



</script>
<style lang='less' scoped>

</style>