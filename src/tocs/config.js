import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';
import { MODULE_NS } from './constants';

export default function createStore() {
  return {
    namespace: MODULE_NS,
    store: {
      namespaced: true,
      state: {
        ...state,
      },
      actions: {
        ...actions,
      },
      mutations: {
        ...mutations,
      },
      getters: {
        ...getters,
      },
    },
  };
}
