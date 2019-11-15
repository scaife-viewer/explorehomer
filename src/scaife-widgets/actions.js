import { SET_PASSAGE, SET_TEXT_SIZE, SET_TEXT_WIDTH } from './constants';

export default {
  [SET_PASSAGE]: ({ commit }, { urn }) => commit(SET_PASSAGE, urn),
  [SET_TEXT_SIZE]: ({ commit }, { size }) => commit(SET_TEXT_SIZE, size),
  [SET_TEXT_WIDTH]: ({ commit }, { width }) => commit(SET_TEXT_WIDTH, width),
};
