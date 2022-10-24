import {
    createApp
} from 'vue'
import App from './App.vue'
const app = createApp(App)
//全局组件
import table from './views/commonTable/index.vue'
import atable from './views/commonTable/table.vue'
import piniaPluginPersist from 'pinia-plugin-persist'
//pinia
import {
    createPinia
} from 'pinia';
import plugins from './components'
const pinia = createPinia();
pinia.use(piniaPluginPersist)
//ui-elemenyuiplus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@element-plus/icons-vue'
// ui-antd
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@ant-design/icons-vue'

//svg图标
import svgIcon from './icons/components/svgIcon.vue'
//路由
import router from './router/index'
import './index.css'
//全局样式
import "../public/css/style.less"
//全局指令注册
import directives from './directive/index'
directives(app)
app.component('svg-icon', svgIcon).component('common-table', table).component('atable', atable).use(pinia).use(router).use(ElementPlus).use(Antd).use(plugins).mount('#app')