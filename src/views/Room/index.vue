<script setup lang="ts">
import RoomStatus from "./components/RoomStatus.vue";
import RoomMessage from "./components/RoomMessage.vue";
import RoomAction from "./components/RoomAction.vue";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import { baseURL } from "@/utils/request";
import { useUserStore } from "@/stores";
import { useRoute } from "vue-router";
import type { ConsultOrderItem, Image } from "@/types/consult";
import { MsgType } from "@/enums";
import type { Message, TimeMessages } from "@/types/room";
import { getConsultOrderDetail } from "@/services/consult";
import { OrderType } from "@/enums";
let socket: Socket;
const store = useUserStore();
const route = useRoute();
const list = ref<Message[]>([]);
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
  //消息记录
  socket.on("chatMsgList", ({ data }: { data: TimeMessages[] }) => {
    //准备转换常规消息列表
    const arr: Message[] = [];
    data.forEach((item, index) => {
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      });
      arr.push(...item.items);
    });
    //追加到聊天消息列表
    list.value.unshift(...arr);
  });
});
onUnmounted(() => {
  // 每当跳出页面, 主动关闭
  socket.close();
});
//订单状态
const consult = ref<ConsultOrderItem>();
const getConsult = async () => {
  //进来的时候确定获取一次订单状态
  const { data } = await getConsultOrderDetail(route.query.orderId as string);
  consult.value = data;
  console.log("订单状态", data);
};
onMounted(async () => {
  getConsult();
  //检测订单状态变化
  socket.on("statusChange", getConsult);
});
// 聊天相关
// 发送文字
const sendText = (text: string) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit("sendChatMsg", {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  });
};
//发送图片
const sendImage = (img: Image) => {
  socket.emit("sendChatMsg", {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  });
};
// 在页面进来的时候就要开始监听聊天新消息的获取
onMounted(() => {
  socket.on("receiveChatMsg", async (event) => {
    list.value.push(event);
    await nextTick();
    setTimeout(() => {
      // 每次有新消息, 都要滑动到页面最底部
      window.scrollTo(0, document.body.scrollHeight);
    }, 200);
  });
});
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <room-message :list="list" />
    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
