<script setup lang="ts">
import type { Message } from "@/types/room";
import { MsgType } from "@/enums";

import { IllnessTime } from "@/enums";
import { flagOptions, timeOptions } from "@/services/constants";
import dayjs from "dayjs";
import { useUserStore } from "@/stores";
const store = useUserStore();
const formatTime = (time: string) => dayjs(time).format("HH:mm");
defineProps<{ list: Message[] }>();

// 后端给出来的数据中, 就诊与否, 和患病时间都是数字枚举, 这里封装函数进行转换
const getIllnessTimeText = (time: IllnessTime) =>
  timeOptions.find((item) => item.value === time)?.label;

const getConsultFlagText = (flag: 0 | 1) => flagOptions.find((item) => item.value === flag)?.label;
</script>

<template>
  <template v-for="{ msgType, msg, createTime, from, fromAvatar } in list">
    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
        <p>
          {{ msg.consultRecord.patientInfo.name }}
          {{ msg.consultRecord.patientInfo.genderValue }}
          {{ msg.consultRecord.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord.illnessTime) }} |
          {{ getConsultFlagText(msg.consultRecord.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <!-- <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)"> 点击查看 </van-col> -->
      </van-row>
    </div>
    <!-- 温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通用通知 -->
    <div class="msg msg-tip" v-if="msgType === 31">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 我发的消息 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user?.avatar" />
    </div>

    <!-- 医生发的消息 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 我发的图片 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 医生发的图片 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
    </div>
  </template>
</template>
<style lang="scss" scoped>
@import "@/styles/room.scss";
</style>
