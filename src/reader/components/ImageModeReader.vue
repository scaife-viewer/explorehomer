<template>
  <ApolloQuery
    class="image-mode"
    :class="showImage"
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
        <ImageViewerToolbar :show="showImage" @show="onShowImage" />
        <div class="image-mode-container" v-if="showImage === 'both'">
          <Reader
            :lines="data.lines"
            :textSize="textSize"
            :textWidth="textWidth"
          />
          <ImageViewer
            v-if="data.imageIdentifier"
            :imageIdentifier="data.imageIdentifier"
          />
          <EmptyMessage class="reader-empty-annotations" v-else />
        </div>
        <Reader
          v-else-if="showImage === 'text'"
          :lines="data.lines"
          :textSize="textSize"
          :textWidth="textWidth"
        />
        <ImageViewer
          v-else-if="showImage === 'image' && data.imageIdentifier"
          :imageIdentifier="data.imageIdentifier"
        />
        <EmptyMessage class="reader-empty-annotations" v-else />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';

  import ImageViewer from '@/components/ImageViewer.vue';
  import ImageViewerToolbar from '@/components/ImageViewerToolbar.vue';
  import Reader from './Reader.vue';
  import { IMAGE_VIEWER_STATE_BOTH } from '@/constants';

  export default {
    readerConfig: {
      label: 'Folio Images',
      layout: 'wide',
    },
    props: {
      queryVariables: Object,
      textSize: String,
      textWidth: String,
    },
    components: {
      ImageViewer,
      ImageViewerToolbar,
      Reader,
    },
    data() {
      return {
        showImage: IMAGE_VIEWER_STATE_BOTH,
      };
    },
    computed: {
      query() {
        return gql`
          query Folios($urn: String!) {
            passageTextParts(reference: $urn) {
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
                        lemma
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
        `;
      },
    },
    methods: {
      onShowImage(kind) {
        this.showImage = kind;
      },
      queryUpdate(data) {
        const lines = data.passageTextParts.edges.map(line => {
          const { id, kind, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef, lemma } = edge.node;
            return { value, veRef, lemma };
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
    },
  };
</script>

<style lang="scss" scoped>
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
