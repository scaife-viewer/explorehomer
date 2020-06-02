<template>
  <FixedSkeleton
    class="main"
    :main-widget="mainWidget"
    :left-widgets="leftWidgets"
    :right-widgets="rightWidgets"
  />
</template>

<script>
  import {
    LibraryWidget,
    MetadataWidget,
    NewAlexandriaWidget,
    PassageAncestorsWidget,
    PassageChildrenWidget,
    PassageReferenceWidget,
    TextSizeWidget,
    TextWidthWidget,
    // TOCWidget,
    WordListWidget,
  } from '@scaife-viewer/scaife-widgets';
  import ReaderWidget from '@/reader/widgets/ReaderWidget.vue';
  import TokenAnnotationWidget from '@/widgets/TokenAnnotationWidget.vue';
  import DisplayModeWidget from '@/widgets/DisplayModeWidget.vue';
  import { FETCH_METADATA, FETCH_LIBRARY } from '@/constants';

  export default {
    name: 'ReaderView',
    beforeCreate() {
      this.$store.dispatch(FETCH_METADATA);
      this.$store.dispatch(FETCH_LIBRARY);
    },
    computed: {
      mainWidget() {
        return ReaderWidget;
      },
      leftWidgets() {
        return [
          PassageReferenceWidget,
          LibraryWidget,
          PassageAncestorsWidget,
          PassageChildrenWidget,
          // TOCWidget,
        ];
      },
      rightWidgets() {
        return [
          MetadataWidget,
          TextSizeWidget,
          TextWidthWidget,
          DisplayModeWidget,
          WordListWidget,
          TokenAnnotationWidget,
          NewAlexandriaWidget,
        ];
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep .word-list-container .word-list {
    font-size: 0;
  }
  ::v-deep .word-list-container .word-list p.u-flex {
    display: inline;
    font-size: 12px;
    line-height: 18px;
    margin: 0;
  }
</style>
