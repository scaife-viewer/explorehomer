<template>
  <article class="u-flex">
    <section class="reader-left">
      <div class="reader-container u-flex">
        <Paginator :urn="previous" direction="left" />
        <LoaderBall v-if="gqlLoading" />
        <template v-else-if="imageMode">
          <Reader :lines="lines" :textSize="textSize" :textWidth="textWidth" />
          <ImageViewer
            v-if="imageIdentifier"
            :imageIdentifier="imageIdentifier"
          />
          <div class="no-image-annotations" v-else>
            No image annotations were found for the selected passage.
          </div>
        </template>
        <Alignments
          v-else-if="alignmentMode"
          :alignments="alignments"
          :textSize="textSize"
          :textWidth="textWidth"
        />
        <div
          v-else-if="namedEntitiesMode"
          class="entity-mode"
          :class="`map-direction-${showMap ? showMap : 'none'}`"
        >
          <div class="toolbar">
            <a
              href
              :class="{ active: showMap === null }"
              @click.prevent="noMap"
            >
              No map
            </a>
            <a
              href
              :class="{ active: showMap === 'vertical' }"
              @click.prevent="vMap"
            >
              Vertical Map
            </a>
            <a
              href
              :class="{ active: showMap === 'horizontal' }"
              @click.prevent="hMap"
            >
              Horizontal Map
            </a>
          </div>
          <div class="entity-mode-container">
            <Reader
              class="entity-reader"
              :lines="lines"
              :textSize="textSize"
              :textWidth="textWidth"
            />
            <div class="map" v-if="showMap">
              <EntityMap :coordinates-list="coordinatesList" />
            </div>
          </div>
        </div>
        <Reader
          v-else
          :lines="lines"
          :textSize="textSize"
          :textWidth="textWidth"
        />
        <Paginator :urn="next" direction="right" />
      </div>
    </section>
  </article>
</template>

