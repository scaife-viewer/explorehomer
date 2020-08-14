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
    MODULE_NS,
    FETCH_METADATA,
    FETCH_LIBRARY,
  } from '@scaife-viewer/store';

  import MetadataWidget from '@scaife-viewer/widget-metadata';
  import PassageReferenceWidget from '@scaife-viewer/widget-passage-reference';
  import TextSizeWidget from '@scaife-viewer/widget-text-size';
  import TextWidthWidget from '@scaife-viewer/widget-text-width';
  import ReaderWidget from '@scaife-viewer/widget-reader';
  import TokenAnnotationWidget from '@scaife-viewer/widget-token-annotations';
  import PassageAncestorsWidget from '@scaife-viewer/widget-passage-ancestors';
  import PassageSiblingsWidget from '@scaife-viewer/widget-passage-siblings';
  import PassageChildrenWidget from '@scaife-viewer/widget-passage-children';
  import LibraryWidget from '@scaife-viewer/widget-library';
  import NamedEntitiesWidget from '@scaife-viewer/widget-named-entities';
  import DisplayModeWidget from '@scaife-viewer/widget-display-mode';
  import ScholiaWidget from '@scaife-viewer/widget-scholia';
  import AudioWidget from '@scaife-viewer/widget-audio';
  import WordListWidget from '@scaife-viewer/widget-word-list';
  import NewAlexandriaWidget from '@scaife-viewer/widget-new-alexandria';

  export default {
    name: 'ReaderView',
    beforeCreate() {
      if (!this.$route.query.urn) {
        // load the first version returned from ATLAS
        this.$store.dispatch(`${MODULE_NS}/${FETCH_METADATA}`);
      }
      this.$store.dispatch(`${MODULE_NS}/${FETCH_LIBRARY}`);
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
          PassageSiblingsWidget,
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
