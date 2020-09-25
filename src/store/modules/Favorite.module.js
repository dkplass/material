const state = {
  favoriteQty: 0,
  favoriteClass: "",
  favorite: []
};

const actions = {
  getFavorite({ commit }) {
    // -- axios get data --
    // -- get from localstorage --
    commit("GetFavorite");
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
    state.favorite = JSON.parse(localList);
  },
  CountFavorite(state) {
    state.favoriteQty = state.favorite.length;
  },
  HandleFavorite(state, payload) {
    const list = state.favorite;

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
  }
};

const getters = {
  favoriteQty(state) {
    return state.favoriteQty;
  },
  favorite(state) {
    return state.favorite;
  }
};

export const Favorite = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
