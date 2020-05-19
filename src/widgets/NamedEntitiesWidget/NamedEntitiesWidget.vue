<template>
  <div class="named-entities">
    <a href @click.prevent="selected = null">Clear</a>
    <NamedEntity
      v-for="entity in entities"
      :key="entity.id"
      :entity="entity"
      :selected="selected === entity"
      @select="onSelect"
    />
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { URN } from '@scaife-viewer/scaife-widgets';
  import { MODULE_NS } from '@/reader/constants';
  import NamedEntity from './NamedEntity.vue';

  export default {
    scaifeConfig: {
      displayName: 'Named Entities',
    },
    data() {
      return {
        selected: null,
      };
    },
    components: {
      NamedEntity,
    },
    methods: {
      onSelect(entity) {
        this.selected = entity;
      },
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
  }
</style>
