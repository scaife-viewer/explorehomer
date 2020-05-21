<template>
  <div class="display-mode-widget">
    <span v-if="interlinear" class="click" @click="toggleInterlinear">
      Default
    </span>
    <span v-else class="active">
      Default
    </span>
    <span v-if="!interlinear" class="click" @click="toggleInterlinear">
      Interlinear
    </span>
    <span v-else class="active">
      Interlinear
    </span>
  </div>
</template>

<script>
  import {
    SET_DISPLAY_MODE_INTERLINEAR,
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
        return this.$store.state.interlinear;
      },
      sourceMode() {
        return !this.interlinear ? 'Interlinear' : ' Default';
      },
      destinationMode() {
        return this.interlinear ? 'Default' : 'Interlinear';
      },
    },
    methods: {
      // TODO: Move out of store and into route
      toggleInterlinear() {
        const action = this.interlinear
          ? SET_DISPLAY_MODE_DEFAULT
          : SET_DISPLAY_MODE_INTERLINEAR;
        this.$store.dispatch(action);
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
  .click {
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
