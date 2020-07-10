import ApolloClient from 'apollo-boost';
import LoaderBall from './components/LoaderBall.vue';

const client = new ApolloClient({
  uri:
    process.env.VUE_APP_ATLAS_GRAPHQL_ENDPOINT ||
    'https://explorehomer-atlas-dev.scaife-viewer.org/graphql/',
});

const GraphQLPlugin = {
  install: Vue => {
    Vue.mixin({
      components: { LoaderBall },
      data: () => ({
        gqlLoading: false,
        gqlData: null,
        gqlError: false,
        gqlErrorObject: null,
      }),
      computed: {
        gqlQuery: () => null,
      },
      watch: {
        gqlQuery: {
          immediate: true,
          handler() {
            if (this.gqlQuery) {
              this.gqlLoading = true;
              this.$gql(this.gqlQuery)
                .then(data => {
                  this.gqlData = data;
                  this.gqlLoading = false;
                  this.gqlErrorObject = null;
                  this.gqlError = false;
                })
                .catch(e => {
                  this.gqlErrorObject = e;
                  this.gqlError = true;
                  this.gqlLoading = false;
                  this.gqlData = null;
                });
            }
          },
        },
      },
    });

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$gql = q =>
      client.query({ query: q }).then(data => data.data);
  },
};

export { client as gqlclient };
export default GraphQLPlugin;
