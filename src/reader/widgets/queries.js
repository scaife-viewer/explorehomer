import gql from 'graphql-tag';
import { URN } from '@scaife-viewer/scaife-widgets';
import {
  DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_DEFAULT,
} from '@/constants';

const metadataTransform = metadata => {
  const { next, previous } = metadata;
  return {
    next: next ? new URN(next) : null,
    previous: previous ? new URN(previous) : null,
  };
};

const READER_QUERIES = {
  [DISPLAY_MODE_SENTENCE_ALIGNMENTS]: {
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
    update(data) {
      const { metadata } = data.passageTextParts;
      return {
        ...metadataTransform(metadata),
        alignments: data.textAlignmentChunks.edges.map(e => e.node.items),
      };
    },
  },
  [DISPLAY_MODE_FOLIO]: {
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
        ...metadataTransform(metadata),
        lines,
        imageIdentifier: data.imageAnnotations.edges.length
          ? data.imageAnnotations.edges[0].node.imageIdentifier
          : null,
      };
    },
  },
  [DISPLAY_MODE_INTERLINEAR]: {
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
          const { value, veRef, lemma, partOfSpeech, tag } = edge.node;
          return {
            value,
            veRef,
            lemma,
            partOfSpeech,
            tag,
          };
        });
        return {
          id,
          ref,
          tokens,
        };
      });
      return {
        ...metadataTransform(metadata),
        lines,
      };
    },
  },
  [DISPLAY_MODE_METRICAL]: {
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
      return {
        ...metadataTransform(metadata),
        lines,
      };
    },
  },
  [DISPLAY_MODE_NAMED_ENTITIES]: {
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
        ...metadataTransform(metadata),
        lines,
        coordinatesList: coordinatesList.flat().flat(),
      };
    },
  },
  [DISPLAY_MODE_DEFAULT]: {
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
                  }
                }
              }
            }
          }
        }
      }
    `,
    update(data) {
      const { metadata, edges: parts } = data.passageTextParts;
      const lines = parts.map(line => {
        const { id, ref } = line.node;
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
        };
      });
      return {
        ...metadataTransform(metadata),
        lines,
      };
    },
  },
};

export default READER_QUERIES;
