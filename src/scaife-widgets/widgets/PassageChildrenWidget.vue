<template v-if="children">
  <div class="passage-children-widget u-grid">
    <div
      class="grid-cell-square"
      v-for="child in children"
      :key="child.absolute"
    >
      <router-link
        :to="{ path: 'reader', query: { urn: `${child.absolute}` } }"
      >
        {{ child.node }}
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
      displayName: 'Children',
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
      children() {
        const children = this.gqlData.passageLines.metadata.children;
        return this.gqlData && children
          ? children.map(node => new URN(node.urn))
          : [];
      },
    },
  };
</script>

<style lang="scss">
  a {
    text-decoration: none;
  }
  .passage-children-widget {
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
      font-size: 0.8rem;
    }
  }
</style>
