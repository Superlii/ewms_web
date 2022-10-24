<template>
  <div>
    <div class="user-info-head" @click="editCropper()">
      <img :src="options.img" title="点击上传头像" class="rotae_l20 img-circle img-lg" />
    </div>
    <el-dialog append-to-body :modal="false" :title="title" v-model="open" width="800px" @opened="modalOpened"
      @close="closeDialog">
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox"
            @realTime="realTime" v-if="visible" />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview" v-loading="uploadLoading">
            <img :src="options.previews.url" :style="options.previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row style="margin-bottom: 20px;">
        <el-col :lg="2" :md="2">
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button>
              选择
              <el-icon class="el-icon--right">
                <Upload />
              </el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button :icon="Plus" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button :icon="Minus" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button :icon="RefreshLeft" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button :icon="RefreshRight" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="warning" @click="uploadImg()">上传头像</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive } from 'vue'
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { Plus, Minus, RefreshLeft, RefreshRight, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { uploadFile, userEdi } from '@/utils/request/api'
import { permison } from "@/store/permison";

const permisonData = permison()


const { proxy } = getCurrentInstance();

const open = ref(false);
const visible = ref(false);
const uploadLoading = ref(false)
const title = ref("修改头像");

//图片裁剪数据
const options = reactive({
  img: permisonData.userinfo.photo || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png', // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  previews: {},//预览数据
  cFileName: ''
});

/** 编辑头像 */
function editCropper() {
  open.value = true;
};
/** 打开弹出层结束时的回调 */
function modalOpened() {
  visible.value = true;
};
/** 覆盖默认上传行为 */
function requestUpload() {
};
/** 向左旋转 */
function rotateLeft() {
  proxy.$refs.cropper.rotateLeft();
};
/** 向右旋转 */
function rotateRight() {
  proxy.$refs.cropper.rotateRight();
};
/** 图片缩放 */
function changeScale(num) {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
};
/** 上传预处理 */
function beforeUpload(file) {
  options.cFileName = file.name
  if (file.type.indexOf("image/") == -1) {
    ElMessage({
      type: 'warning',
      message: '文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。',
    })
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      options.img = reader.result;
    };
  }
};
/** 上传图片 */
function uploadImg() {
  uploadLoading.value = true
  proxy.$refs.cropper.getCropBlob(data => {
    let formData = new FormData();
    formData.append("file", data, options.cFileName);
    uploadFile(formData).then(res => {

      permisonData.userinfo.photo = res.data.url
      userEdi(permisonData.userinfo).then(() => {
        permisonData.getinfo().then(res => {
          if (res.code == 200) {
            open.value = false;
            uploadLoading.value = false;
            options.img = permisonData.userinfo.photo;
            ElMessage({
              type: 'success',
              message: '头像修改成功！',
            })
            visible.value = false;
          }
        })

      });

    });
  });
};
/** 实时预览 */
function realTime(data) {
  options.previews = data;
};
/** 关闭窗口 */
function closeDialog() {
  // options.img = store.getters.avatar;
  options.visible = false;
};
</script>

<style lang='less' scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: "+";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.2);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  border: 1px solid #ccc;
  overflow: hidden;
}

.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
}
</style>