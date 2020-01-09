import { FETCH_METADATA, SET_PASSAGE } from '@/constants';

export default {
  [FETCH_METADATA]: (state, metadata) => {
    state.metadata = metadata;
  },
  [SET_PASSAGE]: (state, urn) => {
    state.passage = urn;
  },
};
