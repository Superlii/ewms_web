<!-- /*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-04-30 13:58:47
 *@Description: 
*/ -->
<template>
    <template v-if="!item.isHide">

        <template v-if="item.children && item.children.length">
            <template v-if="item.name == ''">
                <Item :item="item.children[0]" />
            </template>
            <a-sub-menu v-else :key="item.path" :index="item.path">
                <template #title>
                    <svg-icon class="iconsmenu" style="margin-right: 5px;" size="1.5rem"
                        :name="item.icon ? item.icon : ''" />
                    <span class="ctx sub" :class="isActive(item) ? 'isactive' : ''">
                        {{ item.name || '**'
                        }}
                    </span>
                </template>
                <template v-for="child in item.children" :key="child.path">
                    <Item :item="child" />
                </template>
            </a-sub-menu>
        </template>
        <a-menu-item v-else :index="item.path ? item.path : ''" @click="menuClick(item)" :key="item.path">
            <svg-icon class="iconsmenu" style="margin-right: 5px;" size="1.5rem" :name="item.icon ? item.icon : ''" />

            <span class="ctx" :class="isActive(item) ? 'isactive' : ''">
                <router-link :to="item.path"> {{item.name}}</router-link>
            </span>



        </a-menu-item>

    </template>
</template>

<script setup name="Item" >

import { useRoute, useRouter } from 'vue-router';
import { navbar } from '@/store/navBar'

const navbarData = navbar()

const route = useRoute()

const isActive = (item) => {
    return item.path == route.path
}


//接收路由
defineProps({
    item: {
        type: Object,
        required: true,
    },
})


//菜单点击
const menuClick = (ctx) => {

    navbarData.menuItemClick(ctx)
}





</script>
<style lang='less' scoped>

</style>