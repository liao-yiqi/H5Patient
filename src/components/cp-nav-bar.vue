<script setup lang="ts">
import { useRouter } from "vue-router";
defineProps<{
  title?: string;
  rightText?: string;
}>();
const emit = defineEmits<{
  (e: "click-right"): void;
}>();
const router = useRouter();
const onClickLeft = () => {
  // TODO 点击左侧返回按钮
  // 判断历史记录中是否有回退
  if (history.state?.back) {
    router.back();
  } else {
    router.push("/");
  }
};
const onClickRight = () => {
  // TODO 点击右侧文字按钮
  emit("click-right");
};
</script>

<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
