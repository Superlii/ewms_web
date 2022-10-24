/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-05-17 15:57:20
 *@Description: 
*/
<template>
    <!-- Form -->
    <div>
        <a-modal :modal="false" width="700px" v-model:visible="dialogVisible"
            :title="dialogtype == 'add' ? '添加用户' : '修改用户'">
            <a-form :model="form" :rules="rules" ref="ruleFormRef">
                <a-row :gutter="20">
                    <a-col>
                        <a-form-item :label-width="formLabelWidth" label="用户名:" name="userName">
                            <a-input size="small" v-model:value="form.userName" placeholder="请输入"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col>
                        <a-form-item :label-width="formLabelWidth" label="登录账号:" name="loginName">
                            <a-input size="small" :disabled="dialogtype != 'add'" v-model:value="form.loginName"
                                placeholder="请输入">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col v-if="dialogtype == 'add'">
                        <a-form-item :label-width="formLabelWidth" label="登录密码:" name="password">
                            <a-input size="small" v-model:value="form.password" placeholder="请输入"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col>
                        <a-form-item :label-width="formLabelWidth" label="手机号:" name="phone">
                            <a-input size="small" v-model:value="form.phone" placeholder="请输入"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col>
                        <a-form-item :label-width="formLabelWidth" label="邮箱:" name="email">
                            <a-input type="email" size="small" v-model:value="form.email" placeholder="请输入"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col v-if="dialogtype == 'add' ? true : restDepts">
                        <a-form-item name="deptList" label="用户部门:" :label-width="formLabelWidth">
                            <!-- <el-tree-select :default-expand-all="true" multiple size="small" :props="{
                                children: 'children',
                                label: 'name',
                                value: 'id'
                            }" v-model="form.deptList" :data="allDepts" check-strictly /> -->

                            <treeselect :key="tkey" placeholder="请选择部门" v-model="form.deptList"
                                :value-consists-of="'ALL_WITH_INDETERMINATE'" :multiple="true" :options="allDepts"
                                :noOptionsText="'空'" :noResultsText="'空'" :noChildrenText="'空'"
                                :normalizer="normalizer">
                                <!-- <div slot="value-label" slot-scope="{ node }">{{ node.raw.name ? node.raw.name : '' }}
                                </div> -->

                            </treeselect>
                        </a-form-item>
                    </a-col>
                    <a-col v-if="dialogtype == 'add' ? true : restRoles">
                        <a-form-item name="roleList" label="用户角色:" :label-width="formLabelWidth">
                            <!-- <el-tree-select multiple size="small" :props="{
                                children: 'children',
                                label: 'name',
                                value: 'id'
                            }" v-model="form.roleList" :data="allRoles" check-strictly /> -->

                            <treeselect placeholder="请选择角色" v-model="form.roleList" :multiple="true" :options="allRoles"
                                :noOptionsText="'空'" :noResultsText="'空'" :noChildrenText="'空'"
                                :normalizer="normalizer" />
                        </a-form-item>
                    </a-col>
                    <a-col>
                        <a-form-item label="是否启用:" :label-width="formLabelWidth">
                            <a-switch v-model:checked="form.status" checked-children="是" :checkedValue="1"
                                un-checked-children="否" :unCheckedValue="0" />
                        </a-form-item>
                    </a-col>
                    <a-col v-if="dialogtype != 'add'">
                        <a-form-item label="重置角色:" :label-width="formLabelWidth">
                            <a-switch v-model:checked="restRoles" checked-children="是" :checkedValue="true"
                                un-checked-children="否" :unCheckedValue="false" />
                        </a-form-item>
                    </a-col>
                    <a-col v-if="dialogtype != 'add'">
                        <a-form-item label="重置部门:" :label-width="formLabelWidth">
                            <a-switch v-model:checked="restDepts" checked-children="是" :checkedValue="true"
                                un-checked-children="否" :unCheckedValue="false" />
                        </a-form-item>
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
import { permison } from "@/store/permison";
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { reactive, ref, toRefs, watch, createVNode } from 'vue'
import { userAdd, userEdi, deptTree, roleList, restUserRole, restUserDept, userDetail } from '@/utils/request/api';
import md5 from "js-md5";
// import the component
import Treeselect from 'vue3-treeselect'
// import the styles
import 'vue3-treeselect/dist/vue3-treeselect.css'
const normalizer = (node) => {
    if (node.children && !node.children.length) {
        delete node.children
    }
    return {
        id: node.id,
        label: node.name || "无",
        children: node.children,
    };
}
const permisonData = permison()
//获取传递函数
const emitFun = defineEmits(['resettable'])

