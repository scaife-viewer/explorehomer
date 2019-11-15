<template>
  <div class="passage-children-widget u-flex" v-if="children"></div>
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
        return null;
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
