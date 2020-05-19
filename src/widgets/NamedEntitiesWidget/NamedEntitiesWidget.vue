<template>
  <div class="named-entities">
    <div class="named-entity" v-for="entity in entities" :key="entity.id">
      <div class="named-entity-title">{{ entity.title }}</div>
      <div class="named-entity-description">{{ entity.description }}</div>
      <a :href="entity.url" target="_blank">Read More</a>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { URN } from '@scaife-viewer/scaife-widgets';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    scaifeConfig: {
      displayName: 'Named Entities',
    },
    computed: {
      // TODO: Dedupe from Reader.vue
      urn() {
        return this.$route.query.urn
          ? new URN(this.$route.query.urn)
          : this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
      },
      // TODO: Dedupe from Reader.vue
      gqlQuery() {
        if (this.urn) {
          return gql`
          {
            namedEntities(reference:"${this.urn.absolute}") {
              edges {
                node {
                  id
                  title
                  description
                  url
                }
              }
            }
          }
          `;
        }
        return null;
      },
      entities() {
        return this.gqlData
          ? this.gqlData.namedEntities.edges.map(e => e.node)
          : [];
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../styles/variables';
  .named-entities {
    margin: 0 2rem;
    color: $gray-600;
    font-size: 12px;
    width: calc(100% - 4rem);

    .named-entity {
      margin-bottom: 1rem;
    }
    .named-entity-title {
      font-size: 14px;
      color: $gray-800;
    }
  }
</style>
