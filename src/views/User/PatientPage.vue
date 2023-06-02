<script setup lang="ts">
import { getPatientList, editPatient, delPatient } from "@/services/user";
import type { PatientList, Patient } from "@/types/user";
import { onMounted, ref, computed } from "vue";
import { nameRules, idCardRules } from "@/utils/rules";
import { showConfirmDialog, type FormInstance, showSuccessToast } from "vant";
import { addPatient } from "@/services/user";
onMounted(() => {
  getPatient();
});
const PatientList = ref<PatientList>([]);
const getPatient = async () => {
  const { data } = await getPatientList();
  PatientList.value = data;
};
const options = [
  { label: "男", value: 1 },
  { label: "女", value: 0 }
];
//打开侧滑栏
const show = ref(false);
const showPopup = () => {
  patient.value = { ...patientBackup };
  show.value = true;
};
//关闭侧滑栏
const closePopup = () => {
  show.value = false;
};
//清空表单
const patientBackup: Patient = {
  name: "",
  idCard: "",
  gender: 1,
  defaultFlag: 0
};
const patient = ref<Patient>({
  ...patientBackup
});
//计算属性处理默认值
// patient.defaultFlag 是个数字
// 但是组件库要求的是个布尔值,
// 做一个计算属性进行转换,
// 因为处理操作是双向, 比起之前的纯读取, 现在也要处理修改的部分
const defaultFlag = computed({
  get() {
    // 计算属性被读取时的操作
    return patient.value.defaultFlag === 1 ? true : false;
  },
  set(value) {
    // 当这个计算属性绑定的数据要背改掉的时候, 进行的操作
    // 计算属性是派生数据, 依赖别的数据进行计算
    // 真正修改时, 改的不是计算属性自己, 而是被依赖的数据本体
    patient.value.defaultFlag = value ? 1 : 0;
  }
});
//表单提交验证
const form = ref<FormInstance>();
const submit = async () => {
  // 格式校验
  await form.value?.validate();
  // 性别校验
  const idCardGender = +patient.value.idCard.slice(-2, -1) % 2;
  if (idCardGender !== patient.value.gender) {
    await showConfirmDialog({
      title: "温馨提示",
      message: "性别和身份证号不一致, 确认提交吗?"
    });
  }
  patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value);
  patient.value.id ? "编辑成功" : "添加成功";
  getPatient();
  showSuccessToast(patient.value.id ? "编辑成功" : "添加成功");
};
//编辑功能
const showEdit = (item?: Patient) => {
  // 如果点的是编辑，解构出后台需要的数据
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item;
    patient.value = {
      id,
      gender,
      name,
      idCard,
      defaultFlag
    };
  } else {
    patient.value = { ...patientBackup };
  }
  show.value = true;
};
//删除功能
const delPatientInfo = async () => {
  if (!patient.value.id) return;
  await showConfirmDialog({
    title: "温馨提示",
    message: "是否删除此条信息"
  });
  await delPatient(patient.value.id);
  showSuccessToast("删除成功");
  show.value = false;
  getPatient();
};
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="item in PatientList" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6}).+(.{4})$/, "\$1********\$2") }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showEdit(item)"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag">默认</div>
      </div>
      <div class="patient-add" v-if="PatientList.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 侧边栏 -->
    <van-popup v-model:show="show" position="right">
      <cp-nav-bar
        @click-right="submit"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        :back="closePopup"
      />
      <van-form autocomplete="off" ref="form">
        <van-field
          :rules="nameRules"
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
        />
        <van-field
          :rules="idCardRules"
          v-model="patient.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn :options="options" v-model="patient.gender"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox :icon-size="18" v-model="defaultFlag" round />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="delPatientInfo">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
</style>
