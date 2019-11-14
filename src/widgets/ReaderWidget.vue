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
  created() {
    if (!this.urn) {
      this.$router.push({
        to: 'reader',
        query: { urn: 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.7' },
      });
    }
  },
  computed: {
    urn() {
      return this.$route.query.urn;
    },
    reference() {
      return this.urn ? this.urn.split(':').slice(-1)[0] : null;
    },
    versionUrn() {
      return this.urn ? this.urn.split(':').slice(0, -1).join(':') : null;
    },
    gqlQuery() {
      return this.versionUrn && this.reference ? gql`
      {
        lines(version_Urn: "${this.versionUrn}", reference: "${this.reference}") {
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
    ` : null;
    },
    lines() {
      return this.gqlData ? this.gqlData.lines.edges.map(line => line.node) : [];
    },
  },
};
</script>
