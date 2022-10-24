/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-04-30 20:40:11
 *@Description: 
 */
import {
    defineStore
} from 'pinia'
// 导航栏
export const navbar = defineStore('navbar', {
    state: () => {
        return {
            currentRoute: [],
            currentPath:''
        }
    },
    getters: {

    },
    actions: {

        menuItemClick(ctx) {
            !!ctx && ctx.pid != 0 && (this.currentPath = ctx.path);
            !!ctx && ctx.pid==0 && (this.currentPath='');
            let result = () => {
                    if (!!ctx) {

                        if (ctx.path == '/home' || ctx.path == '/login' || ctx.path == '') {
                            return true;
                        } else {
                            return this.currentRoute.some((value, index, arr) => {
                                return value.path == ctx.path;
                            });
                        }
                    } else {
                        return true
                    }
                }


                !result() && (this.currentRoute.push(ctx))
            // console.log(ctx, this.currentRoute);
        },
        //关闭单个
        menuItemDel(ctx) {
            if (!!ctx) {
                this.currentRoute.forEach((item, index) => {
                    item.path == ctx.path && this.currentRoute.splice(index, 1)
                });

            }

        },
        //关闭其它
        deleteOther(ctx) {
            if (!!ctx) {
                if (ctx.path == '/home') {
                    this.currentRoute = []
                } else {
                    this.currentRoute.forEach((item, index) => {
                        item.path == ctx.path && (this.currentRoute = this.currentRoute.splice(index, 1))
                    });
                }


            }
        },
        //关闭all
        deleteAll() {

            this.currentRoute = []

        }
    },
    persist: {
        enabled: true,
        strategies: [{
            key: 'navbar',
            storage: localStorage,
            path: [] //可以选择保存的字段  其余的不保存
        }]
    }

})