import Vue from 'vue';
import Vuex from 'vuex';

import { createStore as createSkeletonStore } from 'scaife-skeleton';
// eslint-disable-next-line import/no-named-default
import { default as createReaderStore } from './reader/config';
// eslint-disable-next-line import/no-named-default
import { default as createWidgetsStore } from './scaife-widgets/config';

import createStore from './config';

Vue.use(Vuex);

const readerStore = createReaderStore();
const widgetsStore = createWidgetsStore();
const skeletonStore = createSkeletonStore();

export default new Vuex.Store({
  modules: {
    [readerStore.namespace]: readerStore.store,
    [widgetsStore.namespace]: widgetsStore.store,
    [skeletonStore.namespace]: skeletonStore.store,
  },
  ...createStore(),
});
