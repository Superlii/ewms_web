import uploadBtn from './upload/uploadBtn.vue'

const plugins = {
  install(Vue) {
      /* 扩展组件 */
      Vue.component('app-upload-btn', uploadBtn)
  }
}

export default plugins