<template>
  <div class="display-mode-widget">
    <div :class="{ active: defaultMode }" @click="setDefault">
      Default
    </div>
    <div :class="{ active: interlinear }" @click="setInterlinear">
      Interlinear
    </div>
    <div :class="{ active: folio }" @click="setFolio">
      Folio Images
    </div>
    <div :class="{ active: namedEntities }" @click="setNamedEntities">
      Named Entities
    </div>
  </div>
</template>

<script>
  import {
    SET_DISPLAY_MODE_INTERLINEAR,
    SET_DISPLAY_MODE_NAMED_ENTITIES,
    SET_DISPLAY_MODE_FOLIO,
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
      folio() {
        return this.$store.state.displayMode === 'folio';
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
        document.getElementsByClassName('main-layout')[0]
          .classList.remove('main-layout-wide');
      },
      setInterlinear() {
        this.$store.dispatch(SET_DISPLAY_MODE_INTERLINEAR);
        document.getElementsByClassName('main-layout')[0]
          .classList.remove('main-layout-wide');
      },
      setFolio() {
        this.$store.dispatch(SET_DISPLAY_MODE_FOLIO);
        document.getElementsByClassName('main-layout')[0]
          .classList.add('main-layout-wide');
      },
      setNamedEntities() {
        this.$store.dispatch(SET_DISPLAY_MODE_NAMED_ENTITIES);
        document.getElementsByClassName('main-layout')[0]
          .classList.remove('main-layout-wide');
      },
    },
  };
</script>

<style lang="scss">
  .main-layout.main-layout-wide {
    flex: 4;
  }
</style>

<style lang="scss" scoped>
  @import '../styles/variables';
  // TODO: Mimic TextWidth further
  .active {
    color: $gray-800;
  }
  .display-mode-widget {
    margin: 0 2em;
    flex: 1;
    color: $gray-500;

    div {
      padding-right: 20px;
      cursor: pointer;
      // @@@ this should be standard across all widgets
      font-family: $font-family-serif;
      font-size: 14px;
    }
  }
</style>