<script>
  import gql from 'graphql-tag';

  import WIDGETS_NS, { URN } from '@scaife-viewer/scaife-widgets';
  import Reader from '@/reader/components/Reader.vue';
  import Alignments from '@/reader/components/Alignments.vue';
  import ImageViewer from '@/components/ImageViewer.vue';
  import Paginator from '@/components/Paginator.vue';
  import EntityMap from '@/components/EntityMap.vue';
  import { SET_PASSAGE, UPDATE_METADATA } from '@/constants';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    components: {
      Alignments,
      Paginator,
      Reader,
      ImageViewer,
      EntityMap,
    },
    scaifeConfig: {},
    data() {
      return {
        showMap: null, // null | horizontal | vertical
      };
    },
    methods: {
      noMap() {
        this.showMap = null;
      },
      vMap() {
        this.showMap = 'vertical';
      },
      hMap() {
        this.showMap = 'horizontal';
      },
    },
    watch: {
      urn() {
        this.$nextTick(() => {
          this.$parent.$el.scrollTop = 0;
        });
      },
    },
    beforeUpdate() {
      if (this.urn && !this.$route.query.urn) {
        this.$router.push({
          to: 'reader',
          query: {
            urn: this.urn.toString(),
          },
        });
      }
      if (this.version !== this.urn.version) {
        this.$store.dispatch(
          UPDATE_METADATA,
          { urn: this.urn.version },
          { root: true },
        );
      }
    },
    computed: {
      alignmentMode() {
        return this.$store.state.displayMode === 'sentence-alignments';
      },
      imageMode() {
        return this.$store.state.displayMode === 'folio';
      },
      namedEntitiesMode() {
        return this.$store.state.displayMode === 'named-entities';
      },
      imageIdentifier() {
        return this.gqlData && this.gqlData.imageAnnotations.edges.length
          ? this.gqlData.imageAnnotations.edges[0].node.imageIdentifier
          : null;
      },
      urn() {
        return this.$route.query.urn
          ? new URN(this.$route.query.urn)
          : this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
      },
      coordinatesList() {
        return this.gqlData.passageTextParts.edges.map(e => {
          return e.node.tokens.edges.map(te => {
            return te.node.namedEntities.edges
              .map(ne => ne.node)
              .filter(n => n.kind === 'PLACE' && n.data.coordinates)
              .map(n => {
                return n.data.coordinates.split(', ').map(c => parseFloat(c));
              });
          });
        }).flat().flat();
      },
      gqlQuery() {
        if (this.urn) {
          this.$store.dispatch(
            SET_PASSAGE,
            { urn: this.urn.toString() },
            { root: true },
          );
          return gql`
            {
              passageTextParts(reference: "${this.urn}") {
              metadata
              edges {
                node {
                  id
                  kind
                  urn
                  ref
                  metricalAnnotations {
                    edges {
                      node {
                        metricalPattern
                        htmlContent
                      }
                    }
                  }
                  tokens {
                    edges {
                      node {
                        veRef
                        value
                        position
                        lemma
                        partOfSpeech
                        tag
                        namedEntities {
                          edges {
                            node {
                              id
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
              pageInfo {
                hasNextPage
                endCursor
              }
            }
            textAlignmentChunks(reference: "${this.urn}") {
              edges {
                node {
                  items
                }
              }
            }
            imageAnnotations(reference: "${this.urn}") {
              edges {
                node {
                  idx
                  imageIdentifier
                  textParts {
                    edges {
                      node {
                        ref
                      }
                    }
                  }
                }
              }
            }
          }
          `;
        }
        return null;
      },
      version() {
        return this.$store.getters[`${MODULE_NS}/firstPassageUrn`].version;
      },
      workTitle() {
        return this.$store.getters[`${MODULE_NS}/workTitle`];
      },
      textSize() {
        return this.$store.getters[`${WIDGETS_NS}/readerTextSize`];
      },
      textWidth() {
        return this.$store.getters[`${WIDGETS_NS}/readerTextWidth`];
      },
      alignments() {
        if (!this.gqlData) {
          return [];
        }
        return this.gqlData.textAlignmentChunks.edges.map(e => e.node.items);
      },
      lines() {
        if (!this.gqlData) {
          return [];
        }
        return this.gqlData.passageTextParts.edges.map(line => {
          const { id, kind, ref, metricalAnnotations } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const {
              value,
              veRef,
              position,
              lemma,
              partOfSpeech,
              tag,
              namedEntities,
            } = edge.node;
            const entities = namedEntities.edges.map(e => e.node.id);
            return {
              value,
              veRef,
              position,
              lemma,
              partOfSpeech,
              tag,
              entities,
            };
          });
          return {
            id,
            kind,
            ref,
            tokens,
            metricalAnnotations: metricalAnnotations.edges.map(e => e.node),
          };
        });
      },
      siblings() {
        return this.gqlData && this.gqlData.passageTextParts.metadata.siblings
          ? this.gqlData.passageTextParts.metadata.siblings
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

<style lang="scss" scoped>
  article {
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
    ::v-deep .ball-pulse {
      margin-left: auto;
      padding-top: 40px;
    }
  }
  .no-image-annotations {
    font-size: 0.8em;
    font-style: italic;
  }

  .entity-mode {
    flex: 1;
    .map-direction-none {

    }
    &.map-direction-horizontal {
      .entity-mode-container {
        grid-template-columns: 1fr 1fr;
        // flex-direction: column;
        // max-height: calc(100vh - 100px);
        .map {
          // flex: 1;
        }
      }
    }
    &.map-direction-vertical {
      .entity-mode-container {
        // flex-direction: row;
        grid-template-rows: 1fr 1fr;
        .map {
          // flex: 1;
        }
      }
    }
    .toolbar {
      a.active {
        font-weight: 700;
        padding: 0 1rem;
      }
    }
    .entity-mode-container {
      display: grid;
      height: calc(100vh - 75px);
      .entity-reader {
        overflow-y: scroll;
      }
      .map {
      }
    }
  }
</style>

