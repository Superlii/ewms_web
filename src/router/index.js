import Cookies from "js-cookie";

import { permison } from "../store/permison";
import { storeToRefs } from "pinia";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import router from "./router.js";

//获取所有view中的vue文件

const modules = import.meta.glob("../views/**/*.vue");
console.log(modules);

NProgress.configure({
  showSpinner: false,
});

const whiteList = ["/login", "/register"];
// 防止首次或者刷新界面路由失效
let registerRouteFresh = true;
router.beforeEach((to, from, next) => {
  const permisonData = permison();
  const { routes } = storeToRefs(permisonData);

  NProgress.start();

  //已登录
  if (Cookies.get("TokenKey")) {
    let newroute = makeRoute(routes.value);
    to.meta.title && (document.title = to.meta.title);
    if (to.path === "/login") {
      next({
        path: "/",
      });
      NProgress.done();
    } else {
      //遍历-动态添加路由模拟
      if (registerRouteFresh && routes.value.length) {
        permisonData.refreshAvatr(); //头像刷新链接失效问题
        registerRouteFresh = false;
        let notFound = {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          isHide: 1,
          component: () => import("../views/notFound/index.vue"),
          meta: {
            title: "NotFount",
          },
        };
        let result = newroute.some((item) => item.name == notFound.name);
        !result && newroute.push(notFound);
        newroute.forEach((item) => {
          router.addRoute(item);
        });
        next({
          path: to.path,
          replace: true,
        });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export const makeRoute = function (items) {
  let arr = [];

  for (var i = 0; i < items.length; i++) {
    items[i] = formatRoute(items[i]);

    if (items[i].children) {
      //递归处理子路由的component
      items[i].children = makeRoute(items[i].children);
    }
    arr.push(items);
  }

  return items;
};

//格式化路由,使component挂载到路由上,生成addRoutes可用的格式

const layout = () => import("../components/layout/index.vue");
const mainrouterview = () =>
  import("../components/layout/components/main/index.vue");

const formatRoute = (item) => {
  //顶级目录
  if (item.type == 1 && item.pid == 0) {
    item.component = layout;
    item.children ? (item.redirect = item.children[0].path) : "";
    item.meta = {
      title: item.name,
      icon: item.icon,
    };
  }
  //普通目录
  if (item.type == 1 && item.pid != 0) {
    item.component = mainrouterview;
    item.children ? (item.redirect = item.children[0].path) : "";
    item.meta = {
      title: item.name,
      icon: item.icon,
    };
  }
  //顶级菜单
  if (item.type == 2 && item.pid == 0) {
    item = {
      path: "",
      name: "",
      component: layout,
      children: [
        {
          path: item.path,

          name: item.name,
          component: modules[`../${item.link}`],
          // component: () => import(`../${item.link}`),
          meta: {
            title: item.name,
            icon: item.icon,
          },
        },
      ],
    };
  }

  //普通菜单
  if (item.type == 2) {
    if (item.children && item.children.length > 0) {
      //(非正经：菜单作为目录时的处理)
      item.component = mainrouterview;
      item.meta = {
        title: item.name,
        icon: item.icon,
      };
    } else {
      //(正经型)
      item.component = modules[`../${item.link}`];
      // item.component = () => import(`../${item.link}`)
      item.meta = {
        title: item.name,
        icon: item.icon,
      };
    }
  }

  return item;
};

export default router;
