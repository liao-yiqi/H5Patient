<script setup lang="ts">
import type { KnowledgeType, KnowledgeList } from "@/types/consult";
import KnowledgeCard from "./KnowledgeCard.vue";
import { ref } from "vue";
import { getKnowledgeList } from "@/services/consult";
const props = defineProps<{
  type: KnowledgeType;
}>();
const current = ref(1);
const pageSize = 10;
const list = ref<KnowledgeList>([]);
const loading = ref(false);
const finished = ref(false);
let pageTotal = 0;
const onLoad = async () => {
  const { data } = await getKnowledgeList({
    current: current.value,
    pageSize,
    type: props.type
  });
  list.value = [...list.value, ...data.rows];
  // 将正在读取状态, 改回 false ,等待下一次的滚动到底部再次触发
  loading.value = false;
  // 看看当前的页码是否已经大于总页数
  // 将页码+1
  current.value++;
  // 记录总页数
  pageTotal = data.pageTotal;
  // 如果当前页码已经大于总页数, 就要停止加载
  if (current.value > pageTotal) finished.value = true;
};
</script>

<template>
  <div class="knowledge-list">
    <VanList
      @load="onLoad"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
    >
      <knowledge-card :item="item" v-for="item in list" :key="item.id" />
    </VanList>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
