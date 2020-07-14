import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri:
    process.env.VUE_APP_ATLAS_GRAPHQL_ENDPOINT ||
    'https://explorehomer-atlas-dev.scaife-viewer.org/graphql/',
});

export default client;
