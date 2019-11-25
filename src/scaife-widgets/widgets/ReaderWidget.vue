<template>
  <article class="u-flex">
    <section class="reader-left">
      <Metadata :metadata="metadata" />
      <Reader :lines="lines" :textSize="textSize" :textWidth="textWidth" />
    </section>
    <section class="reader-right"></section>
  </article>
</template>

<script>
  import gql from 'graphql-tag';

  import Metadata from '../components/Metadata.vue';
  import Reader from '../components/Reader.vue';
  import URN from '../urn';
  import { MODULE_NS, SET_PASSAGE } from '../constants';

  export default {
    components: {
      Metadata,
      Reader,
    },
    scaifeConfig: {
      location: 'main',
    },
    created() {
      if (!this.urn) {
        this.$router.push({
          to: 'reader',
          query: {
            urn: this.$store.getters[`${MODULE_NS}/initialPassage`].absolute,
          },
        });
      }
    },
    computed: {
      metadata() {
        return this.$store.getters[`${MODULE_NS}/metadata`];
      },
      urn() {
        return this.$route.query.urn ? new URN(this.$route.query.urn) : null;
      },
      gqlQuery() {
        if (this.urn) {
          this.$store.dispatch(`${MODULE_NS}/${SET_PASSAGE}`, {
            urn: this.urn.absolute,
          });
          const { version, reference } = this.urn;
          return gql`
            {
              lines(version_Urn: "${version}", reference: "${reference}") {
              edges {
                node {
                  id
                  label
                  textContent
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
          `;
        }
        return null;
      },
      lines() {
        return this.gqlData
          ? this.gqlData.lines.edges.map(line => line.node)
          : [];
      },
      textSize() {
        return this.$store.getters[`${MODULE_NS}/readerTextSize`];
      },
      textWidth() {
        return this.$store.getters[`${MODULE_NS}/readerTextWidth`];
      },
    },
  };
</script>

<style lang="scss">
  @import '../_utilities.scss';
  @import '../_variables.scss';
  article {
    margin: 0 5em;
    width: 100%;
  }
  section {
    width: 100%;
  }
</style>
