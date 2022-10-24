/*
 *@Author: 菠萝吹雪（zcf）
 *@Date: 2022-05-27 15:16:36
 *@Description: 
*/
<template>
    <!-- Form -->
    <div>
        <a-modal :modal="false" width="700px" footer='' v-model:visible="dialogVisiblefordetail"
            :title="dialogVisiblefordetailloading ? '' : detaildata.userName">
            <div v-if="dialogVisiblefordetailloading" element-loading-background="transparent"
                style="height: 200px;margin-bottom: 40px;background-color: transparent;"
                v-loading="dialogVisiblefordetailloading"></div>
            <el-descriptions v-if="!dialogVisiblefordetailloading" class="margin-top desc" :column="1" :size="size"
                border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            用户名
                        </div>
                    </template>
                    {{ detaildata.userName || '--' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <iphone />
                            </el-icon>
                            手机号
                        </div>
                    </template>
                    {{ detaildata.phone || '--' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            所属部门
                        </div>
                    </template>
                    <span style="color: #333;" v-for="item in detaildata.deptList " :key="item.id">{{ item.name + '、'
                    }}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <tickets />
                            </el-icon>
                            所有角色
                        </div>
                    </template>
                    <span style="color: #333;" v-for="item in detaildata.roleList " :key="item.id">{{ item.name + '、'
                    }}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <office-building />
                            </el-icon>
                            所有权限字符
                        </div>
                    </template>

                    <span style="color: #333;" v-for="item in detaildata.authStrList " :key="item">{{ item + '、'
                    }}</span>
                </el-descriptions-item>
            </el-descriptions>

        </a-modal>
    </div>

</template>

<script setup name="detaildialog" >
import { computed, ref } from 'vue'
import {
    Iphone,
    Location,
    OfficeBuilding,
    Tickets,
    User,
} from '@element-plus/icons-vue'

defineProps({
    detaildata: {
        type: Object,
        required: true,

    }
})

const size = ref('small')
const iconStyle = computed(() => {
    const marginMap = {
        large: '8px',
        default: '6px',
        small: '4px',
    }
    return {
        marginRight: marginMap[size.value] || marginMap.default,
    }
})


const dialogVisiblefordetail = ref(false)
const dialogVisiblefordetailloading = ref(true)

const closedetail = () => {
    dialogVisiblefordetailloading.value = true
}
// 导出子组件属性defineExpose：组件暴露自己的属性
defineExpose({
    dialogVisiblefordetail, dialogVisiblefordetailloading
})
</script>

<style lang="less" scoped>
.desc {
    background: transparent;
    padding-bottom: 20px;
}
</style>

