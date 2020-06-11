<template>
  <div class="scholia">
    <div v-if="!lines">No commentary found.</div>
    <div v-for="line in lines" :key="line.idx" class="line">
      <span class="lemma">{{ line.lemma }} </span>
      <span class="comment">{{ line.comment }}</span>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { URN } from '@scaife-viewer/scaife-widgets';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    scaifeConfig: {
      displayName: 'Scholia',
      location: 'sidebar',
      singleton: true,
    },
    computed: {
      urn() {
        return this.$route.query.urn
          ? new URN(this.$route.query.urn)
          : this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
      },
      lines() {
        return (
          this.gqlData &&
          this.gqlData.textAnnotations.edges.map(e => {
            return {
              idx: e.node.idx,
              dse: e.node.data.dse,
              comment: e.node.data.comment,
              lemma: e.node.data.lemma,
              references: e.node.data.references,
            }
          })
        );
      },
      gqlQuery() {
        if (this.urn) {
          return gql`
          {
            textAnnotations(reference: "${this.urn}") {
              edges {
                node {
                  idx
                  data
                }
              }
            }
          }
          `;
        }
        return null;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .scholia {
    margin: 0 2em;
  }
  .line {
    font-family: $font-family-serif;
    font-size: 14px;
    .lemma {
      font-weight: 700;
    }
    margin-bottom: 10px;
  }
</style>
