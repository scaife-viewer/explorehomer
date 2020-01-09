export default {
  workTitle: (state, getters, rootState, rootGetters) => rootGetters.workTitle,
  workUrn: (state, getters, rootState, rootGetters) => rootGetters.workUrn,
  firstPassageUrn: (state, getters, rootState, rootGetters) =>
    rootGetters.firstPassageUrn,
  passage: (state, getters, rootState, rootGetters) => rootGetters.passage,
};
