import Vue from "vue";
import Vuex from "vuex";
import { TagList } from "./modules/TagList.module";
import { Sample } from "./modules/Sample.module";
import { Favorite } from "./modules/Favorite.module";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    isLoading: false,
    isQueryMode: false
  },
  actions: {
    updateLoading(context, status) {
      context.commit("loading", status);
    },
    updateQueryMode(context, status) {
      context.commit("queryMode", status);
    }
  },
  mutations: {
    loading(state, status) {
      state.isLoading = status;
    },
    queryMode(state, status) {
      state.isQueryMode = status;
    }
  },
  getters: {
    loading(state) {
      return state.isLoading;
    },
    queryMode(state) {
      return state.isQueryMode;
    }
  },
  modules: {
    TagList,
    Sample,
    Favorite
  }
});
