import URN from '@/scaife-widgets/urn';

export default {
  metadata: (state, getters, rootState, rootGetters) => rootGetters.metadata,
  initialPassage: state => new URN(state.initialPassage),
  passage: state => new URN(state.passage),
};
