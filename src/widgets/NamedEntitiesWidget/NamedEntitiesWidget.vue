<template>
  <div class="named-entities">
    <Lookahead
      placeholder="Search named entities"
      :reducer="lookaheadReducer"
      :data="entities"
      @filter-data="onFilter"
    />
    <NamedEntity
      v-for="entity in filteredEntities"
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
  // eslint-disable-next-line max-len
  import Lookahead from '@scaife-viewer/scaife-widgets/src/components/Lookahead.vue';
  import { MODULE_NS } from '@/reader/constants';
  import NamedEntity from './NamedEntity.vue';

  export default {
    scaifeConfig: {
      displayName: 'Named Entities',
    },
    data() {
      return {
        selected: null,
        filteredEntities: [],
      };
    },
    components: {
      Lookahead,
      NamedEntity,
    },
    methods: {
      onSelect(entity) {
        if (this.selected === entity) {
          this.selected = null;
        } else {
          this.selected = entity;
        }
      },
      onFilter(data) {
        this.filteredEntities = data;
      },
      lookaheadReducer(data, query) {
        return data.filter(entity =>
          entity.title.toLowerCase().includes(query.toLowerCase()),
        );
      },
    },
    watch: {
      entities: {
        immediate: true,
        handler() {
          this.filteredEntities = this.entities;
        }
      }
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
    font-size: 12px;
    width: calc(100% - 4rem);
  }
</style>
