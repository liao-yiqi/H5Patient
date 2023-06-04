<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllDep } from "@/services/consult";
import type { DeptList } from "@/types/consult";
import { useConsultStore } from "@/stores/modules/consult";
const store = useConsultStore();
const list = ref<DeptList>([]);
const active = ref(0);
onMounted(async () => {
  const { data } = await getAllDep();
  list.value = data;
});
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item :title="item.name" v-for="item in list" />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          @click="store.setDep(item.id)"
          to="/consult/illness"
          v-for="item in list[active]?.child"
          >{{ item.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
