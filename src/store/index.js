import Vue from "vue";
import Vuex from "vuex";
import { TagList } from "./modules/TagList.module";
import { Sample } from "./modules/Sample.module";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    isLoading: false
  },
  actions: {
    updateLoading(context, status) {
      context.commit("loading", status);
    }
  },
  mutations: {
    loading(state, status) {
      state.isLoading = status;
    }
  },
  getters: {
    loading(state) {
      return state.isLoading;
    }
  },
  modules: {
    TagList,
    Sample
  }
});
