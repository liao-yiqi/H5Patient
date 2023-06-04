<script setup lang="ts">
import type { ConsultIllness } from "@/types/consult";
import { IllnessTime } from "@/enums";
import { ref, computed } from "vue";
import type { UploaderAfterRead, UploaderFileListItem } from "vant/lib/uploader/types";
import { upLoadImgae } from "@/services/consult";
import { useConsultStore } from "@/stores";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useConsultStore();
const timeOptions = [
  { label: "一周内", value: IllnessTime.Week },
  { label: "一月内", value: IllnessTime.Month },
  { label: "半年内", value: IllnessTime.HalfYear },
  { label: "大于半年", value: IllnessTime.More }
];
const flagOptions = [
  { label: "就诊过", value: "0" },
  { label: "没就诊过", value: "1" }
];
const form = ref<ConsultIllness>({
  illnessDesc: "",
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
});
const fileList = ref<UploaderFileListItem[]>([]);
//上传
const onAfterRead: UploaderAfterRead = async (item) => {
  // 类型守卫, 在代码层面保证有且仅有上传一张图片
  if (Array.isArray(item)) return;
  if (!item.file) return;
  //上传前设定图片正在上传的显示状态
  item.status = "uploading";
  item.message = "上传中";
  //发送请求换取在线地址
  const { data } = await upLoadImgae(item.file);
  //上传完毕,将正在上传的状态去除
  item.status = "done";
  item.message = undefined;
  //
  item.url = data.url;
  //将数据同步到form.pictures中
  form.value.pictures?.push({
    ...data
  });
};
//删除
const onDeleteImg = (item: UploaderFileListItem): void => {
  form.value.pictures = form.value.pictures?.filter((pic) => pic.url !== item.url);
};
//数据提交
const disabled = computed(() => {
  return (
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
  );
});
//下一步
const next = () => {
  store.setIllness(form.value);
  router.push("/user/patient?isChange=1");
};
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 收集信息 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="timeOptions" v-model="form.illnessTime" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="flagOptions" v-model="form.consultFlag" />
      </div>
      <div class="illness-img">
        <van-uploader
          upload-icon="photo-o"
          upload-text="上传图片"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          :after-read="onAfterRead"
          @delete="onDeleteImg"
          v-model="fileList"
        />
        <p class="tip">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
      <!-- 下一步按钮 -->
      <van-button :class="{ disabled }" @click="next" type="primary" block round>下一步</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
  .van-button {
    font-size: 16px;
    margin-bottom: 30px;
    &.disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
</style>
