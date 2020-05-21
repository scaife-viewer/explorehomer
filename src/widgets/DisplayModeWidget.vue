<template>
  <div class="display-mode-widget">
    <span :class="{ active: defaultMode }" @click="setDefault">
      Default
    </span>
    <span :class="{ active: interlinear }" @click="setInterlinear">
      Interlinear
    </span>
    <span :class="{ active: namedEntities }" @click="setNamedEntities">
      Named Entities
    </span>
  </div>
</template>

<script>
  import {
    SET_DISPLAY_MODE_INTERLINEAR,
    SET_DISPLAY_MODE_NAMED_ENTITIES,
    SET_DISPLAY_MODE_DEFAULT,
  } from '@/constants';

  export default {
    scaifeConfig: {
      displayName: 'Display Mode',
      location: 'sidebar',
      singleton: true,
    },
    computed: {
      interlinear() {
        return this.$store.state.displayMode === 'interlinear';
      },
      namedEntities() {
        return this.$store.state.displayMode === 'named-entities';
      },
      defaultMode() {
        return this.$store.state.displayMode === 'default';
      },
      displayMode() {
        return this.$store.state.displayMode;
      },
    },
    methods: {
      setDefault() {
        this.$store.dispatch(SET_DISPLAY_MODE_DEFAULT);
      },
      setInterlinear() {
        this.$store.dispatch(SET_DISPLAY_MODE_INTERLINEAR);
      },
      setNamedEntities() {
        this.$store.dispatch(SET_DISPLAY_MODE_NAMED_ENTITIES);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/variables';
  // TODO: Mimic TextWidth further
  .active {
    color: $gray-800;
  }
  .display-mode-widget span {
    cursor: pointer;
  }
  .display-mode-widget {
    margin: 0 2em;
    flex: 1;
    color: $gray-500;
  }
  span {
    padding-right: 20px;
  }
</style>
