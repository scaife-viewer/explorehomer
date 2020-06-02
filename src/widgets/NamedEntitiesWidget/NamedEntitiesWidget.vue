<template>
  <div class="named-entities">
    <Lookahead
      placeholder="Filter named entities"
      :reducer="lookaheadReducer"
      :data="entities"
      @filter-data="onFilter"
    />
    <NamedEntity
      v-for="entity in filteredEntities"
      :key="entity.id"
      :entity="entity"
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
  import { SELECT_NAMED_ENTITIES, CLEAR_NAMED_ENTITIES } from '../../constants';
  import NamedEntity from './NamedEntity.vue';

  export default {
    scaifeConfig: {
      displayName: 'Named Entities',
    },
    data() {
      return {
        filteredEntities: [],
      };
    },
    components: {
      Lookahead,
      NamedEntity,
    },
    methods: {
      onSelect(entity) {
        if (this.selectedEntities.filter(id => entity.id === id).length > 0) {
          this.$store.dispatch(CLEAR_NAMED_ENTITIES);
        } else {
          this.$store.dispatch(SELECT_NAMED_ENTITIES, {
            entities: [entity.id],
          });
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
        },
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
      selectedEntities() {
        return this.$store.state.selectedNamedEntities;
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
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
