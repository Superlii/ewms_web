export function parseTime(time) {
    if (time) {
        var date = new Date(time)
        var year = date.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    } else {
        return ''
    }
}






export const dFile = function (obj, name, suffix) {
    const url = window.URL.createObjectURL(new Blob([obj]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    const fileName = parseTime(new Date()) + '-' + name + '.' + suffix // 时间，文件名，后缀名
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}