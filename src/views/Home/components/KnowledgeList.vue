<script setup lang="ts">
import type { KnowledgeType, KnowledgeList } from "@/types/consult";
import KnowledgeCard from "./KnowledgeCard.vue";
import { ref, onMounted } from "vue";
import { getKnowledgeList } from "@/services/consult";
const props = defineProps<{
  type: KnowledgeType;
}>();
const current = ref(1);
const pageSize = 10;
const list = ref<KnowledgeList>();
onMounted(async () => {
  const { data } = await getKnowledgeList({
    current: current.value,
    pageSize,
    type: props.type
  });
  list.value = data.rows;
});
</script>

<template>
  <div class="knowledge-list">
    <knowledge-card :item="item" v-for="item in list" :key="item.id"></knowledge-card>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
