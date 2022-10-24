<!-- /*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-04-29 14:09:57
 *@Description: 头部组件
*/ -->
<template>
    <div class="wrap">
        <div class="left">
            <i @click.prevent="icoclick" class="btn">
                <svg-icon :name="iconNmame" class="btnico" />
            </i>
            <breadcrumb />
        </div>
        <div class="right">
            <!-- 头像 -->
            <a-avatar class="rotae_l20" shape="circle" :size="25" :src="userImg" />
            <h5 style="margin-left: 5px;">{{ permisonData.userinfo.userName }}</h5>
            <!-- 菜单栏 -->
            <a-dropdown class="drops">
                <span class="el-dropdown-link">

                    <DownOutlined style="cursor: pointer;font-size: 12px;margin-left: 5px;margin-top: -5px;" />

                </span>
                <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <router-link
                                @click="navbarData.menuItemClick({ path: '/ain-info', name: '修改个人信息', meta: { title: '修改个人信息' } })"
                                v-hasBtn="'update-ain-info'" to="/ain-info">
                                <svg-icon style="margin-right: 5px;" name="user" size="1.2rem"></svg-icon>修改个人信息
                            </router-link>
                        </a-menu-item>
                        <a-menu-item>
                            <svg-icon style="margin-right: 5px;margin-top: 2px;" name="exit" size="1.2rem"></svg-icon>

                            <router-link @click="loginOut" to="/login">
                                退出
                            </router-link>

                        </a-menu-item>

                    </a-menu>
                </template>
            </a-dropdown>

        </div>
    </div>
</template>

<script setup >

import { useRoute, useRouter } from 'vue-router'
import { DownOutlined } from '@ant-design/icons-vue';
import breadcrumb from './breadcrumb.vue'
import { hamburg } from "@/store/hamburg";
import { permison } from "@/store/permison";
import { storeToRefs } from 'pinia' //用于结构仓库数据，且依然是响应式的
import { computed, watch, ref } from 'vue';
import { navbar } from '@/store/navBar'
const navbarData = navbar()
const hamburgData = hamburg()
const permisonData = permison()
const { iconNmame } = storeToRefs(hamburgData)
const route = useRoute()
const router = useRouter()

const icoclick = () => {
    hamburgData.changeToggle(route.path)
}

//根据头像文件流生成链接

//刷新、跳转等操作重新生成头像链接，防止失效问题

const userImg = computed(() => {
    if (permisonData.userinfo.photo == '') {
        //默认头像
        return 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    } else {

        return permisonData.userinfo.photo
    }

})



//退出

const loginOut = () => {
    permisonData.loginOut()
}
</script>
<style lang='less' scoped>
.wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;


    .left,
    .right {
        height: 100%;
    }

    .left {

        display: flex;
        justify-content: start;
        align-items: center;

        .btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #eeeeee;
            width: 2.8rem;
            height: 2rem;
            border-radius: .5rem;
            background: linear-gradient(135deg,
                    rgba(230, 230, 230, 1) 0%,
                    rgba(246, 246, 246, 1) 100%);
            box-shadow: -0 -0 10px -0 rgba(255, 255, 255, 1),
                4px 4px 10px -5px rgb(0, 0, 0, 0.3);

            .svg-icon {
                height: 100%;
                width: 100%;
                margin-top: .5rem;


                &:hover {
                    color: blue;
                    transform: rotateY(180deg);
                    transition: all .2s;
                }
            }
        }
    }

    .right {

        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: .5rem;

        .drops {
            margin-top: 5px;
        }
    }
}
</style>