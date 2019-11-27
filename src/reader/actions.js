import { SET_PASSAGE } from './constants';

export default {
  [SET_PASSAGE]: ({ commit }, { urn }) => commit(SET_PASSAGE, urn),
};
