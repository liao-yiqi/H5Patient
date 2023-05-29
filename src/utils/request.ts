import axios from "axios";
import { useUserStore } from "@/stores";
import { showToast } from "vant";
import router from "@/router";
const store = useUserStore();
const instance = axios.create({
  baseURL: "https://consult-api.itheima.net/",
  timeout: 5000
});
//请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (store.user?.token && config.headers) {
      config.headers.Authorization = store.user.token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
//响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.code !== 10000) {
      // 请求成功,数据失败
      showToast({
        message: res.data.message || "请求失败",
        icon: "none"
      });
      return Promise.reject();
    }
    // 完全成功
    return res.data;
  },
  (err) => {
    if (err.response.status === 401) {
      // 删除用户信息
      const store = useUserStore();
      store.delUser();
      // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
      router.push({
        path: "/login",
        query: { returnUrl: router.currentRoute.value.fullPath }
      });
    }
    return Promise.reject(err);
  }
);
