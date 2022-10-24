import {
  defineConfig,
  loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend' //组件名npm i vite-plugin-vue-setup-extend -D
import {
  createHtmlPlugin
} from "vite-plugin-html";
import viteCompression from 'vite-plugin-compression'
import {
  svgBuilder
} from './src/plugins/svgBuilder';


/************************************* 路径配置 start ********************************/
import path from 'path'

/************************************* 路径配置 end ********************************/

// https://vitejs.dev/config/
const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};
export default ({
  mode
}) => defineConfig({
  base: '/',

  plugins: [vue(), createHtmlPlugin({
    inject: {
      data: {
        //将环境变量 VITE_APP_TITLE 赋值给 title 方便 html页面使用 title 获取系统标题
        title: getViteEnv(mode, "VITE_APP_TITLE"),
      },
    },
  }), VueSetupExtend(), svgBuilder('./src/icons/svg/'), viteCompression({
    //生成压缩包gz
    verbose: true,
    disable: false,
    threshold: 10240,
    algorithm: 'gzip',
    ext: '.gz',
  }), ],
  define: {
    'process.env': {}
  },
  server: {
    open: false,
    port: 8080,
    host: "0.0.0.0",
    proxy: {
      "/boot": {
        target: "http://60.205.181.21:8948",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },

  },
  // resolve: {
  //   alias: {
  //     "@": resolve("./src"),
  //   },
  // },
  resolve: { // ****************** 路径配置新增
    alias: {
      // 设置路径
      '~': path.resolve(__dirname, './'),
      // 设置别名
      '@': path.resolve(__dirname, './src')
    },
  }, // ****************** 路径配置新增
  build: {
    minify: "terser",
    terserOptions: {
      //打包后移除console和注释
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})