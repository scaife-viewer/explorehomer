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
    MetadataWidget,
    NewAlexandriaWidget,
    PassageAncestorsWidget,
    PassageChildrenWidget,
    PassageReferenceWidget,
    TextSizeWidget,
    TextWidthWidget,
    // TOCWidget,
  } from '@scaife-viewer/scaife-widgets';
  import ReaderWidget from '@/reader/widgets/ReaderWidget.vue';
  import LibraryWidget from '@/widgets/LibraryWidget/LibraryWidget.vue';
  import TokenAnnotationWidget from '@/widgets/TokenAnnotationWidget.vue';
  import NamedEntitiesWidget from '@/widgets/NamedEntitiesWidget';
  import DisplayModeWidget from '@/widgets/DisplayModeWidget.vue';
  import ScholiaWidget from '@/widgets/ScholiaWidget.vue';
  import WordListWidget from '@/widgets/WordListWidget.vue';
  import AudioWidget from '@/widgets/AudioWidget.vue';
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
          LibraryWidget,
          PassageReferenceWidget,
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
          AudioWidget,
          DisplayModeWidget,
          NamedEntitiesWidget,
          TokenAnnotationWidget,
          WordListWidget,
          NewAlexandriaWidget,
          ScholiaWidget,
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
