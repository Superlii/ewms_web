<!--  -->
<template>

    <router-view :key="key" v-slot="{ Component, route  }">
        <transition name="fade-transform" mode="out-in">
            <keep-alive>
                <component :is="Component" :key="key" />
            </keep-alive>
        </transition>
    </router-view>
    <!-- <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <component :is="Component" :key="route.path" />
            </keep-alive>
        </transition>
    </router-view> -->


</template>

<script setup lang='ts'>

import { computed } from "vue"
import { useRoute } from "vue-router"
const route = useRoute()
const key = computed(() => route.fullPath)
</script>
<style lang='less' scoped>
</style>