<template>
  <nav class="paginator">
    <router-link
      v-if="urn"
      :key="urn.toString()"
      :to="{ path: 'reader', query: { urn: urn.toString() } }"
    >
      <Icon :name="icon" />
    </router-link>
    <span v-else class="disabled"><Icon :name="icon" /></span>
  </nav>
</template>

<script>
  import { Icon } from '@scaife-viewer/scaife-widgets';

  export default {
    name: 'Paginator',
    props: ['urn', 'direction'],
    components: { Icon },
    computed: {
      icon() {
        return `chevron-${this.direction}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  nav.paginator {
    min-width: 5em;
    width: auto;
    position: sticky;
    top: 2em;
    text-align: center;
    align-self: flex-start;
    a,
    .disabled {
      display: flex;
      justify-content: center;
      flex-direction: column;
      height: calc(100vh - 30px);
      align-items: center;
      font-size: 36px;
      color: $gray-500;
    }
    a:hover {
      color: $gray-800;
      background: $gray-100;
    }
    .disabled {
      color: $gray-300;
    }
  }
</style>
