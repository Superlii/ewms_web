<template>

    <div style="width: 100%;">
        <Teleport to="body">
            <detaildialog ref="detaildialogs" :detaildata="detaildata" />
        </Teleport>
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
import { userList, userDel, userDetail, restUserPassword, downFile } from '@/utils/request/api'
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import mydialog from './component/index.vue' //mydialog:组件名保持一致
import atable from './component/table.vue'
import detaildialog from './component/detaildialog.vue'

//add、edite弹窗控制
const dialog = ref(null)
//详情弹窗控制
const dialogVisiblefordetail = ref(null)

const permisonData = permison()//permison仓库数据
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
                    title: '用户名',
                    dataIndex: 'userName',
                    key: 'userName', prop: 'userName', label: '用户名', search: true, type: 'input', form_hide: false, placeholder: '请输入用户名', show: 'text', align: 'center'
                },
                // {
                //     title: '头像',
                //     dataIndex: 'photosrc',
                //     key: 'photosrc', prop: 'photosrc', label: '头像', show: 'img', align: 'center'
                // },
                {
                    title: '登录账号',
                    dataIndex: 'loginName',
                    key: 'loginName', prop: 'loginName', label: '登录账号', search: true, type: 'input', placeholder: '请输入登录账号', show: 'text'
                },
                {
                    title: '登录次数',
                    dataIndex: 'loginCount',
                    key: 'loginCount', prop: 'loginCount', label: '登录次数', show: 'text', align: 'center'
                },
                {
                    title: '最终登录时间',
                    dataIndex: 'loginTime',
                    key: 'loginTime', prop: 'loginTime', label: '最终登录时间', show: 'text', align: 'center'
                },
                {
                    title: '最终登录IP',
                    dataIndex: 'loginHost',
                    key: 'loginHost', prop: 'loginHost', label: '最终登录IP', show: 'text', align: 'center'
                },
                {
                    title: '手机号',
                    dataIndex: 'phone',
                    key: 'phone', prop: 'phone', label: '手机号', search: true, type: 'input', placeholder: '请输入手机号', show: 'text', align: 'center'
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    key: 'email', prop: 'email', label: '邮箱', search: true, type: 'input', placeholder: '请输入邮箱', show: 'text', align: 'center'
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status', prop: 'status', label: '状态', align: 'center', search: true, type: 'input', form_hide: true, placeholder: '', show: 'tagNum'
                },
                // {
                //     title: '创建者',
                //     dataIndex: 'createBy',
                //     key: 'createBy', prop: 'createBy', label: '创建者', show: 'ownDefined', definedFun: (cur) => {
                //         return getUserById(cur.createBy)
                //     }, align: 'center'
                // },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime', prop: 'createTime', label: '创建时间', show: 'text', align: 'center'
                },
                // {
                //     title: '更新者',
                //     dataIndex: 'updateBy',
                //     key: 'updateBy', prop: 'updateBy', label: '更新者', show: 'ownDefined', definedFun: (cur) => {
                //         return getUserById(cur.updateBy)
                //     }, align: 'center'
                // },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime', prop: 'updateTime', label: '更新时间', show: 'text', align: 'center'
                },
                // { prop: 'isDelete', label: '是否已删除', align: 'center', search: true, type: 'input', form_hide: true, placeholder: '', show: 'tagBoolen',width:100 },
                // {
                //     title: '更多...',
                //     dataIndex: '更多...',
                //     key: '更多...', prop: '', label: '更多...', align: 'center', show: 'btn', btnName: '查看'
                // },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    align: 'center',
                    label: '操作',
                    width: 180
                },
            ],
            operationData: [{ operationName: '修改', isHide: false, btnType: 'primary', authstr: 'update-user' },
            { operationName: '删除', isHide: false, btnType: 'danger', authstr: 'delete-user' },
            { operationName: '重置密码', isHide: true, btnType: 'warning', authstr: 'restate-user-password' },
            ],
            treeprops: { children: 'children', hasChildren: 'hasChildren' },


        },
        toolsConfig: {
            addBtn: { isShow: true, authstr: 'save-user' },//新增
            delBtn: { isShow: true, authstr: 'delete-user' },//删除（多个）
            printTableData: { isShow: true, tooltipCon: '打印' },//打印表格
            uploads: { isShow: false, tooltipCon: '上传' },//上传
            downloads: { isShow: false, tooltipCon: '下载' },//下载
            refreshTable: { isShow: true, tooltipCon: '刷新' },//刷新
            fullScreen: { isShow: true, tooltipCon: '全屏' },//全屏,
            columnsFilter: { isShow: true, tooltipCon: '列过滤' },//列过滤
        },
        pagination: {//分页配置
            isShow: true,
            pageSizes: [10, 15, 20, 30],
            total: 0,
            current: 1,
            size: 10,
            searchall: false,//初始是否查所有(size:-1)
        },
    },
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
                    delNames += '[::' + item.userName + '::]、'
                })
            } else {
                delNames = ctx.userName
                delArr.push(ctx.id)
            }
            Modal.confirm({
                title: '删除提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: `确定删除'${delNames}'吗?`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    userDel(delArr).then(res => {
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

            userList(ctx).then(async res => {
                configsOfTable.value.data = await userPhoto(res.data.records)
                configsOfTable.value.tableConfig.loading = false
                if (ctx.size != -1) {
                    configsOfTable.value.pagination.total = res.data.total
                    configsOfTable.value.pagination.size = res.data.size
                    configsOfTable.value.pagination.current = res.data.current
                }

            })
        },
        tableBtnEvent(ctx) {
            switch (ctx.label) {
                case '更多...':
                    userDetail(ctx.row.id).then(res => {
                        detaildata.value = res.data
                        detaildialogs.value.dialogVisiblefordetailloading = false
                    })
                    detaildialogs.value.dialogVisiblefordetail = true
                    break;

                default:
                    console.log('====================================');
                    console.log('当前表格按钮点击事件', ctx.label);
                    console.log('====================================');
                    break;
            }



        },
        restUserPsd(ctx) {
            Modal.confirm({
                title: '密码重置提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: `确定重置用户'${ctx.userName}'登录密码吗?`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    restUserPassword({ id: ctx.id }).then(res => {
                        if (res.code == 200) {
                            message.success('密码重置成功！');
                            permisonData.getinfo()//更新用户信息(仓库),调用peimiosn仓库getinfo方法
                        }


                    })
                },
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onCancel() { },
            });


        },
        doOperatio(ctx) {
            switch (ctx.name) {
                case '修改':
                    tableEvent.value.edits(ctx.row)
                    break;
                case '删除':
                    tableEvent.value.dels(ctx.row)
                    break;
                case '重置密码':
                    tableEvent.value.restUserPsd(ctx.row)
                    break;
                default:
                    console.log('未定义操作名operationName');
            }
        }
    }

})

