<template>
  <div class="new-alexandria-widget u-widget u-flex">
    <NewAlexandria :comments="comments" :key="passage" />
  </div>
</template>

<script>
  import qs from 'querystring';
  import WIDGETS_NS from '@scaife-viewer/scaife-widgets';
  import NewAlexandria from './NewAlexandria.vue';

  export default {
    name: 'NewAlexandriaWidget',
    scaifeConfig: {
      displayName: 'New Alexandria Commentary',
    },
    components: {
      NewAlexandria,
    },
    created() {
      if (this.enabled) {
        this.fetchData();
      }
    },
    data() {
      return {
        comments: null,
      };
    },
    watch: {
      passage: 'fetchData',
    },
    computed: {
      enabled() {
        return !!this.passage;
      },
      passage() {
        return this.$store.getters[`${WIDGETS_NS}/passage`];
      },
      endpoint() {
        return 'https://commentary-api.chs.harvard.edu/graphql';
      },
      params() {
        const gqlQuery = `{
          commentsOn(urn: "${this.passage}") {
            _id
            updated
            latestRevision {
              title
              text
            }
            commenters {
              _id
              name
            }
          }
        }`;
        return this.passage ? qs.stringify({ query: gqlQuery }) : null;
      },
      url() {
        return `${this.endpoint}?${this.params}`;
      },
    },
    methods: {
      fetchData() {
        fetch(this.url)
          .then(response => response.json())
          .then(data => {
            this.comments = data.data.commentsOn;
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error.message);
          });
      },
    },
  };
</script>

<style lang="scss">
  .new-alexandria-widget {
    width: 100%;
    img {
      max-width: 100%;
    }
  }
</style>
