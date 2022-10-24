import Cookies from "js-cookie";
import { defineStore } from "pinia";
import {
  loginIn,
  loginCheckVc,
  menuTree,
  userLoginInfo,
  loginOut,
  downFile,
} from "../utils/request/api";

//用户登录、信息
export const permison = defineStore("permison", {
  state: () => {
    return {
      routes: [],
      menus: [],
      btns: [],
      userinfo: {},
      avatr: "",
    };
  },
  getters: {},
  actions: {
    // 登录
    login(ctx, captchaOnOff) {
      let vc = {};
      let data = {};
      vc.serial = ctx.serial;
      vc.code = ctx.code;
      data.loginName = ctx.username;
      data.password = ctx.password;
      return new Promise((resolve, reject) => {
        //验证码开启
        if (captchaOnOff) {
          //验证码校验
          loginCheckVc(vc).then((res1) => {
            if (res1.code == 200) {
              loginIn(data).then((res2) => {
                if (res2.code == 200) {
                  Cookies.set("TokenKey", res2.data.token);
                  this.getinfo().then((res0) => {
                    resolve(res0);
                  });
                  return;
                }
                resolve(res2);
              });
              return;
            }
            resolve(res1);
          });
        } else {
          loginIn(data).then((res) => {
            if (res.code == 200) {
              Cookies.set("TokenKey", res.data.token);
              this.getinfo().then((res0) => {
                resolve(res0);
              });
              return;
            }
            resolve(res);
          });
        }
      });
    },
    // 登出
    loginOut() {
      let allsTorage = window.localStorage;
      return new Promise((resolve, reject) => {
        loginOut().then((res) => {
          //清除token
          Cookies.set("TokenKey", "");
          //清空缓存
          allsTorage.clear();
          //重加载
          location.reload();
          resolve(true);
        });
      });
    },
    //获取菜单
    menutree() {
      let isAll = this.userinfo.id == 1 ? true : false; //admin id=1 查所有--
      return new Promise((resolve, reject) => {
        menuTree({
          isAll,
        }).then((res) => {
          this.btns = filtBtns(res.data); //获取按钮权限数组
          let data = filteMenu(res.data);
          this.menus = [];
          // this.menus.push({
          //   authStr: "",
          //   icon: "luotuo",
          //   isHide: false,
          //   link: "",
          //   name: "",
          //   path: "",
          //   id: 0,
          //   sort: 0,
          //   status: 1,
          //   type: 2,
          // });
          this.menus = this.menus.concat(data);
          this.routes = data;
          resolve(res);
        });
      });
    },
    //获取用户信息
    getinfo() {
      return new Promise((resolve, reject) => {
        userLoginInfo().then((res3) => {
          if (res3.code == 200) {
            let data = res3.data;
            this.avatr = res3.data.photo;
            let obj = {};
            obj.fileName = data.photo;
            if (!!obj.fileName) {
              downFile(obj).then((res1) => {
                data.photo = window.URL.createObjectURL(res1);
                this.userinfo = data;
                this.userinfo = data;
                this.menutree().then((res0) => {
                  resolve(res0); //菜单获取完毕，放行
                });
              });
              return;
            }
            this.userinfo = data;
            this.menutree().then((res0) => {
              resolve(res0); //菜单获取完毕，放行
            });
          }
        });
      });
    },
    //头像链接失效处理
    refreshAvatr() {
      if (!!this.avatr) {
        downFile({
          fileName: this.avatr,
        }).then((res) => {
          this.userinfo.photo = window.URL.createObjectURL(res);
        });
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
        path: [], //可以选择保存的字段  其余的不保存
      },
    ],
  },
});

//按钮权限筛选
export function filtBtns(con) {
  if (con && con.length > 0) {
    let btns = [];
    con.forEach((v) => {
      if (v.type === 3) {
        btns.push(v.authStr);
      }
      if (v.children) {
        btns.push(...filtBtns(v.children));
      }
    });
    return btns;
  }
}
//去除按钮
export function filteMenu(data) {
  var newTree = data.filter((x) => x.type !== 3);
  newTree.forEach((x) => x.children && (x.children = filteMenu(x.children)));
  return newTree;
}
