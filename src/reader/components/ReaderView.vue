<template>
  <FixedSkeleton
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
  import NamedEntitiesWidget from '@/widgets/NamedEntitiesWidget';
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
          NamedEntitiesWidget,
          TokenAnnotationWidget,
          WordListWidget,
          NewAlexandriaWidget,
        ];
      },
    },
  };
</script>
