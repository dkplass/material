import Vue from "vue";
import { ToastPlugin } from "bootstrap-vue";
import router from "../router/index";

Vue.use(ToastPlugin);

/**
 * 錯誤msg消息提示函數
 * @param {*} msg
 */
export const tip = msg => {
  this.$bvToast.toast(`${msg}`, {
    title: "Message",
    autoHideDelay: 5000
  });
};

/**
 * 跳轉回首頁
 * 攜帶當前頁面路由，登入完成後跳轉原本頁面
 */
export const toLogin = () => {
  router.replace({
    name: "login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};

export const to403Page = () => {
  router.replace({
    name: "login"
  });
};
