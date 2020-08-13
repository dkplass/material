import axios from "axios";

const state = {
  tagList: [],
  slectedTags: ["Recycled"],
  isTagExisted: false
};

const actions = {
  getTags({ commit }) {
    const api = `${process.env.VUE_APP_BASE_API}/api/TagList/GetTag`;

    axios
      .get(api)
      .then(response => {
        const tagList = response.data.Resource;
        const res = JSON.parse(tagList);
        commit("setList", res);
      })
      .catch(console.error());
  }
};

const mutations = {
  setList(state, payload) {
    state.tagList = payload;
  },
  setSlectedTags(state, payload) {
    state.slectedTags = payload;
  }
};

const getters = {
  getTagList(state) {
    return state.tagList;
  },
  getSlectedTags(state) {
    return state.slectedTags;
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
