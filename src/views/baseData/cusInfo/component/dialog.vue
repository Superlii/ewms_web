<template>
  <!-- Form -->
  <div>
    <a-modal
      :modal="false"
      width="700px"
      v-model:visible="dialogVisible"
      :title="dialogtype == 'add' ? '添加客户' : '修改客户'"
    >
      <a-form :model="form" :rules="rules" ref="ruleFormRef">
        <a-row :gutter="20">
          <a-col>
            <a-form-item
              :label-width="formLabelWidth"
              label="客户编码"
              name="code"
            >
              <a-input
                size="small"
                v-model:value="form.code"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item
              :label-width="formLabelWidth"
              label="客户名称:"
              name="name"
            >
              <a-input
                size="small"
                :disabled="dialogtype != 'add'"
                v-model:value="form.name"
                placeholder="请输入"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="dialogtype == 'add'">
            <a-form-item
              :label-width="formLabelWidth"
              label="客户地址:"
              name="address"
            >
              <a-input
                size="small"
                v-model:value="form.address"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item
              :label-width="formLabelWidth"
              label="客户联系方式:"
              name="phone"
            >
              <a-input
                size="small"
                v-model:value="form.phone"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item
              :label-width="formLabelWidth"
              label="所属组织:"
              name="organization"
              width="240px"
            >
              <a-select
                size="small"
                placeholder="请选择所属组织"
                v-model:value="form.organization"
              >
                <a-select-option
                  v-for="item in orgList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                >
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item
              name="creater"
              label="创建人:"
              :label-width="formLabelWidth"
            >
              <a-input
                size="small"
                v-model:value="form.creater"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item
              name="create_time"
              label="创建时间:"
              :label-width="formLabelWidth"
            >
              <a-input
                size="small"
                v-model:value="form.create_time"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item
              name="remark"
              label="备注:"
              :label-width="formLabelWidth"
            >
              <a-input
                size="small"
                v-model:value="form.remark"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="sure">确定</el-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { permison } from "@/store/permison";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { reactive, ref, toRefs, watch, createVNode } from "vue";
import md5 from "js-md5";
import { cusAdd, cusEdit, cusDetail } from "@/utils/request/api";
const permisonData = permison();
//获取传递函数
const emitFun = defineEmits(["resettable"]);

const defaultData = {
  code: "",
  cusName: "",
  address: "",
  phone: "",
  organization: "",
  creater: "",
  create_time: "",
  remark: "",
};

const rules = reactive({
  code: [{ required: true, message: "请设置客户编码", trigger: "blur" }],
  cusName: [{ required: true, message: "请设置客户名称", trigger: "blur" }],
  organization: [
    { required: true, message: "请设置客户所属组织", trigger: "blur" },
  ],
});
const ruleFormRef = ref(null); //获取表单元素

//接收参数
const props = defineProps({
  editdata: {
    type: Object,
    required: true,
  },
  dialogtype: {
    type: String,
    required: true,
  },
  dialogVisible: {
    type: Boolean,
    required: true,
  },
});
const { dialogtype, dialogVisible } = toRefs(props)
// const dialogVisible = ref(false);
//数据
const data = reactive({
  form: Object.assign({}, defaultData),
  dloading: false,
});

const { form, dloading } = toRefs(data);

//监听弹窗状态

// const dialogtype = ref("add"); //弹窗类型，默认是添加
const orgList = ref([
  {
    id: 1,
    value: "1",
  },
  {
    id: 2,
    value: "2",
  },
  {
    id: 3,
    value: "3",
  },
]); // 所属组织
let tkey = ref(0);
watch(dialogVisible, (n, o) => {
  if (n) {
    tkey.value += 1;
    //弹窗出现

    if (dialogtype.value == "add") {
      console.log("添加");
    } else {
      let objdata = Object.assign({}, props.editdata);
      cusDetail(objdata.id).then((res) => {
        orgList.value = res.data;
      });
      form.value = Object.assign({}, objdata);
    }
  } else {
    form.value = Object.assign({}, defaultData);
  }
});
const formLabelWidth = "80px";

//添加客户
const addone = async () => {
  try {
    const validvalues = await ruleFormRef.value.validateFields();
    console.log("Success:", validvalues);
    if (validvalues) {
      dloading.value = true;
      let obj = Object.assign({}, form.value);
      obj.password = md5(obj.password);
      cusAdd(obj).then((res) => {
        if (res.code == 200) {
          message.success("添加成功！");
          emitFun("resettable");
          dialogVisible.value = false;
        } else {
          message.error("添加失败！");
        }
        dloading.value = false;
      });
    } else {
      dloading.value = false;
      message.warning("必填数据不能为空！");
    }
  } catch (errorInfo) {
    console.log("Failed:", errorInfo);
  }
};

//修改客户
const editeone = async (ctx) => {
  try {
    const validvalues = await ruleFormRef.value.validateFields();
    console.log("Success:", validvalues);
    if (validvalues) {
      dloading.value = true;
      let delNames = ctx.userName;
      Modal.confirm({
        title: "修改提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定修客户'${delNames}'吗?`,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          let obj = Object.assign({}, ctx);
          cusEdit(obj).then((res) => {
            if (res.code == 200) {
              message.success("修改成功！");
              emitFun("resettable");
              dialogVisible.value = false;
            } else {
              message.error("修改失败！");
            }
            dloading.value = false;
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      });
    } else {
      dloading.value = false;
      message.warning("必填数据不能为空！");
    }
  } catch (errorInfo) {
    console.log("Failed:", errorInfo);
  }
};

const cancel = () => {
  emitFun("cancel");
};
const sure = () => {
  switch (dialogtype.value) {
    case "add":
      addone();
      break;
    case "edit":
      editeone(form.value);
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped></style>
