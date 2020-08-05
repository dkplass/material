import Vue from "vue";
import Vuex from "vuex";
import { TagList } from "./modules/TagList.module";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {},
  mutations: {},
  actions: {},
  modules: {
    TagList
  }
});
