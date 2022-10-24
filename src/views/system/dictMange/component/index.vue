/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-05-17 15:57:20
 *@Description: 
*/
<template>
    <!-- Form -->
    <div>
        <el-dialog :modal="false" width="700px" v-model="dialogVisible" :title="dialogtype == 'add' ? '添加字典' : '修改字典'">
            <el-form v-loading="dloading" element-loading-background="transparent" :model="form" :rules="rules"
                ref="ruleFormRef">
                <el-row :gutter="20">
                    <el-col :lg="12" :md="24">
                        <el-form-item label="归属" prop="belong" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.belong"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="归属说明" prop="statement" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.statement"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="关键字" prop="keyword" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.keyword"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="参数" prop="param" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.param"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="说明" prop="state" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.state"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="状态:" :label-width="formLabelWidth">
                            <el-switch size="small" v-model="form.status" inline-prompt active-text="启用"
                                :active-value="1" inactive-text="禁用" :inactive-value="0" />
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
import { dictAdd, dictEdi } from '@/utils/request/api';

//获取传递函数
const emitFun = defineEmits(['resettable'])

const defaultData = {
    belong: "",
    keyword: "",
    param: "",
    sort: 0,
    state: "",
    statement: "",
    status: 1,
}

const rules = reactive({
    keyword: [{ required: true, message: "必填", trigger: "blur" }],
    param: [{ required: true, message: "必填", trigger: "blur" }],
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
watch(dialogVisible, (n, o) => {
    if (n) {
        if (dialogtype.value == 'add') {
            form.value = Object.assign({}, defaultData)
        } else {
            form.value = Object.assign({}, props.editdata);
            form.value.pid == 0 ? '' : form.value.pid += '';//解决回显问题
        }
    } else {
        form.value = Object.assign({}, defaultData)
    }
})
const formLabelWidth = '80px'


//添加字典
function addone() {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            dictAdd(form.value).then(res => {
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

//修改字典
function editeone(ctx) {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            let delNames = ctx.name
            ElMessageBox.confirm(`确定修改字典'${delNames}'吗?`, '删除提示',
                {
                    confirmButtonText: '修改',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(() => {
                    dictEdi(ctx).then(res => {
                        if (res.code == 200) {
                            ElMessage({
                                type: 'success',
                                message: '修改成功！',
                            })
                            emitFun('resettable')
                            dialogVisible.value = false
                        } else {
                            ElMessage({
                                type: 'warning',
                                message: '修改失败！',
                            })
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
