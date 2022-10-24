import axios from "axios"
import Cookies from 'js-cookie'
import {
    ElNotification,
    ElMessageBox,
    ElMessage,
    ElLoading
} from 'element-plus'

let downloadLoadingInstance;

import {
    permison
} from '@/store/permison' //退出函数引入 pinia

import {
    useRouter
} from 'vue-router'


// 是否显示重新登录
export let isRelogin = {
    show: false
};
// import config from "../utils/config"

const instance = axios.create({
    //nginx转发
    // baseURL: import.meta.env.VITE_BASE_API,
    //public/static/baseUrl定义
    baseURL: window.baseUrl,
    timeout: 60000,
    withCredentials: false,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    }
})

instance.interceptors.request.use(request => {
    if (Cookies.get('TokenKey')) {
        request.headers.authorization = Cookies.get('TokenKey')
    }
    request.headers['Content-Type'] = "application/json"
    return request
})

// 响应拦截器
instance.interceptors.response.use(res => {

        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = res.data.message
        // 二进制数据则直接返回
        if (res.request.responseType == 'blob' || res.request.responseType == 'arraybuffer') {
            return res.data
        }
        if (code === 401) {
            if (!isRelogin.show) {
                //让弹窗只出现一次
                isRelogin.show = true;
                ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const router = useRouter()

                    isRelogin.show = false;
                    const permisonData = permison() //在js中使用注意点
                    permisonData.loginOut()
                }).catch(() => {
                    isRelogin.show = false;
                });
            }
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
            ElMessage({
                message: msg,
                type: 'error'
            })
            console.log(msg);
            return Promise.reject(fasle)
        } else if (code !== 200) {
            ElNotification.error({
                title: msg
            })
            return Promise.reject(false)
        } else {
            return res.data
        }
    },
    error => {
        console.log('err' + error)
        let {
            message
        } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })
        console.log(error);
        return Promise.reject(false)
    }
)

export default instance