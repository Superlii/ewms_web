import {
    defineStore
} from 'pinia'
//汉堡键-左侧菜单的显、隐控制
export const fullscreen = defineStore('fullscreen', {
    state: () => {
        return {
            toggleFull: false,

        }
    },

    actions: {
        changeToggle() {


            this.toggleFull = !this.toggleFull


        }
    }
})