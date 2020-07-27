<template>
  <ApolloQuery
    class="reader"
    :query="query"
    :variables="queryVariables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage v-else-if="!(data || data.hasAnnotations)" />
      <template v-else>
        <Reader
          :lines="data.lines"
          :text-size="textSize"
          :text-width="textWidth"
        />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';

  import Reader from './Reader.vue';

  export default {
    components: { Reader },
    props: {
      queryVariables: Object,
      textSize: String,
      textWidth: String,
    },
    methods: {
      queryUpdate(data) {
        const lines = data.passageTextParts.edges.map(line => {
          const { id, ref, metricalAnnotations } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef } = edge.node;
            return {
              value,
              veRef,
            };
          });
          return {
            id,
            ref,
            tokens,
            metricalAnnotations: metricalAnnotations.edges.map(e => e.node),
          };
        });
        const hasAnnotations = lines
          .map(line => line.metricalAnnotations)
          .filter(metricalAnnotations => metricalAnnotations.length > 0)
          .filter(metricalAnnotations => metricalAnnotations[0].htmlContent);
        return {
          lines,
          hasAnnotations,
        };
      },
    },
    computed: {
      query() {
        return gql`
          query Metrical($urn: String!) {
            passageTextParts(reference: $urn) {
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
  div.reader {
    flex: 1;
  }
  .text {
    font-family: $font-family-serif;
    margin: 1em 0;

    &.text-xs {
      line-height: 1.5;
    }
    &.text-sm {
      line-height: 1.6;
    }
    &.text-md {
      line-height: 1.7;
    }
    &.text-lg {
      line-height: 1.8;
    }
    &.text-xl {
      line-height: 1.9;
    }
  }

  .widget-sidebar .text {
    font-size: 14px;
    line-height: 1.6;
  }

  .text-xs {
    font-size: 12px;
  }
  .text-sm {
    font-size: 14px;
  }
  .text-md {
    font-size: 16px;
  }
  .text-lg {
    font-size: 20px;
  }
  .text-xl {
    font-size: 24px;
  }

  .attribution {
    margin-top: 1rem;
    text-align: center;
  }

  // TODO: media queries for defaults?
  .text-width-narrow {
    max-width: 20em;
  }

  .text-width-normal {
    max-width: 30em;
  }

  .text-width-wide {
    max-width: 40em;
  }

  .text-width-full {
    max-width: 100%;
  }
</style>
