<template>
  <div class="passage-children-widget u-flex" v-if="children">
    <template v-for="child in children">
      <router-link
        :key="`${child.absolute}`"
        :to="{ path: 'reader', query: { urn: `${child.absolute}` } }"
      >
        {{ child.node }}
      </router-link>
    </template>
  </div>
</template>

<script>
  import { MODULE_NS } from '../constants';

  export default {
    scaifeConfig: {
      displayName: 'Children',
      singleton: true,
      location: 'sidebar',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      chidren() {
        return this.passage.children();
      },
    },
  };
</script>

<style lang="scss">
  @import '../_utilities.scss';
  .passage-children-widget {
    width: 100%;
    margin: 0 0.3em;
    > * {
      padding: 0.33em;
      text-decoration: none;
    }
  }
</style>
