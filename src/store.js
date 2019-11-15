import Vue from 'vue';
import Vuex from 'vuex';

import { createStore as createSkeletonStore } from 'scaife-skeleton';
// TODO: This will go away when a full module... just to keep alias symmetry.
// eslint-disable-next-line import/no-named-default
import { default as createReaderStore } from './scaife-widgets/config';

import createStore from './config';

Vue.use(Vuex);

const readerStore = createReaderStore();
const skeletonStore = createSkeletonStore();

export default new Vuex.Store({
  modules: {
    [readerStore.namespace]: readerStore.store,
    [skeletonStore.namespace]: skeletonStore.store,
  },
  ...createStore(),
});
