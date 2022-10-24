/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-05-17 15:57:20
 *@Description: 
*/
<template>
    <!-- Form -->
    <div>
        <a-modal :modal="false" width="700px" v-model:visible="dialogVisible"
            :title="dialogtype == 'add' ? '添加菜单' : '修改菜单'">
            <a-form :model="form" :rules="rules" ref="ruleFormRef">
                <a-row :gutter="20">
                    <a-col :span="12">
                        <a-form-item label="菜单类型:">
                            <a-radio-group size="small" v-model:value="form.type" option-type="button"
                                :options="menutype" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <!-- :value-consists-of="'ALL_WITH_INDETERMINATE'"  -->
                        <a-form-item name="pid" label="上级菜单:">
                            <treeselect :key="tkey" placeholder="请选择上级菜单" v-model="form.pid" :multiple="false"
                                :options="allmenus" :noOptionsText="'空'" :noResultsText="'空'" :noChildrenText="'空'"
                                :normalizer="normalizer" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="name" label="菜单名称:">
                            <a-input size="small" v-model:value="form.name" placeholder="Please select a zone">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="authStr" label="权限字符:">
                            <a-input size="small" v-model:value="form.authStr" placeholder="Please select a zone">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="icon" label="菜单图标:">
                            <a-select size="small" placeholder="请选择图标" v-model:value="form.icon">
                                <a-select-option v-for="(val, key, index) in allsvg" :key="index"
                                    :label="getSvgName(key)" :value="getSvgName(key)">
                                    <span style="float: left">{{ getSvgName(key) }}</span>
                                    <span style="float: right;color: var(--el-text-color-secondary);font-size: 12px;">
                                        <svg-icon size="2rem" :name="getSvgName(key)"></svg-icon>
                                    </span>
                                </a-select-option>
                            </a-select>

                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="path" label="路由地址:">
                            <a-input size="small" v-model:value="form.path" placeholder="Please select a zone">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col v-if="form.type != 1" :span="12">
                        <a-form-item name="link" label="组件地址:">
                            <a-input size="small" v-model:value="form.link" placeholder="Please select a zone">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-row>
                            <a-col :span="12">
                                <a-form-item label="是否隐藏:">
                                    <el-radio-group v-model="form.isHide">
                                        <el-radio style="margin-right: 5px;" :label="true">是</el-radio>
                                        <el-radio style="margin: 0;" :label="false">否</el-radio>

                                    </el-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <el-form-item label="排序:">
                                    <el-input-number size="small" v-model="form.sort" :min="0" />
                                </el-form-item>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :span="12">
                        <el-form-item label="是否启用:">
                            <el-switch size="small" v-model="form.status" inline-prompt active-text="是"
                                :active-value="1" inactive-text="否" :inactive-value="0" />
                        </el-form-item>
                    </a-col>

                </a-row>
            </a-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="sure">确定</el-button>
                </span>
            </template>
        </a-modal>
    </div>

</template>

<script  setup name="mydialog">
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { permison } from '@/store/permison'
import { reactive, ref, toRefs, watch, createVNode } from 'vue'
import { dictList, menuAdd, menuEdi } from '@/utils/request/api';
// import the component
import Treeselect from 'vue3-treeselect'
// import the styles
import 'vue3-treeselect/dist/vue3-treeselect.css'
const normalizer = (node) => {
    return {
        id: node.id,
        label: node.name || "顶级菜单",
        children: node.children,
    };
}
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
    pid: [
        { required: true, message: '请选择上级菜单', trigger: 'blur' },
    ],
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
    menutype.value = res.data.records.map(i => {
        i.label = i.state
        i.value = Number(i.param)
        return i
    })
    console.log(menutype.value);
})


//监听弹窗状态


const dialogtype = ref('add') //弹窗类型，默认是添加
let tkey = ref(0)
watch(dialogVisible, (n, o) => {
    if (n) {
        tkey.value += 1
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
const addone =
    async () => {
        try {

            const validvalues = await ruleFormRef.value.validateFields();
            console.log('Success:', validvalues);
            if (validvalues) {
                dloading.value = true
                menuAdd(form.value).then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        message.success('添加成功！');
                        emitFun('resettable')
                        dialogVisible.value = false
                    } else {

                        message.error('添加失败！');
                        emitFun('resettable')
                    }
                    dloading.value = false


                })
            } else {
                dloading.value = false
                message.warning('必填数据不能为空！');
            }

        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };




//修改菜单(全部展开解决回显问题)
const editeone = async (ctx) => {
    try {

        const validvalues = await ruleFormRef.value.validateFields();
        console.log('Success:', validvalues);
        if (validvalues) {
            dloading.value = true
            let delNames = ctx.name
            Modal.confirm({
                title: '修改提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: `确定修改菜单'${delNames}'吗?`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    menuEdi(ctx).then(res => {
                        if (res.code == 200) {
                            message.success('修改成功！');
                            emitFun('resettable')
                            dialogVisible.value = false
                        } else {

                            message.error('修改失败！');
                        }
                        dloading.value = false

                    })
                },
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onCancel() { },
            });
        } else {
            dloading.value = false
            message.warning('必填数据不能为空！');
        }

    } catch (errorInfo) {
        console.log('Failed:', errorInfo);
    }
}

const cancel = () => {
    dialogVisible.value = false
}
const sure = () => {
    console.log(12);
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
