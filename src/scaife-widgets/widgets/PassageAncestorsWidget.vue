<template>
  <div class="passage-ancestors-widget u-flex" v-if="ancestors">
    <template v-for="ancestor in ancestors">
      <router-link
        :key="`${ancestor.absolute}`"
        :to="{ path: 'reader', query: { urn: `${ancestor.absolute}` } }"
      >
        {{ ancestor.node }}
      </router-link>
    </template>
  </div>
</template>

<script>
  import URN from '../urn';
  import { MODULE_NS } from '../constants';

  export default {
    scaifeConfig: {
      displayName: 'Ancestors',
      singleton: true,
      location: 'sidebar',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      urn() {
        return new URN(this.passage);
      },
      ancestors() {
        return this.urn.ancestors();
      },
    },
  };
</script>

<style lang="scss">
  @import '../_utilities.scss';
  .passage-ancestors-widget {
    width: 100%;
    margin: 0 0.3em;
    > * {
      padding: 0.33em;
      text-decoration: none;
    }
  }
</style>
