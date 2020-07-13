<template>
  <article class="u-flex">
    <section class="reader-left">
      <h2 v-if="passageTitle" class="reader-heading main-widget-heading">
        {{ passageTitle }}
      </h2>
      <div class="reader-container u-flex">
        <Paginator :urn="previous" direction="left" />
        <LoaderBall v-if="$apollo.loading" />
        <ImageModeReader
          v-else-if="imageMode"
          :text-size="textSize"
          :text-width="textWidth"
          :loading="$apollo.queries.imageModeData.loading"
          :data="imageModeData"
        />
        <AlignmentsModeReader
          v-else-if="alignmentMode"
          :text-size="textSize"
          :text-width="textWidth"
          :loading="$apollo.queries.alignmentModeData.loading"
          :data="alignmentModeData.alignments"
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
  import Paginator from '@/components/Paginator.vue';
  import { SET_PASSAGE, UPDATE_METADATA } from '@/constants';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    components: {
      Paginator,
      Reader,
      AlignmentsModeReader,
      ImageModeReader,
    },
    scaifeConfig: {},
    methods: {
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
          return this.alignmentMode === false;
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
          return this.imageMode === false;
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
          const { metadata } = data.passageTextParts;
          const lines = data.passageTextParts.edges.map(line => {
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
          return { metadata, lines };
        },
      },
    },
    computed: {
      displayMode() {
        return this.$store.state.displayMode;
      },
      alignmentMode() {
        return this.displayMode === 'sentence-alignments';
      },
      imageMode() {
        return this.displayMode === 'folio';
      },
      interlinearMode() {
        return this.displayMode === 'interlinear';
      },
      metricalMode() {
        return this.displayMode === 'metrical';
      },
      namedEntitiesMode() {
        return this.displayMode === 'named-entities';
      },
      defaultMode() {
        return this.displayMode === 'default';
      },
      urn() {
        return this.$route.query.urn
          ? new URN(this.$route.query.urn)
          : this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
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
        if (this.imageMode) {
          data = this.imageModeData;
        }
        if (this.alignmentMode) {
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
