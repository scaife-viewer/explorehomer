<template v-if="metadata">
  <div id="app">
    <FixedSkeleton
      :main-widget="mainWidget"
      :left-widgets="leftWidgets"
      :right-widgets="rightWidgets"
    />
  </div>
</template>

<script>
  import {
    PassageAncestorsWidget,
    PassageChildrenWidget,
    PassageReferenceWidget,
    TextSizeWidget,
    TextWidthWidget,
  } from '@scaife-viewer/scaife-widgets';
  import ReaderWidget from '@/reader/widgets/ReaderWidget.vue';
  import { FETCH_METADATA } from '@/constants';

  export default {
    name: 'app',
    beforeCreate() {
      this.$store.dispatch(FETCH_METADATA);
    },
    computed: {
      metadata() {
        return this.$store.getters.metadata;
      },
      mainWidget() {
        return ReaderWidget;
      },
      leftWidgets() {
        return [
          PassageReferenceWidget,
          PassageAncestorsWidget,
          PassageChildrenWidget,
        ];
      },
      rightWidgets() {
        return [TextSizeWidget, TextWidthWidget];
      },
    },
  };
</script>

<style src="@scaife-viewer/scaife-widgets/dist/scaife-widgets.css"></style>
<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: $font-family-sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .body {
    display: flex;
    justify-content: center;
  }
</style>
