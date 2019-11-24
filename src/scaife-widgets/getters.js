import URN from './urn';

export default {
  initialPassage: state => new URN(state.initialPassage),
  metadata: (state, getters, rootState, rootGetters) => rootGetters.metadata,
  passage: state => new URN(state.passage),
  readerTextSize: state => state.readerTextSize,
  readerTextWidth: state => state.readerTextWidth,
};
