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
  // eslint-disable-next-line max-len
  import PassageAncestorsWidget from './scaife-widgets/widgets/PassageAncestorsWidget.vue';
  // eslint-disable-next-line max-len
  import PassageChildrenWidget from './scaife-widgets/widgets/PassageChildrenWidget.vue';
  // eslint-disable-next-line max-len
  import PassageReferenceWidget from './scaife-widgets/widgets/PassageReferenceWidget.vue';
  import ReaderWidget from './reader/widgets/ReaderWidget.vue';
  import TextSizeWidget from './scaife-widgets/widgets/TextSizeWidget.vue';
  import TextWidthWidget from './scaife-widgets/widgets/TextWidthWidget.vue';
  import { FETCH_METADATA } from './constants';

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

<style lang="scss">
  // prettier-ignore
  @import url(https://fonts.googleapis.com/css?family=Noto+Serif:400,400i,700,700i&subset=greek,greek-ext,latin-ext);
  // prettier-ignore
  @import url(https://fonts.googleapis.com/css?family=Noto+Sans:400,700);

  html,
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .body {
    display: flex;
    justify-content: center;
  }
</style>
