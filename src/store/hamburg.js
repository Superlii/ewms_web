import {
    defineStore
} from 'pinia'
//汉堡键-左侧菜单的显、隐控制
export const hamburg = defineStore('hamburg', {
    state: () => {
        return {
            toggleKey: false,
            iconNmame: 'menu_zhankai'
        }
    },
    getters: {
        aisdeWidth(state) {
            let result = state.toggleKey ? '2.5rem' : '22rem';
            return result
        }
    },
    actions: {
        changeToggle(current) {
          
        
            this.toggleKey = !this.toggleKey
           
            this.iconNmame = this.toggleKey ? 'menu_shouqi' : 'menu_zhankai'
        }
    }
})