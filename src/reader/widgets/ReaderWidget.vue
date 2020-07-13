<template>
  <article class="u-flex">
    <section class="reader-left">
      <h2 v-if="passageTitle" class="reader-heading main-widget-heading">
        {{ passageTitle }}
      </h2>
      <div class="reader-container u-flex">
        <Paginator :urn="previous" direction="left" />
        <LoaderBall v-if="gqlLoading" />
        <div class="image-mode" :class="showImage" v-else-if="imageMode">
          <LoaderBall v-if="$apollo.queries.imageModeData.loading" />
          <template v-else>
            <ImageViewerToolbar :show="showImage" @show="onShowImage" />
            <div class="image-mode-container" v-if="showImage === 'both'">
              <Reader
                :lines="imageModeData.lines"
                :textSize="textSize"
                :textWidth="textWidth"
              />
              <ImageViewer
                v-if="imageModeData.imageIdentifier"
                :imageIdentifier="imageModeData.imageIdentifier"
              />
              <EmptyMessage class="reader-empty-annotations" v-else />
            </div>
            <Reader
              v-else-if="showImage === 'text'"
              :lines="imageModeData.lines"
              :textSize="textSize"
              :textWidth="textWidth"
            />
            <ImageViewer
              v-else-if="showImage === 'image' && imageModeData.imageIdentifier"
              :imageIdentifier="imageModeData.imageIdentifier"
            />
            <EmptyMessage class="reader-empty-annotations" v-else />
          </template>
        </div>
        <template v-else-if="alignmentMode">
          <LoaderBall v-if="$apollo.queries.alignmentModeData.loading" />
          <EmptyMessage
            class="reader-empty-annotations"
            v-else-if="alignmentModeData.length === 0"
          />
          <Alignments
            v-else
            :alignments="alignmentModeData"
            :textSize="textSize"
            :textWidth="textWidth"
          />
        </template>
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
  import EmptyMessage from '@/components/EmptyMessage.vue';
  import ImageViewer from '@/components/ImageViewer.vue';
  import ImageViewerToolbar from '@/components/ImageViewerToolbar.vue';
  import Paginator from '@/components/Paginator.vue';
  import {
    SET_PASSAGE,
    UPDATE_METADATA,
    IMAGE_VIEWER_STATE_BOTH,
  } from '@/constants';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    components: {
      Alignments,
      EmptyMessage,
      Paginator,
      Reader,
      ImageViewer,
      ImageViewerToolbar,
    },
    scaifeConfig: {},
    data() {
      return {
        showImage: IMAGE_VIEWER_STATE_BOTH,
      };
    },
    methods: {
      onShowImage(kind) {
        this.showImage = kind;
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
      urn() {
        this.$nextTick(() => {
          this.$parent.$el.scrollTop = 0;
        });
      },
      versionMetadata: {
        immediate: true,
        handler() {
          if (!this.versionMetadata) {
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
          return data.textAlignmentChunks.edges.map(e => e.node.items);
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
              pageInfo {
                hasNextPage
                endCursor
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
          const lines = data.passageTextParts.edges.map(line => {
            const { id, kind, ref } = line.node;
            const tokens = line.node.tokens.edges.map(edge => {
              const { value, veRef } = edge.node;
              return { value, veRef };
            });
            return { id, kind, ref, tokens };
          });
          return {
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
    },
    computed: {
      alignmentMode() {
        return this.$store.state.displayMode === 'sentence-alignments';
      },
      imageMode() {
        return this.$store.state.displayMode === 'folio';
      },
      urn() {
        return this.$route.query.urn
          ? new URN(this.$route.query.urn)
          : this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
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
      versionMetadata() {
        return this.$store.state.metadata;
      },
      passageTitle() {
        return this.versionMetadata ? this.versionMetadata.label : null;
      },
      passageMetadata() {
        return this.gqlData && this.gqlData.passageTextParts.metadata
          ? this.gqlData.passageTextParts.metadata
          : null;
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
  ::v-deep .reader-empty-annotations {
    text-align: center;
    margin-top: 1rem;
  }
  .image-mode {
    flex: 1;
    &.both {
      .image-mode-container {
        grid-template-columns: 1fr 1fr;
        column-gap: 0.75rem;
      }
    }
    &.text,
    &.image {
      .image-mode-container {
        grid-template-columns: 1fr;
      }
    }
    .image-mode-container {
      display: grid;
      height: calc(100vh - 75px);
    }
  }
</style>
