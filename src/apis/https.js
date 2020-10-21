import store from "@/store";
import axios from "axios";
import router from "../router/index";
import { tip } from "./utils";

/**
 * 請求失敗的統一處理
 * @param { Number } status 請求失敗的狀態碼
 *
 */

const errorHandle = (status, msg) => {
  switch (status) {
    case 400:
      // 登入失敗
      tip(msg);
      break;
    case 401:
      // 未登入或認證過期
      if (router.currentRoute == "Login") {
        console.log("Login Page");
      } else {
        store.dispatch("Authenticate/setAuth", {
          token: "",
          isLogin: false
        });

        tip(msg);

        // setTimeout(() => {
        //   toLogin();
        // }, 1000);
      }
      break;
    case 403:
      // 權限不足
      tip(msg);
      break;
    case 404:
      // 請求失敗
      tip(msg);
      break;
    default:
      // 為定義錯誤
      console.log("response 沒有定義的錯誤碼" + msg);
  }
};

// axios 實例
var instance = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_API}`
});

// request 攔截器
instance.interceptors.request.use(
  config => {
    const token = store.state.Authenticate.token;
    token && (config.headers.Authoriaztion = `${token}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response 攔截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { response } = error;

    if (response) {
      // 成功請求但回應錯誤
      errorHandle(response.status, response.data);
      return Promise.reject(error);
    } else {
      if (!window.navigator.onLine) {
        // 網路問題
        tip("您的網路目前有問題，請確認連線");
      } else {
        return Promise.reject(error);
      }
    }
  }
);

export default function(method, url, data = null) {
  method = method.toLowerCase();

  if (method == "post") {
    return instance.post(url, data);
  } else if (method == "get") {
    return instance.get(url);
  } else if (method == "delete") {
    return instance.delete(url, { params: data });
  } else if (method == "put") {
    return instance.put(url, data);
  } else {
    console.error(`未定義的method：${method}`);
    return false;
  }
}
