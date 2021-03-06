import "@babel/polyfill";
import "@webcomponents/webcomponentsjs";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import BootstrapVue from "bootstrap-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueMoment from "vue-moment";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "@google/model-viewer/dist/model-viewer";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./apis/index";
import "@/directive/index";

Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(VueMoment);
Vue.use(VueAwesomeSwiper);

library.add(fas, far, fab);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.prototype.$api = api; // 掛載api到vue原型上

new Vue({
  router,
  store,
  // created() {
  //   router.push({ name: "content", params: { tagName: "TRADITIONAL" } });
  // },
  render: h => h(App)
}).$mount("#app");
