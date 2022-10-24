/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-05-17 15:57:20
 *@Description: 
*/
<template>
    <!-- Form -->
    <div>
        <el-dialog :modal="false" width="700px" v-model="dialogVisible" :title="dialogtype == 'add' ? '添加菜单' : '修改菜单'">
            <el-form v-loading="dloading" element-loading-background="transparent" :model="form" :rules="rules"
                ref="ruleFormRef">
                <el-row :gutter="20">
                    <el-col :lg="12" :md="24">
                        <el-form-item label="菜单类型:" :label-width="formLabelWidth">
                            <el-radio-group v-model.number="form.type" size="small">
                                <el-radio-button v-for="item in menutype" :key="item.id" :label="item.param">{{
                                        item.state
                                }}
                                </el-radio-button>>

                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="上级菜单:" :label-width="formLabelWidth">
                            <el-tree-select size="small" :props="{
                                children: 'children',
                                label: 'name',
                                value: 'id'
                            }" v-model="form.pid" :data="allmenus" check-strictly />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="name" label="菜单名称:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.name" placeholder="Please select a zone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="authStr" label="权限字符:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.authStr" placeholder="Please select a zone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="icon" label="菜单图标:" :label-width="formLabelWidth">
                            <el-select :class="[form.icon == '' ? '' : 'iconselect']" size="small" v-model="form.icon"
                                placeholder="Please select a zone">
                                <el-option v-for="(val, key, index) in allsvg" :key="index" :label="getSvgName(key)"
                                    :value="getSvgName(key)">
                                    <span style="float: left">{{ getSvgName(key) }}</span>
                                    <span style="float: right;color: var(--el-text-color-secondary);font-size: 12px;">
                                        <svg-icon size="2rem" :name="getSvgName(key)"></svg-icon>
                                    </span>
                                </el-option>

                            </el-select>
                            <svg-icon v-if="!!form.icon" style="margin-left: 3px;" size="1.5rem" :name="form.icon">
                            </svg-icon>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item prop="path" label="路由地址:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.path" placeholder="Please select a zone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.type != 1" :lg="12" :md="24">
                        <el-form-item prop="link" label="组件地址:" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.link" placeholder="Please select a zone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="是否隐藏:" :label-width="formLabelWidth">
                                    <el-radio-group v-model="form.isHide">
                                        <el-radio style="margin-right: 5px;" :label="true">是</el-radio>
                                        <el-radio style="margin: 0;" :label="false">否</el-radio>

                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序:" :label-width="formLabelWidth">
                                    <el-input-number size="small" v-model="form.sort" :min="0" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :lg="12" :md="24">
                        <el-form-item label="是否启用:" :label-width="formLabelWidth">
                            <el-switch v-model="form.status" inline-prompt active-text="是" :active-value="1"
                                inactive-text="否" :inactive-value="0" />
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
import { permison } from '@/store/permison'
import { reactive, ref, toRefs, watch } from 'vue'
import { dictList, menuAdd, menuEdi } from '@/utils/request/api';
const permisonData = permison()
const allmenus = permisonData.menus //获取已存储菜单


//获取传递函数
const emitFun = defineEmits(['resettable'])

//获取所有view中的svg文件
const allsvg =
    import.meta.glob('@/icons/**/*.svg');
//处理文件名
function getSvgName(item) {
    return (item.split('/'))[(item.split('/')).length - 1].split('.')[0]
}


const defaultData = {
    authStr: "",
    icon: "luotuo",
    isHide: false,
    link: "",
    name: "-新增菜单-",
    path: "",
    pid: 0,
    sort: 0,
    status: 1,
    type: 2
}

const rules = reactive({
    name: [
        { required: true, message: '请填写菜单名称', trigger: 'blur' },
    ],
    authStr: [
        { required: true, message: '请填写菜单权限字符', trigger: 'blur' },
    ],
    icon: [
        { required: true, message: '请选择菜单图标', trigger: 'blur' },
    ],
    path: [
        { required: true, message: '请填写菜单路由', trigger: 'blur' },
    ],
    link: [
        { required: true, message: '请填写菜单组件地址', trigger: 'blur' },
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
    menutype: [],
    menus: [],

})
const { form, menutype, menus, dloading } = toRefs(data)

//获取菜单类型-字典
dictList({ belong: 'menu' }).then(res => {
    menutype.value = res.data.records
})


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


//添加菜单
function addone() {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            menuAdd(form.value).then(res => {
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

//修改菜单
function editeone(ctx) {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            dloading.value = true
            let delNames = ctx.name
            ElMessageBox.confirm(`确定修改菜单'${delNames}'吗?`, '删除提示',
                {
                    confirmButtonText: '修改',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(() => {
                    menuEdi(ctx).then(res => {
                        if (res.code == 200) {
                            ElMessage({
                                type: 'success',
                                message: '修改成功！',
                            })
                            emitFun('resettable')
                            dialogVisible.value = false
                            dloading.value = false
                        }


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
