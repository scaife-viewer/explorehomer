import { SET_PASSAGE } from './constants';

export default {
  [SET_PASSAGE]: (state, urn) => {
    state.passage = urn;
  },
};
