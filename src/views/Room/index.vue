<script setup lang="ts">
import RoomStatus from "./components/RoomStatus.vue";
import RoomMessage from "./components/RoomMessage.vue";
import RoomAction from "./components/RoomAction.vue";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { onMounted, onUnmounted } from "vue";
import { baseURL } from "@/utils/request";
import { useUserStore } from "@/stores";
import { useRoute } from "vue-router";
let socket: Socket;
const store = useUserStore();
const route = useRoute();
onMounted(() => {
  //挂在周期链接
  socket = io(baseURL, {
    auth: {
      token: "Bearer " + store.user?.token
    },
    query: {
      orderId: route.query.orderId
    }
  });
  //监听链接成功
  socket.on("connect", () => {
    console.log("链接ws成功");
  });
  //监听报错
  socket.on("error", () => {
    console.log("报错");
  });
  //监听断开
  socket.on("disconnect", () => {
    console.log("链接ws已断开");
  });

  //开始监听
  socket.on("chatMsgList", (res) => {
    console.log("接收到消息");
    console.log(res);
  });
});
onUnmounted(() => {
  // 每当跳出页面, 主动关闭
  socket.close();
});
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <room-status />
    <room-message />
    <room-action />
  </div>
</template>
