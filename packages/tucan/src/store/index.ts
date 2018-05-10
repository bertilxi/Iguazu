import Vue from "vue";
import * as Vuex from "vuex";

import * as actions from "./actions";

Vue.use(Vuex);

const state = {};
const defaults = {
  actions,
  mutations: {
    SET_STATE(mState, { key, value }) {
      mState[key] = value;
    }
  },
  state
};
export const createStore = (options: Vuex.StoreOptions<any>) => {
  const config = Object.assign({}, defaults, options);
  return new Vuex.Store(config);
};
