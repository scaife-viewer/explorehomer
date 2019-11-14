import { READER_STORE_NS } from './constants';

export default function createStore() {
  return {
    namespace: READER_STORE_NS,
    store: {
      namespaced: true,
      state: {},
      mutations: {},
      actions: {},
    },
  };
}
