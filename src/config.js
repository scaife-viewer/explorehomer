import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

export default function createStore() {
  return {
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
  };
}
