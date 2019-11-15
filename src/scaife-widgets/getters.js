export default {
  initialPassage: state => state.initialPassage,
  metadata: (state, getters, rootState, rootGetters) => rootGetters.metadata,
  passage: state => state.passage,
  readerTextSize: state => state.readerTextSize,
  readerTextWidth: state => state.readerTextWidth,
};
