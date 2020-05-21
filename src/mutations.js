import {
  FETCH_METADATA,
  FETCH_LIBRARY,
  SET_PASSAGE,
  SET_DISPLAY_MODE_INTERLINEAR,
  SET_DISPLAY_MODE_NAMED_ENTITIES,
  SET_DISPLAY_MODE_DEFAULT,
} from '@/constants';

export default {
  [SET_DISPLAY_MODE_NAMED_ENTITIES]: state => {
    state.displayMode = 'named-entities';
  },
  [SET_DISPLAY_MODE_INTERLINEAR]: state => {
    state.displayMode = 'interlinear';
  },
  [SET_DISPLAY_MODE_DEFAULT]: state => {
    state.displayMode = 'default';
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
