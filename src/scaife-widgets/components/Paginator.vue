<template v-if="urn">
  <nav class="paginator">
    <router-link
      v-if="urn"
      :key="urn.absolute"
      :to="{ path: 'reader', query: { urn: `${urn.absolute}` } }"
    >
      <Icon :name="icon" fixed-width />
    </router-link>
  </nav>
</template>

<script>
  import { Icon } from "@scaife-viewer/scaife-widgets";

  export default {
    props: ['urn', 'direction'],
    components: { Icon },
    computed: {
      icon() {
        return `chevron-${this.direction}`;
      },
    },
  };
</script>

<style lang="scss">
  nav {
    min-width: 5em;
    width: auto;
    position: sticky;
    top: 2em;
  }
</style>
