import {
    permison
} from '../../store/permison'
export default {
    mounted(el, bindings, vnode) {
        const permisonData = permison()
        let btnValue = bindings.value //获取按钮的绑定值
        let result = permisonData.btns.indexOf(btnValue) >= 0 //比对权限
            !result && el.parentNode.removeChild(el) //没有权限就删除
    }
}