<script setup lang="ts">
import { evaluateConsultOrder } from "@/services/consult";
import type { ConsultOrderItem } from "@/types/consult";
import type { EvaluateDoc } from "@/types/room";
import { showToast } from "vant";
import type { Ref } from "vue";
import { computed, inject, ref } from "vue";

// 完成评价后修改数据函数的依赖注入
const completeEva = inject<(score: number) => void>("completeEva");

const score = ref(0);
const anonymousFlag = ref(false);
const content = ref("");
const disabled = computed(() => !score.value || !content.value);

const onSubmit = async () => {
  if (!score.value) return showToast("请选择评分");
  if (!content.value) return showToast("请输入评价");

  if (!consult?.value) return showToast("未找到订单");
  if (consult.value.docInfo?.id) {
    await evaluateConsultOrder({
      docId: consult.value?.docInfo?.id,
      orderId: consult.value?.id,
      score: score.value,
      content: content.value,
      anonymousFlag: anonymousFlag.value ? 1 : 0
    });
    // 调用依赖注入, 修改最外层页面数据
    completeEva && completeEva(score.value);
  }
};
defineProps<{
  evaluateDoc?: EvaluateDoc;
}>();

// 订单数据注入
const consult = inject<Ref<ConsultOrderItem>>("consult");
</script>

<template>
  <!-- 已评价显示评价结果 -->
  <div class="evaluate-card" v-if="evaluateDoc">
    <p class="title">感谢您的评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evaluateDoc.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>

  <!-- 未评价显示评价框 -->
  <div class="evaluate-card" v-else>
    <p class="title">请您进行评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      v-model="score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
    <van-field
      v-model="content"
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button @click="onSubmit" type="primary" size="small" round :class="{ disabled }">
        提交评价
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.evaluate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;

  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }

  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }

  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    :deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }

        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }

        height: 16px;
      }

      .van-button {
        padding: 0 16px;

        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
