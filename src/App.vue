<script setup lang="ts">
import { request } from "@/utils/request";
import type { User } from "./types/user";
import { onMounted } from "vue";
onMounted(async () => {
  const res = await request<User>("/login/password", "POST", {
    mobile: "13211112222",
    // 密码 abc123456 测试：出现非10000的情况
    password: "abc12345"
  });
  console.log(res.data.token);
});
</script>

<template>
  <router-view></router-view>
</template>
<style lang="scss" scoped></style>
