const state = {
  user: null
};

const actions = {
  setUser(context, status) {
    context.commit("SetUser", status);
  },
  clearUser(context) {
    context.commit("ClearUser");
  }
};

const mutations = {
  SetUser(state, status) {
    state.user = status;
  },
  ClearUser(state) {
    state.user = null;
  }
};

export const User = {
  namespaced: true,
  state,
  actions,
  mutations
};
