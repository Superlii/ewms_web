
<template>
    <iframe id="iframeContain" name="iframeContain" seamless scrolling="yes" :src="iframeURL">
        您当前的浏览器不支持页面上的功能，请升级您当前的浏览器版本或使用谷歌浏览器访问当前页面
    </iframe>

</template>
<script setup>

const iframeURL = 'https://www.javascriptc.com/vue3js/guide/introduction.html'

</script>
<style lang='less' scoped>
#iframeContain {
    width: 100%;
    height: calc(100vh - 7.4rem);
    border: none !important;

}
</style>
  