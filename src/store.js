import Vue from 'vue';
import Vuex from 'vuex';

import { createStore as createSkeletonStore } from 'scaife-skeleton';
import createStore from './config';

Vue.use(Vuex);

const skeletonStore = createSkeletonStore();

export default new Vuex.Store({
  modules: {
    [skeletonStore.namespace]: skeletonStore.store,
  },
  ...createStore(),
});
