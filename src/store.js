import Vue from 'vue';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

import createStore from '@scaife-viewer/store';

Vue.use(Vuex);

const client = new ApolloClient({
  uri:
    process.env.VUE_APP_ATLAS_GRAPHQL_ENDPOINT ||
    'https://explorehomer-atlas-dev.scaife-viewer.org/graphql/',
});
const apolloProvider = new VueApollo({
  defaultClient: client,
});

const scaifeStore = createStore(client);

export default new Vuex.Store({
  modules: {
    [scaifeStore.namespace]: scaifeStore.store,
  },
});
export { apolloProvider };
