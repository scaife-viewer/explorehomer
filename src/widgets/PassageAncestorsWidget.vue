<template v-if="ancestors">
  <div class="passage-ancestors-widget u-widget">
    <ol class="ancestors">
      <li class="ancestor" v-for="ancestor in ancestors" :key="ancestor.urn">
        <router-link
          :key="ancestor.urn"
          :to="{ path: 'reader', query: { urn: ancestor.urn } }"
        >
          {{ ancestor.ref }}
        </router-link>
      </li>
    </ol>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import WIDGETS_NS from '@scaife-viewer/scaife-widgets';

  export default {
    name: 'PassageAncestorsWidget',
    scaifeConfig: {
      displayName: 'Ancestors',
    },
    computed: {
      passage() {
        return this.$store.getters[`${WIDGETS_NS}/passage`];
      },
    },
    apollo: {
      ancestors: {
        query: gql`
          query Ancestors($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata
            }
          }
        `,
        variables() {
          return { urn: this.passage.absolute };
        },
        update(data) {
          return data.passageTextParts.metadata.ancestors;
        },
        skip() {
          return !this.passage;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
  .passage-ancestors-widget {
    width: 100%;
  }
  .passage-ancestors-widget * {
    display: flex;
    font-size: 0.7rem;
  }
  .passage-ancestors-widget a {
    border: none;
  }
  .ancestors {
    padding: 0;
    list-style: none;
  }
  .ancestor + .ancestor::before {
    display: inline-block;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
    content: '>';
  }
</style>
