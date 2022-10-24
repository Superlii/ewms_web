/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-05-17 15:57:20
 *@Description: 
*/
<template>
    <!-- Form -->
    <div>
        <el-dialog :modal="false" width="700px" v-model="dialogVisible" :title="dialogtype == 'add' ? '添加部门' : '修改部门'">
            <el-form v-loading="dloading" element-loading-background="transparent" :model="form" :rules="rules"
                ref="ruleFormRef">
                <el-row :gutter="20">
                    <el-col :lg="12" :md="24">
                        <el-form-item label="上级部门:" :label-width="formLabelWidth">
                            <el-tree-select clearable size="small" :props="{
                                children: 'children',
                                label: 'name',
                                value: 'id'
                            }" v-model="form.pid" :data="allDepts" check-strictly :default-expand-all="true"  />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="name" label="部门名称:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.name" placeholder="Please select a zone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="level" label="部门等级:" :label-width="formLabelWidth">
                            <el-select size="small" v-model="form.level" placeholder="请选择">
                                <el-option v-for="(item, index) in dictDataforlevel" :key="index" :label="item.state"
                                    :value="item.param">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.level == 3 || form.level == 4" :lg="12" :md="24">
                        <el-form-item label="数据范围:" :label-width="formLabelWidth">
                            <el-tree-select multiple size="small" :props="{
                                children: 'children',
                                label: 'name',
                                value: 'id',
                                disabled: 'disabled'
                            }" v-model="form.dataScopeList" :data="allDepts" check-strictly />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="是否启用:" :label-width="formLabelWidth">
                            <el-switch size="small" v-model="form.status" inline-prompt active-text="是" :active-value="1"
                                inactive-text="否" :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="linkMan" label="联系人:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.linkMan" placeholder="Please select a zone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="linkPhone" label="联系电话:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.linkPhone" placeholder="Please select a zone">
                            </el-input>
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
import { dictList, deptAdd, deptEdi, deptTree } from '@/utils/request/api';
const allDepts = ref([]) //获取部门树
const dictDataforlevel = ref([]) //获取等级字典
//获取传递函数
const emitFun = defineEmits(['resettable'])

const defaultData = {
    dataScopeList: [],
    isDefault: true,
    level: '1',
    linkMan: "",
    linkPhone: "",
    name: "-新增部门-",
    pid: 0,
    status: 1,
}

const rules = reactive({
    name: [
        { required: true, message: '请输入部门名', trigger: 'blur' },
    ],
    linkMan: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    linkPhone: [
        { required: true, message: '请输入联系方式', trigger: 'blur' },
    ],
    path: [
        { required: true, message: '请填写部门路由', trigger: 'blur' },
    ],
    link: [
        { required: true, message: '请填写部门组件地址', trigger: 'blur' },
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

//获取部门类型-字典
dictList({
    belong: 'department',
    keyword: 'level',
    size: -1
}).then(res => {
    dictDataforlevel.value = res.data.records
})


//监听弹窗状态

const dialogtype = ref('add') //弹窗类型，默认是添加
watch(dialogVisible, (n, o) => {
    if (n) {
        deptTree({ isAll: true }).then((res) => {
            if (res.code == 200) {
                let obj = {
                    id: 0,
                    isDefault: false,
                    level: 1,
                    linkMan: "",
                    linkPhone: "",
                    name: "无",
                    pid: "0",
                    status: 1,
                    weight: 0,
                    disabled: true,
                }//无上级部门选项
                allDepts.value = res.data;
                allDepts.value.unshift(obj)
            }
        })
        if (dialogtype.value == 'add') {
            form.value = Object.assign({}, defaultData)
        } else {
            form.value = Object.assign({}, props.editdata);
            form.value.pid == 0 ? '' : form.value.pid += '';//解决回显问题
            form.value.level += '';
        }
    } else {
        form.value = Object.assign({}, defaultData)
    }
})
const formLabelWidth = '80px'


//添加部门
function addone() {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            deptAdd(form.value).then(res => {
                console.log(res);
                if (res.code == 200) {
                    ElMessage({
                        type: 'success',
                        message: '添加成功！',
                    })
                    emitFun('resettable')
                    dialogVisible.value = false
                    dloading.value = false
                }


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

//修改部门
function editeone(ctx) {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            let delNames = ctx.name
            ElMessageBox.confirm(`确定修改部门'${delNames}'吗?`, '删除提示',
                {
                    confirmButtonText: '修改',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(() => {
                    deptEdi(ctx).then(res => {
                        if (res.code == 200) {
                            ElMessage({
                                type: 'success',
                                message: '修改成功！',
                            })
                            emitFun('resettable')
                            dialogVisible.value = false
                        }
                        dloading.value = false


                    })
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