//data数据结构
const { configsOfTable, editdata, tableEvent } = toRefs(dataAll)

//查询-------------------
// 详情参数
const detaildata = ref({})//传递详情弹窗数据
const detaildialogs = ref(null)//获取详情弹窗组件

//查操作用户
const alluser = ref([])

userList({ size: -1 }).then(res => {
    alluser.value = res.data.records
})
const getUserById = (ctx) => {
    let cur = '--'
    if (alluser.value.length) {
        alluser.value.forEach(item => {
            if (item.id == ctx) {

                cur = item.userName
            }
        })

        return cur
    }


}

//用户头像处理
async function userPhoto(ctx) {
    let arr = []
    for (let item of ctx) {
        let obj = {};
        obj.fileName = item.photo;
        if (!!obj.fileName) {
            let blobdata = await downFile(obj)
            item.photosrc = window.URL.createObjectURL(blobdata)
            arr.push(item)
        } else {
            arr.push(item)
        }

    }
    return arr
}


//更新用户表
function resettable() {
    mytable.value.onRest()//调用子组件方法刷新列表(子组件须先导出改属性)
    if (dialog.value.dialogtype == 'edit') {
        permisonData.getinfo()//更新用户信息(仓库),调用peimiosn仓库getinfo方法
        permisonData.menutree()//更新菜单(仓库),调用peimiosn仓库menutree方法
    }

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