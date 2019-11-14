<template>
  <Reader :lines="lines" />
</template>

<script>
import gql from 'graphql-tag';

import Reader from '../reader/components/Reader.vue';

export default {
  scaifeConfig: {
    displayName: 'Reader',
    location: 'main',
  },
  components: {
    Reader,
  },
  computed: {
    reference() {
      return '1.1-1.7';
    },
    gqlQuery() {
      return gql`
      {
        lines(version_Urn: "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2", reference: "${this.reference}") {
        edges {
          node {
            id
            label
            textContent
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    `;
    },
    lines() {
      return this.gqlData ? this.gqlData.lines.edges.map(line => line.node) : [];
    },
  },
};
</script>
