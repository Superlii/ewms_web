<template>
    <div class="login">
        <a-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <h2 class="title">1*******1</h2>
            <a-form-item name="username">
                <a-input v-model:value="loginForm.username" type="text" size="large" auto-complete="off"
                    placeholder="账号" @pressEnter="handleLogin">
                    <template #prefix>
                        <svg-icon size="1.5rem" name="user" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item name="password">
                <a-input v-model:value="loginForm.password" type="password" size="large" auto-complete="off"
                    placeholder="密码" @pressEnter="handleLogin">
                    <template #prefix>
                        <svg-icon size="1.5rem" name="pwd" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item name="code" v-if="captchaOnOff">
                <a-row justify="space-between">
                    <a-col :span="14">
                        <a-input v-model:value="loginForm.code" size="large" auto-complete="off" placeholder="验证码"
                            @pressEnter="handleLogin">
                            <template #prefix>
                                <svg-icon size="2rem" style="margin-top: .1rem;" name="vc" />
                            </template>
                        </a-input>
                    </a-col>
                    <a-col :span="9">
                        <div class="login-code">
                            <img :src="codeUrl" @click="getCode" class="login-code-img" />
                        </div>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-checkbox v-model:checked="loginForm.rememberMe"
                style="margin:0px 0px 25px 0px;color: #ccc;align-self: start;">
                记住密码
            </a-checkbox>
            <a-form-item style="width:100%;">
                <a-button v-oneOpt="1000" class="btn" :loading="loading" size="large" type="info" style="width:100%;"
                    @click.prevent="handleLogin">
                    <span style="color:#ffff;" v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </a-button>
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </a-form-item>
            <!-- <router-link style="position:absolute;right: 10px;bottom: 10px;color: #2a6aa2;" to="/register">
                <svg-icon style="color: #2a6aa2;" name="用户注册" size="1.2rem"></svg-icon>&nbsp;注册用户
            </router-link> -->
        </a-form>
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
import { permison } from "@/store/permison";
import { useRouter } from "vue-router";
import { loginVc } from "@/utils/request/api";
import Cookies from "js-cookie";
import md5 from "js-md5";
import { encrypt, decrypt } from "@/utils/jsencrypt";
const router = useRouter();
const permisonData = permison()
const loginForm = ref({
    username: "",
    password: "",
    rememberMe: false,
    code: "",
    serial: ""
});

const loginRules = {
    username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
    password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
    code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
const register = ref(false);
const loginRef = ref(null)
const handleLogin = async () => {
    console.log(111);

    const validvalues = await loginRef.value.validateFields();

    if (validvalues) {
        loading.value = true;

        // 勾选了需要记住密码设置在cookie中设置记住用户明和名命
        if (loginForm.value.rememberMe) {
            Cookies.set("username", loginForm.value.username, { expires: 30 });
            Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });
            Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
        } else {
            // 否则移除
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");

        }

        // 调用action的登录方法
        let obj = Object.assign({}, loginForm.value)
        obj.password = md5(loginForm.value.password)
        permisonData.login(obj).then((res) => {
            if (!res) {
                loading.value = false;
                // 重新获取验证码
                if (captchaOnOff.value) {
                    getCode();

                }
                getCookie();
                return
            }


            router.push("/");


        })
    }

}

function getCode() {
    loginVc().then(res => {
        codeUrl.value = "data:image/png;base64," + res.data.img;
        loginForm.value.serial = res.data.serial;

    });
}

function getCookie() {
    const username = Cookies.get("username");
    const password = Cookies.get("password");
    const rememberMe = Cookies.get("rememberMe");
    loginForm.value = {
        username: username === undefined ? loginForm.value.username : username,
        password: password === undefined ? loginForm.value.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
    };
}
captchaOnOff.value && getCode();
getCookie();
</script>

<style lang='less' scoped>
:deep(.ant-form-item-explain-error) {
    color: #ff4d4f;
    display: flex;
}

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