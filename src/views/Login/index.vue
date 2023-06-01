<script setup lang="ts">
import { mobileRules, passwordRules, codeRules } from "@/utils/rules";
import { useRoute, useRouter } from "vue-router";
import { loginByPassword, sendMobileCode, loginByCode } from "@/services/user";
import { ref } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import { useUserStore } from "@/stores/modules/user";
import { onUnmounted } from "vue";
const route = useRoute();
const router = useRouter();
const store = useUserStore();
const mobile = ref("13230000001");
const password = ref("abc12345");
const argee = ref(false);
const isPass = ref(true);
const code = ref("");
const time = ref(0);
let timeId: number;
const showPass = ref(false);
const login = async () => {
  // 判断是否勾选用户协议
  if (!argee.value) return showFailToast("请先同意用户协议");
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value);
  //存数据
  store.setUser(res.data);
  //跳转页面
  router.push((route.query.returnUrl as string) || "/");
  // 提示用户
  showSuccessToast("登录成功");
  console.log(res);
};

//发送验证码
const sendCode = async () => {
  if (time.value > 0) return;
  const res = await sendMobileCode(mobile.value, "login");
  showSuccessToast("发送成功");
  code.value = res.data.code;
  console.log(res.data.code);
  time.value = 60;
  timeId = setInterval(() => {
    time.value--;
    if (time.value <= 0) window.clearInterval(timeId);
  }, 1000);
};
onUnmounted(() => {
  window.clearInterval(timeId);
});
</script>

<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册" @click-right="router.push('/')" />
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? "密码登录" : "短信验证码登录" }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ !isPass ? "密码登录" : "短信验证码登录" }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>

    <!-- 表单 -->
    <van-form autocomplete="off" @submit="login">
      <van-field
        :rules="mobileRules"
        v-model="mobile"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="showPass ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon @click="showPass = !showPass" :name="`login-eye-${showPass ? 'on' : 'off'}`" />
        </template>
      </van-field>
      <van-field v-model="code" :rules="codeRules" v-else placeholder="短信验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="sendCode">{{
            time > 0 ? `${time}秒后重新发送` : "发送验证码"
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="argee">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
