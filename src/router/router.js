import { createRouter, createWebHistory } from "vue-router";
import layout from "../components/layout/index.vue";
const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      name: "/",
      component: layout,
      redirect: "/home",
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("@/views/home/index.vue"),
          meta: {
            title: "首页",
          },
        },
        {
          path: "warehouse",
          name: "warehouse",
          component: () => import("@/views/baseData/warehouse/warehouse.vue"),
          meta: {
            title: "仓库",
          }
        },
        {
          path: "customer-info",
          name: "customer-info",
          component: () => import("@/views/baseData/cusInfo/cusInfo.vue"),
          meta: {
            title: "客户信息",
          }
        },
        {
          path: "menu-manage",
          name: "menu-manage",
          component: () => import("@/views/system/menuMange/index.vue"),
          meta: {
            title: "菜单管理",
          },
        },
        // {
        //   path: "base-data",
        //   name: "base-data",
        //   component: () => import("@/views/home/index.vue"),
        //   meta: {
        //     title: "基础数据",
        //   },
        //   children: [
        //     {
        //       path: "/warehouse",
        //       name: "warehouse",
        //       component: () =>
        //         import("@/views/baseData/warehouse/warehouse.vue"),
        //       meta: {
        //         title: "基础数据",
        //       },
        //     },
        //   ],
        // },
        {
          path: "user-manage",
          name: "user-manage",
          component: () => import("@/views/system/userMange/index.vue"),
          meta: {
            title: "用户管理",
          },
        },
        {
          path: "file-mange",
          name: "file-mange",
          component: () => import("@/views/system/fileMange/index.vue"),
          meta: {
            title: "文件管理"
          },
        },
        {
          path: "role-manage",
          name: "role-manage",
          component: () => import("@/views/system/roleMange/index.vue"),
          meta: {
            title: "角色管理"
          },
        },
        {
          path: "dept-manage",
          name: "dept-manage",
          component: () => import("@/views/system/deptMange/index.vue"),
          meta: {
            title: "部门管理"
          },
        },
        {
          path: "dict-manage",
          name: "dict-manage",
          component: () => import("@/views/system/dictMange/index.vue"),
          meta: {
            title: "字典管理"
          },
        },
        {
          path: "logger-business",
          name: "logger-business",
          component: () => import("@/views/system/logsMange/business/index.vue"),
          meta: {
            title: "业务日志"
          },
        },
        {
          path: "logger-data",
          name: "logger-data",
          component: () => import("@/views/system/logsMange/datas/index.vue"),
          meta: {
            title: "数据日志"
          },
        },
        {
          path: "ain-info",
          name: "ain-info",
          component: () => import("@/views/system/userInfo/index.vue"),
          meta: {
            title: "个人信息"
          },
        }
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
      meta: {
        title: "登录",
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/register/index.vue"),
      meta: {
        title: "注册",
      },
    },
  ],
});

export default router;
