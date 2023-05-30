// import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./stores";
import router from "./router";
import "virtual:svg-icons-register";
// 样式全局使用
import "vant/lib/index.css";
// 记得自定义样式一定要写在组件库样式后面, 覆盖默认样式
import "@/styles/main.scss";
const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#app");
