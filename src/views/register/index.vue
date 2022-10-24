/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-07-04 15:13:17
 *@Description: 注册页
*/

<template>
    <div class="login">
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <h2 class="title">新用户注册</h2>
            <el-form-item prop="userName">
                <el-input v-model="loginForm.userName" type="text" size="large" auto-complete="off" placeholder="用户名"
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <svg-icon size="1.5rem" name="user" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="loginName">
                <el-input v-model="loginForm.loginName" type="text" size="large" auto-complete="off" placeholder="登录账号"
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <svg-icon size="1.5rem" name="user" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off"
                    placeholder="登录密码" @keyup.enter="handleLogin">
                    <template #prefix>
                        <svg-icon size="1.5rem" name="pwd" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="checkpassword">
                <el-input v-model="loginForm.checkpassword" type="password" size="large" auto-complete="off"
                    placeholder="密码确认" @keyup.enter="handleLogin">
                    <template #prefix>
                        <svg-icon size="1.5rem" name="pwd" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
                <el-row justify="space-between">
                    <el-col :span="14">
                        <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码"
                            @keyup.enter="handleLogin">
                            <template #prefix>
                                <svg-icon size="2rem" style="margin-top: .1rem;" name="vc" />
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="9">
                        <div class="login-code">
                            <img :src="codeUrl" @click="getCode" class="login-code-img" />
                        </div>
                    </el-col>
                </el-row>


            </el-form-item>
            <el-form-item style="width:100%;">
                <el-button class="btn" :loading="loading" size="large" type="info" style="width:100%;"
                    @click.prevent="handleLogin">
                    <span v-if="!loading">注册</span>
                    <span v-else>注 册 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
            <router-link style="position:absolute;right: 10px;bottom: 10px;color: #2a6aa2;" to="/login">
                &nbsp;去登录
            </router-link>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>
                @Author: 菠萝吹雪（zcf）
                @Date: 2022-05-07 21:04:27
                @Description:vue3.2+pinia(新一代状态管理工具)+elementPlus
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginVc, userRegiste } from "@/utils/request/api";
import md5 from "js-md5";
const router = useRouter();
const loginForm = ref({
    email: "",
    loginName: "",
    password: "",
    checkpassword: "",
    phone: "",
    userName: ""
});
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('再次输入新密码'))
    } else if (value !== loginForm.value.password) {
        callback(new Error("两次密码输入不一致！"))
    } else {
        callback()
    }
}
const loginRules = {
    userName: [{ required: true, trigger: "blur", message: "请输入您的用户名" }],
    loginName: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
    password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
    checkpassword: [{ validator: validatePass2, trigger: 'blur' }],
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(false);
// 注册开关
const register = ref(false);
const loginRef = ref(null)
function handleLogin() {

    loginRef.value.validate(valid => {
        if (valid) {
            loading.value = true;
            // 调用action的登录方法
            loginForm.value.password = md5(loginForm.value.password)
            userRegiste(loginForm.value).then((res) => {

                if (!res) {
                    loading.value = false;
                    // 重新获取验证码
                    if (captchaOnOff.value) {
                        getCode();

                    }
                    return
                }


                router.push("/login");


            })
        }
    });
}

function getCode() {
    loginVc().then(res => {
        codeUrl.value = "data:image/png;base64," + res.data.img;
        loginForm.value.serial = res.data.serial;

    });
}
captchaOnOff.value && getCode();
</script>

<style lang='less' scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: url('../../assets/imgs/lbg.webp');
    background-size: cover;
}

.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #ffff;
    font-size: 20px;


}

.login-form {
    border-radius: 10px;
    background: rgba(59, 63, 71, .4);
    width: 350px;
    box-shadow: -1px -1px 1px rgba(255, 255, 255, .2), 1px 1px 1px rgba(0, 0, 0, .2);
    height: 40rem;
    padding: 25px 25px 5px 25px;
    display: flex;
    flex-direction: column;
    position: relative;

    .el-input {
        height: 40px;

        input {
            height: 40px;
        }
    }

    .btn {
        background: rgba(46, 60, 79, 0.2);
        border-radius: 20px;
        box-shadow: 0 1px 0px rgba(255, 255, 255, .2);
    }




}

.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}

.login-code {

    height: 40px;
    float: right;

    img {
        cursor: pointer;
        vertical-align: middle;
        width: 115px;
        padding-right: 4px;
    }
}

.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}

.login-code-img {
    height: 40px;
    padding-left: 12px;
}
</style>