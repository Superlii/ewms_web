<template>
   <div class="app-container">
      <a-row :gutter="20">
         <a-col :span="6" :xs="24">
            <a-card class="box-card">
               <template v-slot:header>
                  <div class="head">
                     <span>个人信息</span>
                  </div>
               </template>
               <div class="main-user">
                  <div class="text-center">
                     <userAvatar :user="state.user" />
                  </div>
                  <ul class="user-info">
                     <li class="list-group-item">
                        <svg-icon class="icon" name="user" />用户名称:
                        <div class="user-right">{{ permisonData.userinfo.userName }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon class="icon" name="phone" />手机号码:
                        <div class="user-right">{{ permisonData.userinfo.phone || '--' }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon class="icon" name="email" />用户邮箱:
                        <div class="user-right">{{ permisonData.userinfo.email || '--' }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon class="icon" name="tree" />用户部门:
                        <div class="user-right" v-if="permisonData.userinfo.deptList.length">
                           <span v-for="item in permisonData.userinfo.deptList" :key="item.id">{{ item.name + '、' ||
                           '--'
                           }}</span>
                        </div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon class="icon" name="peoples" />用户角色:
                        <div class="user-right">
                           <span v-for="item in permisonData.userinfo.roleList" :key="item.id">{{ item.name + '、' ||
                           '--'
                           }}</span>
                        </div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon class="icon" name="date" />登录日期:
                        <div class="user-right">{{ permisonData.userinfo.loginTime }}</div>
                     </li>
                  </ul>
               </div>
            </a-card>
         </a-col>
         <a-col :span="18" :xs="24">
            <a-card>
               <template v-slot:header>
                  <div class="clearfix head">
                     <span>基本资料</span>
                  </div>
               </template>
               <a-tabs v-model="activeTab">
                  <a-tab-pane label="基本资料" name="userinfo">
                     <!-- <userInfo :user="state.user" /> -->
                  </a-tab-pane>
                  <a-tab-pane label="修改密码" name="resetPwd">
                     <restPassword />
                  </a-tab-pane>
               </a-tabs>
            </a-card>
         </a-col>
      </a-row>
   </div>
</template>

<script setup name="Profile">
import { ref, reactive } from 'vue'
import { permison } from "@/store/permison";
import userAvatar from "./component/userAvatar.vue";
import restPassword from "./component/restPassword.vue";
const permisonData = permison()
const activeTab = ref("userinfo");
const state = reactive({
   user: {},
   roleGroup: {},
   postGroup: {}
});


</script>
<style scoped lang="less">
.head {
   text-align: left;
   font-size: 1.76rem;
}

.main-user {
   display: flex;
   flex-direction: column;
   align-items: center;
}

.avatar {
   width: 120px;
   height: 120px;
   border: 0.1rem solid #ccc;
   box-shadow: rgb(110, 109, 109) 0 0 1.5rem;
   border-radius: 50%;

   img {
      width: 100%;
      height: 100%;
   }

   .imgU {
      cursor: pointer;
      width: 118px;
      height: 118px;
      border-radius: 50%;
   }
}

.user-info {
   padding-left: 0;
   list-style: none;
   width: 100%;

   li {
      width: 100%;
      display: list-item;
      text-align: left;
      border-bottom: 1px solid #f0f3f4;
      padding: 11px 0;
      font-size: 12px;

      .icon {
         margin-right: 5px;
      }
   }

   .user-right {
      float: right;

      a {
         color: #317ef3;
      }
   }
}

.form_left {
   text-align: left;
}

.block {
   margin-top: 25px;
   float: left;
}

.el-table {
   font-size: 12px;
   padding: 2rem 0 0 2rem;
   overflow: visible;
}

.el-table {
   &:deep(thead) {
      font-size: 12.5px;
      color: #909399;
      font-weight: 700;
   }

}

.el-table::before {
   z-index: inherit;
   visibility: hidden;
}
</style>
