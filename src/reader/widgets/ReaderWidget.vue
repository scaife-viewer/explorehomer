<template>
  <article class="u-flex">
    <section class="reader-left">
      <Metadata :metadata="metadata" />
      <div class="reader-container u-flex">
        <Paginator :urn="previous" direction="left" />
        <Reader :lines="lines" :textSize="textSize" :textWidth="textWidth" />
        <Paginator :urn="next" direction="right" />
      </div>
    </section>
  </article>
</template>

<script>
  import gql from 'graphql-tag';

  import URN from '@/scaife-widgets/urn';
  import Reader from '@/reader/components/Reader.vue';
  import Metadata from '@/scaife-widgets/components/Metadata.vue';
  import Paginator from '@/scaife-widgets/components/Paginator.vue';
  import { MODULE_NS as WIDGETS_NS } from '@/scaife-widgets/constants';
  import { MODULE_NS, SET_PASSAGE } from '@/reader/constants';

  export default {
    components: {
      Metadata,
      Paginator,
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
      urn() {
        return this.$route.query.urn ? new URN(this.$route.query.urn) : null;
      },
      gqlQuery() {
        if (this.urn) {
          this.$store.dispatch(`${MODULE_NS}/${SET_PASSAGE}`, {
            urn: this.urn.absolute,
          });
          return gql`
            {
              passageLines(reference: "${this.urn.absolute}") {
              metadata
              edges {
                node {
                  id
                  label
                  ref
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
      metadata() {
        return this.$store.getters[`${MODULE_NS}/metadata`];
      },
      textSize() {
        return this.$store.getters[`${WIDGETS_NS}/readerTextSize`];
      },
      textWidth() {
        return this.$store.getters[`${WIDGETS_NS}/readerTextWidth`];
      },
      lines() {
        return this.gqlData
          ? this.gqlData.passageLines.edges.map(line => line.node)
          : [];
      },
      siblings() {
        return this.gqlData && this.gqlData.passageLines.metadata.siblings
          ? this.gqlData.passageLines.metadata.siblings
          : null;
      },
      previous() {
        return this.siblings && this.siblings.previous
          ? new URN(this.siblings.previous)
          : null;
      },
      next() {
        return this.siblings && this.siblings.next
          ? new URN(this.siblings.next)
          : null;
      },
    },
  };
</script>

<style lang="scss">
  @import '@/_utilities.scss';
  @import '@/_variables.scss';
  article {
    margin: 0 5em;
    width: 100%;
  }
  section {
    width: 100%;
  }
  .reader-container {
    align-items: baseline;
    justify-content: left;
    & nav:last-child {
      margin-left: auto;
    }
  }
</style>
