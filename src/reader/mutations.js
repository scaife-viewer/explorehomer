import { SELECT_TOKEN, CLEAR_TOKEN } from './constants';

export default {
  [SELECT_TOKEN]: (state, token) => {
    state.selectedToken = token;
  },
  [CLEAR_TOKEN]: state => {
    state.selectedToken = null;
  },
};
