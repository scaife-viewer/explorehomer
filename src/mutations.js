import { FETCH_METADATA } from './constants';

export default {
  [FETCH_METADATA]: (state, metadata) => {
    state.metadata = metadata;
  },
};
