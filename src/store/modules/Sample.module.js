import axios from "axios";
import router from "@/router";

const state = {
  queryText: "",
  sampleList: []
};

const actions = {
  getSamples({ commit }, value) {
    // query by tag condition
    const api = `${process.env.VUE_APP_BASE_API}/api/Sample/SampleFilterByTag`;

    commit("loading", true, { root: true });

    // router.push({ name: "main" }).catch(error => error);

    if (value.length === 0) {
      commit("clearSamples");
    }

    axios
      .post(api, value)
      .then(response => {
        const result = response.data.Resource;
        const parseResult = JSON.parse(result);
        commit("storeSamples", parseResult);
        commit("loading", false, { root: true });
      })
      .catch(console.error());
  },
  querySamples({ commit }, value) {
    // query by text condition
    const api = `${process.env.VUE_APP_BASE_API}/api/Sample/SearchSamples`;

    commit("clearSamples");
    commit("loading", true, { root: true });

    router.push({ name: "main" }).catch(error => error);

    axios
      .post(api, value)
      .then(response => {
        const result = response.data.Resource;
        const parseResult = JSON.parse(result);
        commit("storeSamples", parseResult);
        commit("saveQueryText", value.value);
        commit("loading", false, { root: true });
      })
      .catch(console.error());
  }
};

const mutations = {
  storeSamples(state, payload) {
    state.sampleList = payload;
  },
  clearSamples(state) {
    state.sampleList.length = 0;
  },
  saveQueryText(state, payload) {
    state.queryText = payload;
  },
  clearQueryText(state) {
    state.queryText = "";
  }
};

const getters = {
  retrieveSamples(state) {
    return state.sampleList;
  },
  queryText(state) {
    return state.queryText;
  }
};

export const Sample = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
