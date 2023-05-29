// import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";
import "vant/lib/index.css";
import "./styles/main.scss";
const app = createApp(App);
const pinia = createPinia();
//使用数据持久化插件
pinia.use(persist);
app.use(pinia);
app.use(router);

app.mount("#app");
