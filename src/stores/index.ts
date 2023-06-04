import { createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";

// 创建pinia实例
const pinia = createPinia();
// 使用pinia插件
//使用数据持久化插件
pinia.use(persist);
// 导出pinia实例，给main使用
export default pinia;

export * from "./modules/user";
export * from "./modules/consult";
