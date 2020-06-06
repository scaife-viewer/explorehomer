<template>
  <article class="u-flex">
    <section class="reader-left">
      <div class="reader-container u-flex">
        <Paginator :urn="previous" direction="left" />
        <LoaderBall v-if="gqlLoading" />
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

  import WIDGETS_NS, { Paginator, URN } from '@scaife-viewer/scaife-widgets';
  import Reader from '@/reader/components/Reader.vue';
  import { SET_PASSAGE, UPDATE_METADATA } from '@/constants';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    components: {
      Paginator,
      Reader,
    },
    scaifeConfig: {},
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
          const { id, kind, ref } = line.node;
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
          return { id, kind, ref, tokens };
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
    ::v-deep .paginator {
      align-self: flex-start;
      a {
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: calc(100vh - 30px);
        align-items: center;
        font-size: 36px;
        &:hover {
          background: $gray-100;
        }
      }
    }
  }
</style>

