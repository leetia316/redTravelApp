import Vue from 'vue';
import Vuex from 'vuex';

import tabBar from './modules/tabBar';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  mutations: {
    //
  },
  actions: {

  },
  modules: {
    tabBar,
    user,
  }
});

export default store;
