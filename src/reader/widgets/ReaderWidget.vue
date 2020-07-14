<template>
  <article class="u-flex">
    <section class="reader-left">
      <h2 v-if="passageTitle" class="reader-heading main-widget-heading">
        {{ passageTitle }}
      </h2>
      <div class="reader-container u-flex">
        <Paginator :urn="previous" direction="left" />
        <LoaderBall v-if="$apollo.loading" />
        <ErrorMessage v-else-if="$apollo.error">
          There was an error loading the requested data.
        </ErrorMessage>
        <ImageModeReader
          v-else-if="folioMode"
          :text-size="textSize"
          :text-width="textWidth"
          :loading="$apollo.queries.imageModeData.loading"
          :reader-data="imageModeData"
        />
        <AlignmentsModeReader
          v-else-if="alignmentsMode"
          :text-size="textSize"
          :text-width="textWidth"
          :loading="$apollo.queries.alignmentModeData.loading"
          :reader-data="alignmentModeData.alignments"
        />
        <NamedEntitiesModeReader
          v-else-if="namedEntitiesMode"
          :text-size="textSize"
          :text-width="textWidth"
          :loading="$apollo.queries.namedEntitiesModeData.loading"
          :reader-data="namedEntitiesModeData"
        />
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
  // eslint-disable-next-line max-len
  import AlignmentsModeReader from '@/reader/components/AlignmentsModeReader.vue';
  import ImageModeReader from '@/reader/components/ImageModeReader.vue';
  // eslint-disable-next-line max-len
  import NamedEntitiesModeReader from '@/reader/components/NamedEntitiesModeReader.vue';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import Paginator from '@/components/Paginator.vue';
  import { SET_PASSAGE, UPDATE_METADATA } from '@/constants';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    components: {
      ErrorMessage,
      Paginator,
      Reader,
      AlignmentsModeReader,
      ImageModeReader,
      NamedEntitiesModeReader,
    },
    scaifeConfig: {},
    data() {
      return {
        showMap: null, // null | horizontal | vertical
      };
    },
    methods: {
      onShowMap(kind) {
        this.showMap = kind;
      },
      setVersionMetadata() {
        this.$store.dispatch(
          UPDATE_METADATA,
          { urn: this.urn.version },
          { root: true },
        );
      },
    },
    watch: {
      urn: {
        immediate: true,
        handler() {
          this.$nextTick(() => {
            this.$parent.$el.scrollTop = 0;
          });
          if (this.urn) {
            this.$store.dispatch(
              SET_PASSAGE,
              { urn: this.urn.toString() },
              { root: true },
            );
          }
        },
      },
      versionMetadata: {
        immediate: true,
        handler() {
          if (!this.versionMetadata && this.urn) {
            this.setVersionMetadata();
          }
        },
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
        this.setVersionMetadata();
      }
    },
    apollo: {
      alignmentModeData: {
        query: gql`
          query TextParts($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata
            }
            textAlignmentChunks(reference: $urn) {
              edges {
                node {
                  items
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          const { metadata } = data.passageTextParts;
          return {
            metadata,
            alignments: data.textAlignmentChunks.edges.map(e => e.node.items),
          };
        },
        skip() {
          return this.alignmentsMode === false;
        },
      },
      imageModeData: {
        query: gql`
          query Folios($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata
              edges {
                node {
                  id
                  kind
                  urn
                  ref
                  tokens {
                    edges {
                      node {
                        veRef
                        value
                      }
                    }
                  }
                }
              }
            }
            imageAnnotations(reference: $urn) {
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
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          const { metadata } = data.passageTextParts;
          const lines = data.passageTextParts.edges.map(line => {
            const { id, kind, ref } = line.node;
            const tokens = line.node.tokens.edges.map(edge => {
              const { value, veRef } = edge.node;
              return { value, veRef };
            });
            return { id, kind, ref, tokens };
          });
          return {
            metadata,
            lines,
            imageIdentifier: data.imageAnnotations.edges.length
              ? data.imageAnnotations.edges[0].node.imageIdentifier
              : null,
          };
        },
        skip() {
          return this.folioMode === false;
        },
      },
      interlinearModeData: {
        query: gql`
          query Interlinear($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata
              edges {
                node {
                  id
                  ref
                  tokens {
                    edges {
                      node {
                        veRef
                        value
                        lemma
                        partOfSpeech
                        tag
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
        `,
        update(data) {
          const { metadata } = data.passageTextParts;
          const lines = data.passageTextParts.edges.map(line => {
            const { id, ref } = line.node;
            const tokens = line.node.tokens.edges.map(edge => {
              const {
                value,
                veRef,
                lemma,
                partOfSpeech,
                tag,
                namedEntities,
              } = edge.node;
              const entities = namedEntities.edges.map(e => e.node.id);
              return {
                value,
                veRef,
                lemma,
                partOfSpeech,
                tag,
                entities,
              };
            });
            return {
              id,
              ref,
              tokens,
            };
          });
          return { metadata, lines };
        },
        variables() {
          return { urn: this.urn.absolute };
        },
        skip() {
          return !this.interlinearMode;
        },
      },
      metricalModeData: {
        query: gql`
          query Metrical($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata
              edges {
                node {
                  id
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
                        namedEntities {
                          edges {
                            node {
                              id
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
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        skip() {
          return !this.metricalMode;
        },
        update(data) {
          const { metadata } = data.passageTextParts;
          const lines = data.passageTextParts.edges.map(line => {
            const { id, ref, metricalAnnotations } = line.node;
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
              metricalAnnotations: metricalAnnotations.edges.map(e => e.node),
            };
          });
          return { metadata, lines };
        },
      },
      namedEntitiesModeData: {
        query: gql`
          query NamedEntities($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata
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
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        skip() {
          return !this.namedEntitiesMode && !this.defaultMode;
        },
        update(data) {
          const { metadata, edges: parts } = data.passageTextParts;
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
            metadata,
            lines,
            coordinatesList: coordinatesList.flat().flat(),
          };
        },
      },
    },
    computed: {
      alignmentsMode() {
        return this.$store.getters.alignmentsMode;
      },
      folioMode() {
        return this.$store.getters.folioMode;
      },
      interlinearMode() {
        return this.$store.getters.interlinearMode;
      },
      metricalMode() {
        return this.$store.getters.metricalMode;
      },
      namedEntitiesMode() {
        return this.$store.getters.namedEntitiesMode;
      },
      defaultMode() {
        return this.$store.getters.defaultMode;
      },
      urn() {
        return this.$route.query.urn
          ? new URN(this.$route.query.urn)
          : this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
      },
      coordinatesList() {
        return this.gqlData.passageTextParts.edges
          .map(e => {
            return e.node.tokens.edges.map(te => {
              return te.node.namedEntities.edges
                .map(ne => ne.node)
                .filter(n => n.kind === 'PLACE' && n.data.coordinates)
                .map(n => {
                  return [
                    ...n.data.coordinates.split(', ').map(c => parseFloat(c)),
                    n.id,
                    n.title,
                  ];
                });
            });
          })
          .flat()
          .flat();
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
      lines() {
        if (this.interlinearMode) {
          return this.interlinearModeData.lines;
        }
        if (this.metricalMode) {
          return this.metricalModeData.lines;
        }
        if (this.defaultMode || this.namedEntitiesMode) {
          return this.namedEntitiesModeData.lines;
        }
        return [];
      },
      versionMetadata() {
        return this.$store.state.metadata;
      },
      passageTitle() {
        return this.versionMetadata ? this.versionMetadata.label : null;
      },
      passageMetadata() {
        let data;
        if (this.folioMode) {
          data = this.imageModeData;
        }
        if (this.alignmentsMode) {
          data = this.alignmentModeData;
        }
        if (this.interlinearMode) {
          data = this.interlinearModeData;
        }
        if (this.metricalMode) {
          data = this.metricalModeData;
        }
        if (this.defaultMode || this.namedEntitiesMode) {
          data = this.namedEntitiesModeData;
        }
        return data ? data.metadata : null;
      },
      previous() {
        return this.passageMetadata && this.passageMetadata.previous
          ? new URN(this.passageMetadata.previous)
          : null;
      },
      next() {
        return this.passageMetadata && this.passageMetadata.next
          ? new URN(this.passageMetadata.next)
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
  .reader-heading {
    flex: 1;
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
</style>
