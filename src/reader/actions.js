import { SELECT_TOKEN, CLEAR_TOKEN } from './constants';

export default {
  [CLEAR_TOKEN]: ({ commit }) => commit(CLEAR_TOKEN),
  [SELECT_TOKEN]: ({ commit }, { token }) => {
    commit(SELECT_TOKEN, token);
  },
};
