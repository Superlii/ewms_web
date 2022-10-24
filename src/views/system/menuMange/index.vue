<template>


  <div style="width: 100%;">
    <!-- 数据展示、工具栏、搜索栏 -->
    <atable ref="mytable" v-on="tableEvent" v-bind="configsOfTable" />

    <!-- dialog弹窗 -->
    <Teleport to="body">
      <mydialog @resettable="resettable" :editdata='editdata' ref="dialog" />
    </Teleport>

  </div>
</template>

<script setup >

import { ref, reactive, toRefs, createVNode } from 'vue';
import { permison } from "@/store/permison";
import { menuList, menuDel, dictList } from '@/utils/request/api'
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import mydialog from './component/index.vue'
import atable from './component/table.vue'
const dialog = ref(null)
const permisonData = permison()//permison仓库数据
const menutype = ref([])
//获取菜单类型-字典
dictList({ belong: 'menu' }).then(res => {
  menutype.value = res.data.records
})
const dataAll = reactive({
  configsOfTable: {
    data: [],
    tableConfig: {
      border: false,//表格边框
      loading: true,//数据加载loading
      index: false,//序号
      select: true,//选择框
      // search:是否放入搜索表单、type:表单类型、form_hide:表单是否折叠（默认false）、show:table数据展示类型、align:内容位置(默认left)
      columData: [
        {
          title: '菜单名称',
          dataIndex: 'name',
          key: 'name', prop: 'name', label: '菜单名称', search: true, type: 'input', form_hide: false, placeholder: '请输入菜单名称', show: 'text', align: 'left', width: 200
        },
        {
          title: '菜单类型',
          dataIndex: 'type',
          key: 'type',
          prop: 'type', label: '菜单类型', align: 'center', search: false
        },
        {
          title: '菜单图标',
          dataIndex: 'icon',
          key: 'icon', prop: 'icon', label: '菜单图标', align: 'center', search: false, show: 'svg'
        },
        {
          title: '路由地址',
          dataIndex: 'path',
          key: 'path', prop: 'path', label: '路由地址', search: true, type: 'input', align: 'center', placeholder: '****', show: 'text'
        },
        {
          title: '组件地址',
          dataIndex: 'link',
          key: 'link', prop: 'link', label: '组件地址', search: true, type: 'input', align: 'center', placeholder: '****', show: 'text'
        },

        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          align: 'center',
          label: '操作',
          width: 150,
        },
      ],
      operationData: [{ operationName: '修改', btnType: '', authstr: 'update-menu' },
      { operationName: '删除', btnType: 'danger', authstr: 'delete-menu' },],
      treeprops: { children: 'children', hasChildren: 'hasChildren' },


    },
    toolsConfig: {
      addBtn: { isShow: true, authstr: 'save-menu' },//新增
      delBtn: { isShow: true, authstr: 'delete-menu' },//删除（多个）
      printTableData: { isShow: true, tooltipCon: '打印' },//打印表格
      uploads: { isShow: false, tooltipCon: '上传' },//上传
      downloads: { isShow: false, tooltipCon: '下载' },//下载
      refreshTable: { isShow: true, tooltipCon: '刷新' },//刷新
      fullScreen: { isShow: true, tooltipCon: '全屏' },//全屏,
      columnsFilter: { isShow: true, tooltipCon: '列过滤' },//列过滤
    },
    pagination: {//分页配置
      isShow: false,
      searchall: true,//初始是否查所有(size:-1)
      current: 1,
      size: 10,
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '30', '40', '100'],
      showTotal: (total) => `共 ${total} 条数据`,
    },
  },
  editdata: {},
  tableEvent: {
    adds() {
      dialog.value.dialogVisible = true
      dialog.value.dialogtype = 'add'
    },
    edits(ctx) {
      console.log(ctx);
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
      Modal.confirm({
        title: '修改提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定删除菜单'${delNames}'吗?`,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          menuDel(delArr).then(res => {
            if (res) {
              message.success('删除成功！');
              resettable()

            }


          })
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
      });
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

      menuList(ctx).then(res => {
        configsOfTable.value.tableConfig.loading = false
        configsOfTable.value.data = toTree(res.data.records)
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
    },
  }
})

//data数据结构
const { configsOfTable, editdata, tableEvent } = toRefs(dataAll)

//查询

//更新菜单
function resettable() {
  // mytable.value.onSubmit()//调用子组件方法刷新列表(子组件须先导出改属性)
  mytable.value.onRest()//调用子组件方法刷新列表(子组件须先导出改属性)
  permisonData.menutree()//更新菜单(仓库),调用peimiosn仓库menutree方法
}

if (configsOfTable.value.pagination.searchall) {
  tableEvent.value.query({ size: -1 })//初始化
} else {
  const { size, current } = configsOfTable.value.pagination
  tableEvent.value.query({ size, current })//初始化
}

//转树结构数据
function toTree(data) {
  let result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children;
  });
  let map = {};
  data.forEach(item => {
    map[item.id] = item;
  });
  data.forEach(item => {
    let parent = map[item.pid];
    if (parent) {

      (parent.children || (parent.children = [])).push(item);

    } else {

      result.push(item);
    }

  });
  return result;
}

// 操作列
const mytable = ref(null)



</script>
<style lang='less' scoped>

</style>