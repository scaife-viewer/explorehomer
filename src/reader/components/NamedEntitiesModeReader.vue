<template>
  <ApolloQuery
    :class="`entity-mode map-direction-${mapState}`"
    :query="query"
    :variables="queryVariables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <template v-else>
        <EntityMapToolbar
          v-if="data.coordinatesList.length > 0"
          :mapState="mapState"
          @show="onShowMap"
        />
        <div class="entity-mode-container">
          <Reader
            class="entity-reader"
            :lines="data.lines"
            :textSize="textSize"
            :textWidth="textWidth"
          />
          <div class="map" v-if="showMap && data.coordinatesList.length > 0">
            <SelectableEntityMap
              :key="`${mapState}-${sidebars}`"
              :coordinates-list="data.coordinatesList"
            />
          </div>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';

  import SelectableEntityMap from '@/components/SelectableEntityMap.vue';
  import EntityMapToolbar from '@/components/EntityMapToolbar.vue';
  import Reader from './Reader.vue';
  import { MAP_STATE_NONE } from '@/constants';

  export default {
    readerConfig: {
      label: 'Named Entities',
      layout: 'normal',
      textWidth: 'normal',
    },
    props: {
      queryVariables: Object,
      textSize: String,
      textWidth: String,
    },
    components: {
      SelectableEntityMap,
      EntityMapToolbar,
      Reader,
    },
    data() {
      return {
        mapState: MAP_STATE_NONE,
      };
    },
    methods: {
      onShowMap(kind) {
        this.mapState = kind;
      },
      getTokenLookup(entities) {
        const tokenLookup = {};
        entities.forEach(entity => {
          const tokenVeRefs = entity.tokens.edges.map(t => t.node.veRef);
          tokenVeRefs.forEach(veRef => {
            tokenLookup[veRef] = tokenLookup[veRef] || [];
            tokenLookup[veRef].push(entity.id);
          });
        });
        return tokenLookup;
      },
      queryUpdate(data) {
        const entities = data.entities.edges.map(e => e.node);
        const parts = data.textParts.edges;

        const tokenLookup = this.getTokenLookup(entities);
        const lines = parts.map(line => {
          const { id, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef, lemma } = edge.node;
            return {
              value,
              veRef,
              lemma,
              entities: tokenLookup[veRef],
            };
          });
          return {
            id,
            ref,
            tokens,
          };
        });
        const coordinatesList = entities
          .filter(entity => entity.kind === 'PLACE' && entity.data.coordinates)
          .map(entity => {
            return [
              ...entity.data.coordinates
                .split(', ')
                .map(coordinate => parseFloat(coordinate)),
              entity.id,
              entity.title,
            ];
          });
        return {
          lines,
          coordinatesList,
        };
      },
    },
    computed: {
      showMap() {
        return this.mapState !== MAP_STATE_NONE;
      },
      sidebars() {
        // used for keys to force map redraw on sidebar changes
        const { leftOpen, rightOpen } = this.$store.state.scaifeSkeleton;
        if (leftOpen && rightOpen) {
          return 'both';
        }
        if (leftOpen) {
          return 'left';
        }
        if (rightOpen) {
          return 'right';
        }
        return 'neither';
      },
      query() {
        return gql`
          query NamedEntities($urn: String!) {
            textParts: passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  ref
                  tokens {
                    edges {
                      node {
                        id
                        veRef
                        value
                        lemma
                      }
                    }
                  }
                }
              }
            }
            entities: namedEntities(reference: $urn) {
              edges {
                node {
                  id
                  title
                  kind
                  data
                  tokens {
                    edges {
                      node {
                        id
                        veRef
                      }
                    }
                  }
                }
              }
            }
          }
        `;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .entity-mode {
    flex: 1;
    &.map-direction-horizontal {
      .entity-mode-container {
        grid-template-columns: 1fr 1fr;
        column-gap: 0.75rem;
      }
    }
    &.map-direction-vertical {
      .entity-mode-container {
        grid-template-rows: 1fr 1fr;
        row-gap: 0.75rem;
      }
    }
    .entity-mode-container {
      display: grid;
      height: calc(100vh - 75px - 3rem);
      .entity-reader {
        overflow-y: scroll;
      }
    }
  }
</style>
