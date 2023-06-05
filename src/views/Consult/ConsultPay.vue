<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder, getConsultOrderPayUrl } from "@/services/consult";
import { getPatientDetail } from "@/services/user";
import { useConsultStore } from "@/stores";
import type { ConsultOrderPreData, PartialConsult } from "@/types/consult";
import type { Patient } from "@/types/user";
import { showToast, showConfirmDialog, showDialog, showLoadingToast } from "vant";
import { ref, onMounted } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
const router = useRouter();
const store = useConsultStore();
type Key = keyof PartialConsult;
// 定义支付信息数据和获取函数
const payInfo = ref<ConsultOrderPreData>();
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  });
  payInfo.value = res.data;
  // 设置默认优惠券
  store.setCoupon(payInfo.value.couponId);
};

// 定义用户数据和获取函数
const patient = ref<Patient>();
const loadPatient = async () => {
  if (!store.consult.patientId) return;
  const res = await getPatientDetail(store.consult.patientId);
  patient.value = res.data;
};

onMounted(() => {
  // 避免创建订单, 表单数据被清空后用户强制刷新,
  // 进入页面先检查所有字段都是完整的, 如果不完整, 跳回首页让用户重新填写
  // 测试清空数据后的效果, 能不能自动跳转回首页
  const validKeys: Key[] = [
    "type",
    "illnessType",
    "depId",
    "illnessDesc",
    "illnessTime",
    "consultFlag",
    "patientId"
  ];
  const valid = validKeys.every((key) => store.consult[key] !== undefined);
  if (!valid) {
    return showDialog({
      title: "温馨提示",
      message: "问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！",
      closeOnPopstate: false
    }).then(() => {
      router.push("/");
    });
  }
  loadData();
  loadPatient();
});

// 是否同意协议变量
const agree = ref(false);
//弹窗
const show = ref(false);
const orderId = ref("");
const loading = ref(false);
const paymentMethod = ref<0 | 1>();
//支付
const submit = async () => {
  if (!agree.value) return showToast("请选勾选支付协议");
  loading.value = true;
  // 在这里现在不仅仅是弹窗, 还需要生成一张订单, 准备给钱
  const { data } = await createConsultOrder(store.consult);
  loading.value = false;
  orderId.value = data.id;
  show.value = true;
};
// 禁止后退
onBeforeRouteLeave(() => {
  if (orderId.value) return false;
});
//点击遮罩层,二次确认是否离开
const clickMask = () => {
  showConfirmDialog({
    title: "关闭支付",
    message: "取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？",
    cancelButtonText: "仍要关闭",
    confirmButtonText: "继续支付"
  }).catch(() => {
    //如果不想付款,清空订单号,跳到列表即可
    orderId.value = "";
    router.push("/user/consult");
  });
};
// 跳转支付
const pay = async () => {
  if (paymentMethod.value === undefined) return showToast("请选择支付方式");
  showLoadingToast({ message: "跳转支付", duration: 0 });
  const res = await getConsultOrderPayUrl({
    orderId: orderId.value,
    paymentMethod: paymentMethod.value,
    payCallback: "http://127.0.0.1:5173//room"
  });
  window.location.href = res.data.payUrl;
};
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />
    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      :close-on-click-overlay="false"
      @click-overlay="clickMask"
    >
      <div class="pay-type">
        <p class="amount">￥20.00</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="pay">立即支付</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
