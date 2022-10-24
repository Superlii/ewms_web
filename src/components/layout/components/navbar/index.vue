<!-- /*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-04-30 23:24:33
 *@Description: 
*/ -->
<template>
  <div class="wrap">
    <el-scrollbar ref="refScrollbar" @wheel.prevent="handleScroll">
      <div class="scrollbar-flex-content">
        <router-link
          @click="
            navbarData.menuItemClick({ path: '/home', meta: { title: '首页' } })
          "
          @contextmenu.prevent="
            mouseRightClick({ path: '/home', meta: { title: '首页' } }, $event)
          "
          class="scrollbar-demo-item"
          :class="isActive({ path: '/home' }) ? 'active' : ''"
          to="/home"
        >
          <svg-icon size="1.5rem" name="home" />
          首页
        </router-link>
        <router-link
          @click="navbarData.menuItemClick(item)"
          @contextmenu.prevent="
            mouseRightClick(
              { path: item.path, meta: { title: item.title } },
              $event
            )
          "
          class="scrollbar-demo-item"
          :class="isActive(item) ? 'active' : ''"
          closable
          v-for="(item, index) in currentRoute"
          :key="index"
          :to="item.path"
        >
          {{ item.name }}
          <svg-icon
            @click.prevent.stop="menuItemDel(item, route.path)"
            size="1rem"
            name="delet"
          />
        </router-link>
      </div>
    </el-scrollbar>
    <ul v-show="visible" ref="menu" class="menu">
      <li @click="menuItemDel(mouseRightView, route.path)">关闭</li>
      <li @click="closeOther">关闭其他</li>
      <li @click="closeAll">关闭所有</li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { navbar } from "@/store/navBar";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const navbarData = navbar();
const { currentRoute } = storeToRefs(navbarData);

const isActive = (item) => {
  return item.path == route.path;
};
// 鼠标滚动
const refScrollbar = ref(null);
const handleScroll = (e) => {
  const wheelDelta = e.wheelDelta || -e.deltaY * 40;
  const scrollbar = refScrollbar.value;
  // scrollbar.wrap$获取到包裹容器的element对象
  scrollbar.setScrollLeft(scrollbar.wrap$.scrollLeft + wheelDelta);
};

//删除路由navitem
const menuItemDel = (ctx, active) => {
  console.log(currentRoute);
  let nowIndex = currentRoute.value.findIndex((item, index) => {
    return item.path == ctx.path;
  });
  //删除位置
  if (nowIndex > 0) {
    if (ctx.path == active) {
      router.push(currentRoute.value[nowIndex - 1].path);
    }
  } else {
    if (currentRoute.value.length == 1) {
      router.push("/home");
    }
  }

  navbarData.menuItemDel(ctx);
};

// 当前右键view
const mouseRightView = ref({
  name: "",
  path: "",
  meta: {
    fixed: false,
  },
});
// 右键菜单html
const menu = ref(null);
// 右键菜单是否显示
const visible = ref(false);
// 关闭右键菜单
const hideMenu = () => {
  visible.value = false;
};
// 显示右键菜单
const showMenu = (left, top) => {
  // 浏览器添加click关闭右键菜单
  window.addEventListener("click", hideMenu);
  visible.value = true;
  if (menu.value) {
    menu.value.style.left = `${left}px`;
    // menu.value.style.top = `${top + 15}px`
  }
};
// 鼠标右键点击
const mouseRightClick = (view, e) => {
  // 存储右键view
  mouseRightView.value = view;
  // 显示右键菜单
  showMenu(e.clientX, e.clientY);
};

// 右键关闭其他
const closeOther = () => {
  if (mouseRightView.value.path !== route.path) {
    if (mouseRightView.value.path == "/home") {
      router.push("/home");
    } else {
      router.push({ name: mouseRightView.value.name });
    }
  }
  navbarData.deleteOther(mouseRightView.value);
};
// 右键关闭所有
const closeAll = async () => {
  navbarData.deleteAll();
  router.push("/home");
};
</script>
<style lang="less" scoped>
.wrap {
  width: 100%;
  align-items: center;
}

.scrollbar-flex-content {
  display: flex;
  align-items: center;
  margin-top: 6px;
}

:deep(.el-scrollbar__bar.is-horizontal) {
  height: 2px !important;
  left: 2px;
}

.scrollbar-demo-item {
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 10rem;
  padding: 0.5rem 1rem;
  height: 2rem;
  margin: 0.5rem 1rem 0 0rem;
  border-radius: 0.2rem;
  background: #ffff;
  border: 1px solid #ccc;
  font-family: "Microsoft YaHei", "微软雅黑", "宋体" !important;
  box-shadow: -1px -1px 0px #ddd, 3px 3px 0px #333;
  color: #333;

  &:nth-child(1) {
    margin-left: 0;
    display: flex;
    justify-content: center;
    padding-right: 2rem;

    &::before {
      content: "";
      background: transparent !important;
    }

    .svg-icon {
      margin: 0.5rem 0.5rem 0.5rem 0.5rem;

      &:hover {
        color: #ffff;
      }
    }
  }

  &:hover {
    background-color: rgba(147, 148, 148, 0.9);
    border-radius: 5px;
    color: #ffff;
    transform: scale(1.01);

    transition: all 0.2s;
  }

  .svg-icon {
    margin: 0.5rem 0 0.5rem 0.5rem;

    &:hover {
      color: red;
    }
  }

  &.active {
    background-color: rgba(147, 148, 148, 0.9);
    // background: url('../../../../assets/imgs/titlebg.png');
    // background-size: 120% 160%;
    // background-position: 2px -2px;
    border-radius: 5px;
    color: #fff;

    &::before {
      content: "";
      background: #fff;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: relative;
      margin-right: 0.5rem;
    }
  }
}

.menu {
  width: 100px;
  padding: 5px 10px;
  position: absolute;
  z-index: 9999;
  background-color: #ffff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);

  > li {
    padding: 5px 2px;
    cursor: pointer;
    font-size: 1.2rem;

    &:hover {
      color: #3477f2;
    }
  }
}
</style>
