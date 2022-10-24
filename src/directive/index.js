/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-06-02 13:39:01
 *@Description: 指令
 */
const alljs =
    import.meta.globEager('./**/**.js');
let allkeys = Object.keys(alljs);
function getName(ctx) {
    let cur = ctx.split('/')[ctx.split('/').length - 1].split('.')[0]
    return cur;
}
export default function directive(app) {
    allkeys.forEach(item => {
        console.log(getName(item),alljs[item]);
        app.directive(getName(item), alljs[item].default)
    });
}