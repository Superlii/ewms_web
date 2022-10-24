<template>
  <a-menu :selectedKeys="[active]" mode="inline" theme="Light" :inline-collapsed="toggleKey" @openChange="handleOpen">
    <template v-for="item in menus" :key="item.id">
      <Item :item="item" />
    </template>
  </a-menu>

</template>
<script>

</script>
<script  setup name="leftmenus">
import { hamburg } from "@/store/hamburg";
import { permison } from "@/store/permison";
import { navbar } from '@/store/navBar'
import { storeToRefs } from 'pinia' //用于结构仓库数据，且依然是响应式的
import Item from './menuItem.vue'
import { ref, computed, onMounted } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
} from '@ant-design/icons-vue';

import { useRoute, useRouter } from 'vue-router';
const hamburgData = hamburg()
const permisonData = permison()
const navbarData = navbar()
const { toggleKey } = storeToRefs(hamburgData)
const { menus } = storeToRefs(permisonData)

const router = useRouter()
const route = useRoute()


const active = computed(() => route.path)



const handleOpen = (key, keyPath) => {
  !!navbarData.currentPath ? router.push(navbarData.currentPath) : router.push(key);
}
const handleClose = (key, keyPath) => {
  console.log('submenu关闭', key)

}
onMounted(() => {
  console.log(menus.value)
})
</script>


