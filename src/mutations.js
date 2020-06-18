import {
  FETCH_METADATA,
  FETCH_LIBRARY,
  SET_PASSAGE,
  SET_DISPLAY_MODE_METRICAL,
  SET_DISPLAY_MODE_INTERLINEAR,
  SET_DISPLAY_MODE_NAMED_ENTITIES,
  SET_DISPLAY_MODE_FOLIO,
  SET_DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  SET_DISPLAY_MODE_DEFAULT,
  SELECT_NAMED_ENTITIES,
  CLEAR_NAMED_ENTITIES,
  STOP_AUDIO,
  PLAY_AUDIO,
} from '@/constants';

export default {
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
  [SET_DISPLAY_MODE_METRICAL]: state => {
    state.displayMode = 'metrical';
  },
  [SET_DISPLAY_MODE_SENTENCE_ALIGNMENTS]: state => {
    state.displayMode = 'sentence-alignments';
  },
  [SET_DISPLAY_MODE_NAMED_ENTITIES]: state => {
    state.displayMode = 'named-entities';
  },
  [SET_DISPLAY_MODE_INTERLINEAR]: state => {
    state.displayMode = 'interlinear';
  },
  [SET_DISPLAY_MODE_DEFAULT]: state => {
    state.displayMode = 'default';
  },
  [SET_DISPLAY_MODE_FOLIO]: state => {
    state.displayMode = 'folio';
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
