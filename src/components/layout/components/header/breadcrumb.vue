<!-- /*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-04-30 20:27:32
 *@Description: 
*/ -->
<template>

    <transition-group name="breadcrumb" key="1">
        <a-breadcrumb key="1" style="margin-left: 1rem;" separator="/">
            <a-breadcrumb-item :key="2" :to="{ path: '/' }">
                <svg-icon style="margin-right: 1.5px;margin-top: 1.5px;" size="1.5rem" name="home" /> <span
                    class="bc-title">
                    <router-link to="/home"> 首页</router-link>
                </span>
            </a-breadcrumb-item>
            <a-breadcrumb-item v-for="item in nowArr" :key="item.path" :to="item.path"
                v-show="item.name && item.name != 'home' && item.name != '/'">
                <svg-icon style="margin-right: 3px;margin-top: 1.5px;" size="1.3rem"
                    :name="(item.meta && item.meta.icon) || ''" />
                <span v-if="item.meta" class="bc-title">
                    <router-link :to="item.path"> {{ item.meta.title }}</router-link>
                </span>
            </a-breadcrumb-item>
        </a-breadcrumb>
    </transition-group>


</template>

<script setup >
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const nowArr = computed(() => route.matched)

onMounted(() => {
    console.log(route.matched)
})

</script>
<style lang='less' scoped>
.bc-title {
    cursor: pointer;
    font-size: 1.2rem;
}
</style>