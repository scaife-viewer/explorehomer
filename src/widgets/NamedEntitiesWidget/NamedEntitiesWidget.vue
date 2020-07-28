<template>
  <div class="named-entities" :key="urn.absolute">
    <LoaderBall v-if="$apollo.queries.entities.loading" />
    <EmptyMessage v-else-if="entities.length === 0" />
    <template v-else>
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
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
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
      urn() {
        return this.$store.getters.urn;
      },
      selectedEntities() {
        return this.$store.state.selectedNamedEntities;
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
    },
    apollo: {
      entities: {
        query: gql`
          query NamedEntities($urn: String!) {
            namedEntities(reference: $urn) {
              edges {
                node {
                  id
                  title
                  description
                  url
                  kind
                  data
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.namedEntities.edges.map(e => e.node);
        },
      },
    },
  };
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>

<style lang="scss" scoped>
  @import '../../styles/variables';
  .named-entities {
    margin: 0 2rem;
    font-size: 12px;
    width: calc(100% - 4rem);
  }
</style>
