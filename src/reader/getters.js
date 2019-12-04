import URN from '@/scaife-widgets/urn';

export default {
  workUrn: (state, getters, rootState, rootGetters) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    (rootGetters.metadata ? new URN(rootGetters.metadata.workUrn) : null),
  workTitle: (state, getters, rootState, rootGetters) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    (rootGetters.metadata ? rootGetters.metadata.workTitle : ''),
  firstPassageUrn: (state, getters, rootState, rootGetters) =>
    // prettier-ignore
    // eslint-disable-next-line implicit-arrow-linebreak
    (rootGetters.metadata
      ? new URN(rootGetters.metadata.firstPassageUrn)
      : null),
  passage: state => (state.passage ? new URN(state.passage) : null),
};