const defaultData = {
    deptList: [],
    email: "",
    loginName: "",
    password: "",
    phone: "",
    photo: "",
    roleList: [],
    status: 1,
    userName: ""
}

const rules = reactive({
    userName: [
        { required: true, message: '请设置用户名', trigger: 'blur' },
    ],
    loginName: [
        { required: true, message: '请设置登录账号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请设置登录密码', trigger: 'blur' },
    ],
    deptList: [
        { required: true, message: '不能为空', trigger: 'blur' },
    ],
    roleList: [
        { required: true, message: '不能为空', trigger: 'blur' },
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
    restRoles: true,
    restDepts: true
})

const { form, restRoles, restDepts, dloading } = toRefs(data)

//监听弹窗状态


const dialogtype = ref('add') //弹窗类型，默认是添加
const allDepts = ref([])//部门数据
const allRoles = ref([])//角色数据
let tkey = ref(0)
deptTree({ isAll: true, status: 1 }).then((res) => {
    //获取部门数据
    if (res.code == 200) {
        allDepts.value = res.data;
    }
});
roleList({ status: 1, size: -1 }).then((res) => {
    //获取角色数据
    if (res.code == 200) {
        allRoles.value = res.data.records;
    }
});
watch(dialogVisible, (n, o) => {
    if (n) {
        tkey.value += 1
        //弹窗出现

        if (dialogtype.value == 'add') {
            console.log('添加');
        } else {
            let objdata = Object.assign({}, props.editdata)

            userDetail(objdata.id).then(res => {

                objdata.roleList = []
                objdata.deptList = []

                res.data.roleList.forEach(item => {

                    objdata.roleList.push(item.id)
                })
                res.data.deptList.forEach(item => {

                    objdata.deptList.push(item.id)
                })
                console.log(objdata, '1111');
                form.value = Object.assign({}, objdata)

            })
        }
    } else {
        form.value = Object.assign({}, defaultData)
        restRoles.value = true
        restDepts.value = true

    }
})
const formLabelWidth = '80px'


//添加用户
const addone = async () => {
    try {

        const validvalues = await ruleFormRef.value.validateFields();
        console.log('Success:', validvalues);
        if (validvalues) {
            dloading.value = true
            let obj = Object.assign({}, form.value)
            obj.password = md5(obj.password)
            userAdd(obj).then(res => {
                if (res.code == 200) {
                    message.success('添加成功！');
                    emitFun('resettable')
                    dialogVisible.value = false
                } else {
                    message.error('添加失败！');
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


//修改用户
const editeone = async (ctx) => {
    try {

        const validvalues = await ruleFormRef.value.validateFields();
        console.log('Success:', validvalues);
        if (validvalues) {
            dloading.value = true
            let delNames = ctx.userName
            Modal.confirm({
                title: '修改提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: `确定修用户'${delNames}'吗?`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    let obj = Object.assign({}, ctx)
                    userEdi(obj).then(res => {
                        if (res.code == 200) {
                            message.success('修改成功！');
                            emitFun('resettable')
                            dialogVisible.value = false
                        } else {
                            message.error('修改失败！');
                        }
                        dloading.value = false


                    })
                    if (restRoles.value) {
                        restUserRole({
                            roleIds: ctx.roleList,
                            userId: ctx.id
                        }).then(res => {
                            if (res.code == 200) {
                                message.success('用户角色重置成功！');
                                emitFun('resettable')
                            } else {
                                message.error('用户角色重置失败！');
                            }
                        })
                    }
                    if (restDepts.value) {
                        restUserDept({
                            deptIds: ctx.deptList,
                            userId: ctx.id
                        }).then(res => {
                            if (res.code == 200) {
                                message.success('用户部门重置成功！');

                                emitFun('resettable')
                            } else {
                                message.error('用户部门重置失败！');

                            }
                        })
                    }
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
