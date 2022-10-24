/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-05-17 15:57:20
 *@Description: 
*/
<template>
    <!-- Form -->
    <div>
        <el-dialog :modal="false" width="700px" v-model="dialogVisible" :title="dialogtype == 'add' ? '添加角色' : '修改角色'">
            <el-form v-loading="dloading" element-loading-background="transparent" :model="form" :rules="rules"
                ref="ruleFormRef">
                <el-row :gutter="20">
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="name" label="角色名称:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.name" placeholder="Please select a zone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="是否是默认角色:" :label-width="100">
                            <el-switch v-model="form.isDefault" inline-prompt active-text="是" :active-value="true"
                                inactive-text="否" :inactive-value="false" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="是否启用:" :label-width="formLabelWidth">
                            <el-switch v-model="form.status" inline-prompt active-text="是" :active-value="1"
                                inactive-text="否" :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                    <el-col v-if="dialogtype != 'add'" :lg="12" :md="24">
                        <el-form-item label="重置角色菜单:" :label-width="100">
                            <el-switch v-model="rolemenudata.restrolemenubtn" inline-prompt active-text="是"
                                :active-value="true" inactive-text="否" :inactive-value="false" />
                        </el-form-item>
                    </el-col>
                    <el-col v-if="dialogtype != 'add' && rolemenudata.restrolemenubtn" :lg="12" :md="24">
                        <el-form-item label="*菜单数据:" :label-width="formLabelWidth">
                            <el-tree-select :default-expand-all="true" check-strictly multiple size="small" :props="{
                                children: 'children',
                                label: 'name',
                                value: 'id'
                            }" v-model="rolemenudata.role_list" :data="rolemenudata.allmenus" />
                        </el-form-item>
                    </el-col>
                </el-row>



            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="sure">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>

<script  setup name="mydialog">
import { ElMessageBox, ElMessage } from 'element-plus'
import { reactive, ref, toRefs, watch } from 'vue'
import { roleAdd, roleEdi, menuTree, menuList, restRoleMenu } from '@/utils/request/api';
//获取传递函数
const emitFun = defineEmits(['resettable'])

const defaultData = {
    isDefault: true,
    name: "",
    status: 1,
}

const rules = reactive({
    name: [
        { required: true, message: '请填写角色名称', trigger: 'blur' },
    ],
})
const ruleFormRef = ref(null) //获取表单元素
//接收参数
const props = defineProps({
    editdata: {
        type: Object,
        required: true,

    }
})

const dialogVisible = ref(false)
//数据
const data = reactive({
    form: Object.assign({}, defaultData),
    dloading: false,
})
const { form, dloading } = toRefs(data)

//监听弹窗状态


const dialogtype = ref('add') //弹窗类型，默认是添加
//菜单数据
const rolemenudata = reactive({
    restrolemenubtn: true,
    allmenus: [],
    role_list: []
})

watch(dialogVisible, (n, o) => {

    if (n) {
        menuTree({ isAll: true }).then((res) => {
            if (res.code == 200) {
                rolemenudata.allmenus = res.data;
            }
        });
        if (dialogtype.value == 'add') {
            form.value = Object.assign({}, defaultData)

        } else {
            menuList({ roleId: props.editdata.id, size: -1 }).then((res) => {
                if (res.code == 200) {
                    let arr = res.data.records;
                    arr.forEach((item) => {
                        item.id += ''
                        rolemenudata.role_list.push(item.id);
                    });
                    // this.$refs.menuTree.setCheckedKeys(this.roleMenus);
                }
            })
            form.value = Object.assign({}, props.editdata);
            form.value.pid == 0 ? '' : form.value.pid += '';//解决回显问题
        }
    } else {
        form.value = Object.assign({}, defaultData)
        rolemenudata.role_list = []
    }
})
const formLabelWidth = '80px'


//添加角色
function addone() {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            roleAdd(form.value).then(res => {
                console.log(res);
                if (res.code == 200) {
                    ElMessage({
                        type: 'success',
                        message: '添加成功！',
                    })
                    emitFun('resettable')
                    dialogVisible.value = false
                } else {
                    ElMessage({
                        type: 'warning',
                        message: '添加失败！',
                    })
                }
                dloading.value = false

            })

        } else {
            dloading.value = false
            ElMessage({
                type: 'warning',
                message: '必填数据不能为空！',
            })
        }
    })

}

//修改角色
function editeone(ctx) {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            let delNames = ctx.name
            ElMessageBox.confirm(`确定修改角色'${delNames}'吗?`, '删除提示',
                {
                    confirmButtonText: '修改',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(() => {
                    if (rolemenudata.restrolemenubtn) {
                        if (rolemenudata.role_list.length) {
                            let obj = {};
                            obj.menuIds = rolemenudata.role_list;
                            obj.roleId = ctx.id;
                            Promise.all([restRoleMenu(obj), roleEdi(ctx)]).then(async val => {
                                if (val[0].code == 200) {
                                    await ElMessage({
                                        type: 'success',
                                        message: '角色菜单重置成功！',
                                    })
                                    emitFun('resettable')
                                    dialogVisible.value = false
                                } else {
                                    await ElMessage({
                                        type: 'warning',
                                        message: '角色菜单重置失败！',
                                    })
                                }
                                if (val[1].code == 200) {
                                    await ElMessage({
                                        type: 'success',
                                        message: '角色信息修改成功！',
                                    })
                                    emitFun('resettable')
                                    dialogVisible.value = false
                                } else {
                                    await ElMessage({
                                        type: 'warning',
                                        message: '角色信息修改失败！',
                                    })
                                }
                                dloading.value = false
                            })

                        } else {
                            ElMessage({
                                type: 'warning',
                                message: '菜单数据不能为空！',
                            })
                            dloading.value = false
                            return
                        }
                    } else {
                        roleEdi(ctx).then(res => {
                            if (res.code == 200) {
                                ElMessage({
                                    type: 'success',
                                    message: '角色信息修改成功！',
                                })
                                emitFun('resettable')
                                dialogVisible.value = false
                            } else {
                                ElMessage({
                                    type: 'warning',
                                    message: '角色信息修改失败！',
                                })
                            }
                            dloading.value = false
                        })
                    }

                })
                .catch(() => {
                    dloading.value = false
                })
        } else {
            dloading.value = false
            ElMessage({
                type: 'warning',
                message: '必填数据不能为空！',
            })
        }
    })


}

const cancel = () => {
    dialogVisible.value = false
}
const sure = () => {
    switch (dialogtype.value) {
        case 'add':
            addone()
            break;
        case 'edit':
            editeone(form.value)
            break;
        default:
            break;
    }
}


// 导出子组件属性defineExpose：组件暴露自己的属性
defineExpose({
    dialogVisible, dialogtype
})
</script>
<style scoped>
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.iconselect {
    width: 90%;
}
</style>
