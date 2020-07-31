import {
  FETCH_METADATA,
  FETCH_LIBRARY,
  SET_PASSAGE,
  SET_DISPLAY_MODE,
  SELECT_NAMED_ENTITIES,
  CLEAR_NAMED_ENTITIES,
  STOP_AUDIO,
  PLAY_AUDIO,
  SELECT_LINE,
} from '@/constants';

export default {
  [SELECT_LINE]: (state, ref) => {
    state.selectedLine = ref;
  },
  [STOP_AUDIO]: state => {
    state.nowPlaying = null;
  },
  [PLAY_AUDIO]: (state, ref) => {
    state.nowPlaying = ref;
  },
  [SELECT_NAMED_ENTITIES]: (state, entities) => {
    state.selectedNamedEntities = entities;
  },
  [CLEAR_NAMED_ENTITIES]: state => {
    state.selectedNamedEntities = [];
  },
  [SET_DISPLAY_MODE]: (state, mode) => {
    state.displayMode = mode;
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
