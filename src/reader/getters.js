import { URN } from '@scaife-viewer/scaife-widgets';

export default {
  workUrn: (state, getters, rootState, rootGetters) =>
    rootGetters.metadata ? new URN(rootGetters.metadata.workUrn) : null,
  workTitle: (state, getters, rootState, rootGetters) =>
    rootGetters.metadata ? rootGetters.metadata.workTitle : '',
  firstPassageUrn: (state, getters, rootState, rootGetters) =>
    rootGetters.metadata ? new URN(rootGetters.metadata.firstPassageUrn) : null,
  passage: state => (state.passage ? new URN(state.passage) : null),
};
