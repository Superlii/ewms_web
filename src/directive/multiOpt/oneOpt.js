//点击事件防重处理
export default {
    mounted(el, bindings, vnode) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                // 传入绑定值就使用，默认1000毫秒内不可重复点击
                setTimeout(() => el.disabled = false, bindings.value || 1000)
            }
        })
    }
}