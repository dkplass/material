import axios from "axios";

const state = {
  favoriteQty: 0,
  favoriteClass: "",
  favorite: [],
  favoriteSamples: []
};

const actions = {
  getFavorite({ commit }) {
    // -- axios get data --
    // -- get from localstorage --
    commit("GetFavorite");
  },
  getFavoriteSamples({ commit }) {
    // const api = `${process.env.VUE_APP_BASE_API}/api/Sample/SampleFilterByTag`;
    const api = `${process.env.VUE_APP_BASE_API}/Sample/Get`;
    const storeFavorite = state.favorite || [];

    commit("ClearFavoriteSamples");

    commit("loading", true, { root: true });

    axios
      .get(api)
      .then(response => {
        const result = response.data;

        const filter = result.filter(item => {
          return storeFavorite.includes(item.SampleNo);
        });

        commit("SetFavoriteSamples", filter);
        commit("loading", false, { root: true });
      })
      .catch(console.error());
  },
  handleFavorite({ commit }, value) {
    // 添加 favorite
    // 更新 localstorage 或是 寫回資料庫
    commit("HandleFavorite", value);
  },
  clearFavorite({ commit }) {
    commit("ClearFavorite");
  },
  isFavorite() {}
};

const mutations = {
  GetFavorite(state) {
    const localList = window.localStorage.getItem("favorite");
    state.favorite = localList === false ? [] : JSON.parse(localList);
  },
  SetFavoriteSamples(state, payload) {
    state.favoriteSamples = payload;
  },
  CountFavorite(state) {
    state.favoriteQty = state.favorite.length || 0;
  },
  HandleFavorite(state, payload) {
    const list = state.favorite || [];

    const place = list.indexOf(payload);

    if (place > -1) {
      list.splice(place, 1);
    } else {
      list.push(payload);
    }

    state.favorite = list;

    localStorage.setItem("favorite", JSON.stringify(state.favorite));
  },
  ClearFavorite(state) {
    state.favorite.length = 0;

    localStorage.setItem("favorite", JSON.stringify(state.favorite));
  },
  ClearFavoriteSamples(state) {
    state.favoriteSamples = [];
  }
};

const getters = {
  favoriteQty(state) {
    return state.favoriteQty;
  },
  favorite(state) {
    return state.favorite || [];
  },
  favoriteSamples(state) {
    return state.favoriteSamples;
  }
};

export const Favorite = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
