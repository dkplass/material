import axios from "axios";

const state = {
  tagList: [],
  isTagExisted: false
};

const actions = {
  getTags({ commit }) {
    const api = `${process.env.VUE_APP_BASE_API}/api/TagList/GetList`;

    axios
      .get(api)
      .then(response => {
        const tagList = response.data.Resource;
        commit("setList", tagList);
      })
      .catch(error => console.log(error));
  }
};

const mutations = {
  setList(state, payload) {
    state.tagList = payload;
  }
};

const getters = {
  getTagList(state) {
    return state.tagList;
  },
  hasTag: state => tagName => {
    return state.tagList.some(tag => tag.TagName.trim() === tagName);
  }
};

export const TagList = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
