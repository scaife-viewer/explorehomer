import {
  FETCH_METADATA,
  FETCH_LIBRARY,
  SET_PASSAGE,
  SET_DISPLAY_MODE_INTERLINEAR,
  SET_DISPLAY_MODE_DEFAULT,
} from '@/constants';

export default {
  [SET_DISPLAY_MODE_INTERLINEAR]: state => {
    state.interlinear = true;
  },
  [SET_DISPLAY_MODE_DEFAULT]: state => {
    state.interlinear = false;
  },
  [FETCH_METADATA]: (state, metadata) => {
    state.metadata = metadata;
  },
  [FETCH_LIBRARY]: (state, libraryTree) => {
    state.libraryTree = libraryTree;
  },
  [SET_PASSAGE]: (state, urn) => {
    state.passage = urn;
  },
};
