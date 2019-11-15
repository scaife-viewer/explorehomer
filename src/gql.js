import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri:
    process.env.VUE_APP_ATLAS_GRAPHQL_ENDPOINT
    || 'https://explorehomer-atlas.herokuapp.com/graphql/',
});

const GraphQLPlugin = {
  install: (Vue) => {
    Vue.mixin({
      data: () => ({ gqlData: null }),
      computed: {
        gqlQuery: () => null,
      },
      watch: {
        gqlQuery: {
          immediate: true,
          handler() {
            if (this.gqlQuery) {
              this.$gql(this.gqlQuery).then((data) => {
                this.gqlData = data;
              });
            }
          },
        },
      },
    });

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$gql = q => client.query({ query: q }).then(data => data.data);
  },
};

export { client as gqlclient };
export default GraphQLPlugin;
