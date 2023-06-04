import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({
  showSpinner: false
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //登录
    {
      path: "/Login",
      name: "Login",
      component: () => import("../views/Login/index.vue"),
      meta: { title: "登录" }
    },
    //底部导航
    {
      path: "/",
      component: () => import("@/views/Layout/index.vue"),
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: () => import("@/views/Home/index.vue"),
          meta: { title: "首页" }
        },
        {
          path: "/article",
          component: () => import("@/views/Article/index.vue"),
          meta: { title: "健康百科" }
        },
        {
          path: "/notify",
          component: () => import("@/views/Notify/index.vue"),
          meta: { title: "消息通知" }
        },
        {
          path: "/user",
          component: () => import("@/views/User/index.vue"),
          meta: { title: "个人中心" }
        }
      ]
    },
    //家庭档案
    {
      path: "/user/patient",
      component: () => import("@/views/User/PatientPage.vue"),
      meta: { title: "家庭档案" }
    },
    {
      path: "/consult/fast",
      component: () => import("@/views/Consult/ConsultFast.vue"),
      meta: { title: "极速问诊" }
    }
  ]
});
//前置路由守卫
router.beforeEach((to) => {
  //加载进度
  NProgress.start();
  // 用户仓库
  const store = useUserStore();
  // 不需要登录的页面，白名单
  const wihteList = ["/login"];
  // 如果没有登录且不在白名单内，去登录
  if (!store.user?.token && !wihteList.includes(to.path)) return "/login";
  // 否则不做任何处理
});
//后置路由守卫
router.afterEach((to) => {
  document.title = `${to.meta.title}-优医问诊`;
  NProgress.done();
});
export default router;
