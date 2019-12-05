<template v-if="ancestors">
  <div class="passage-ancestors-widget u-grid">
    <div
      class="grid-cell-square"
      v-for="ancestor in ancestors"
      :key="ancestor.absolute"
    >
      <router-link
        :key="`${ancestor.absolute}`"
        :to="{ path: 'reader', query: { urn: `${ancestor.absolute}` } }"
      >
        {{ ancestor.node }}
      </router-link>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import URN from '@/scaife-widgets/urn';
  import { MODULE_NS as READER_NS } from '@/reader/constants';

  export default {
    scaifeConfig: {
      displayName: 'Ancestors',
      singleton: true,
      location: 'sidebar',
    },
    computed: {
      passage() {
        return this.$store.getters[`${READER_NS}/passage`];
      },
      gqlQuery() {
        return this.passage
          ? gql`
            {
              passageLines(reference: "${this.passage.absolute}") {
                metadata
              }
            }`
          : null;
      },
      ancestors() {
        const ancestors = this.gqlData.passageLines.metadata.ancestors;
        return this.gqlData && ancestors
          ? ancestors.map(node => new URN(node.urn))
          : [];
      },
    },
  };
</script>

<style lang="scss">
  a {
    text-decoration: none;
  }
  .passage-ancestors-widget {
    width: 100%;
    margin: 0 0.33em;
    margin: 0.5em 0 1em 0;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(auto-fill, minmax(1.6em, 1fr));
    grid-gap: 0.0825em;
    > * {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e9ecef;
      font-size: 0.75rem;
    }
  }
</style>
