<template>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="ruleForm.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script  setup name="restPassword">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { updateUserPassword } from '@/utils/request/api'
import { permison } from "@/store/permison";
import md5 from 'js-md5'
const permisonData = permison()
const ruleFormRef = ref()
const validatePassold = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('输入原密码'))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}
const validatePassnew = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('输入新密码'))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('再次输入新密码'))
    } else if (value !== ruleForm.newPassword) {
        callback(new Error("两次密码输入不一致！"))
    } else {
        callback()
    }
}

const ruleForm = reactive({
    newPassword: '',
    oldPassword: '',
    checkPass: '',
})

const rules = reactive({
    newPassword: [{ validator: validatePassnew, trigger: 'blur' }],
    oldPassword: [{ validator: validatePassold, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
})

const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            let obj = Object.assign({}, ruleForm);

            obj.oldPassword = md5(obj.oldPassword);
            obj.newPassword = md5(obj.newPassword);
            updateUserPassword(obj).then(res => {
                if (res.code == 200) {
                    ElMessage({
                        type: 'success',
                        message: '密码修改成功！',
                    })
                    permisonData.loginOut()
                }
                else {
                    ElMessage({
                        type: 'warning',
                        message: '密码修改失败',
                    })
                }
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}

const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>
