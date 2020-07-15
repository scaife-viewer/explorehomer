<template>
  <ApolloQuery
    :class="`entity-mode map-direction-${showMap}`"
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
          v-if="canShowMap"
          :showMap="showMap"
          @show="onShowMap"
        />
        <div class="entity-mode-container">
          <Reader
            class="entity-reader"
            :lines="data.lines"
            :textSize="textSize"
            :textWidth="textWidth"
          />
          <div class="map" v-if="showMap && canShowMap">
            <SelectableEntityMap
              :key="`${showMap}-${sidebars}`"
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
  import { MAP_STATE_NONE, MAP_STATE_HORIZONTAL } from '@/constants';

  export default {
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
        showMap: MAP_STATE_NONE,
      };
    },
    watch: {
      coordinatesList: {
        immediate: true,
        handler() {
          this.showMap = this.canShowMap
            ? MAP_STATE_HORIZONTAL
            : MAP_STATE_NONE;
        },
      },
    },
    methods: {
      onShowMap(kind) {
        this.showMap = kind;
      },
      queryUpdate(data) {
        const { edges: parts } = data.passageTextParts;
        const lines = parts.map(line => {
          const { id, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef, namedEntities } = edge.node;
            const entities = namedEntities.edges.map(e => e.node.id);
            return {
              value,
              veRef,
              entities,
            };
          });
          return {
            id,
            ref,
            tokens,
          };
        });
        const coordinatesList = parts.map(line => {
          return line.node.tokens.edges.map(token => {
            return token.node.namedEntities.edges
              .map(namedEntity => namedEntity.node)
              .filter(node => node.kind === 'PLACE' && node.data.coordinates)
              .map(node => {
                return [
                  ...node.data.coordinates
                    .split(', ')
                    .map(coordinate => parseFloat(coordinate)),
                  node.id,
                  node.title,
                ];
              });
          });
        });
        return {
          lines,
          coordinatesList: coordinatesList.flat().flat(),
        };
      },
    },
    computed: {
      canShowMap() {
        return this.coordinatesList && this.coordinatesList.length > 0;
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
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  ref
                  tokens {
                    edges {
                      node {
                        veRef
                        value
                        namedEntities {
                          edges {
                            node {
                              id
                              title
                              kind
                              data
                            }
                          }
                        }
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
