<template>
  <a-button :type="type" size="small" class="app-upload-btn">
    <div @change="onChange">
      <input type="file" ref="file" v-if="fileReset" />
    </div>
    <slot>
      <span>导入</span>
    </slot>
  </a-button>
</template>

<script setup>
import { ref, nextTick, toRefs } from "vue";

const props = defineProps({
  shape: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  multiple: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const { shape, type, multiple } = toRefs(props);
const emitFun = defineEmits(["change"]);
const fileReset = ref(true);

const onChange = async (e) => {
  const { files } = e.target;
  if (files.length === 0) {
    return false;
  }
  if (multiple.value) {
    emitFun("change", files);
  } else {
    emitFun("change", files.at(-1));
  }
  fileReset.value = false;
  await nextTick();
  fileReset.value = true;
};
</script>

<style lang="less" scoped>
.app-upload-btn {
  position: relative;
  overflow: hidden;
  input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
}
.app-upload-btn.ivu-btn-text {
  line-height: 40px;
  padding: 0;
}
</style>
