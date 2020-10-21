import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { Authenticate } from "./modules/authenticate.module";
import { User } from "./modules/User.module";
import { TagList } from "./modules/TagList.module";
import { Sample } from "./modules/Sample.module";
import { Favorite } from "./modules/Favorite.module";
import { FilePath } from "./modules/FilePath.module";
import { SampleColor } from "./modules/SampleColor.module";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    isLoading: false,
    isQueryMode: false,
    isLoginModal: false
  },
  actions: {
    updateLoading(context, status) {
      context.commit("loading", status);
    },
    toggleQueryMode(context) {
      context.commit("queryMode", status);
    },
    toggleLoginModal(context) {
      context.commit("toggleLoginModal");
    }
  },
  mutations: {
    loading(state, status) {
      state.isLoading = status;
    },
    queryMode(state, status) {
      state.isQueryMode = status;
    },
    toggleLoginModal(state) {
      state.isLoginModal = !state.isLoginModal;
    }
  },
  getters: {
    loading(state) {
      return state.isLoading;
    },
    queryMode(state) {
      return state.isQueryMode;
    },
    loginModal(state) {
      return state.isLoginModal;
    }
  },
  modules: {
    Authenticate,
    User,
    TagList,
    Sample,
    Favorite,
    FilePath,
    SampleColor
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      paths: ["Authenticate", "User"]
    })
  ]
});
