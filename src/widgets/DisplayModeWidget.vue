<template>
  <div class="display-mode-widget">
    <div :class="{ active: defaultMode }" @click="setDefault">
      Default
    </div>
    <div :class="{ active: interlinearMode }" @click="setInterlinear">
      Interlinear
    </div>
    <div :class="{ active: folioMode }" @click="setFolio">
      Folio Images
    </div>
    <div :class="{ active: metricalMode }" @click="setMetrical">
      Metrical Annotation
    </div>
    <div :class="{ active: namedEntitiesMode }" @click="setNamedEntities">
      Named Entities
    </div>
    <div :class="{ active: alignmentsMode }" @click="setSentence">
      Sentence Alignments
    </div>
  </div>
</template>

<script>
  import WIDGETS_NS from '@scaife-viewer/scaife-widgets';
  import {
    SET_DISPLAY_MODE,
    DISPLAY_MODE_NAMED_ENTITIES,
    DISPLAY_MODE_FOLIO,
    DISPLAY_MODE_DEFAULT,
    DISPLAY_MODE_INTERLINEAR,
    DISPLAY_MODE_METRICAL,
    DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  } from '@/constants';

  export default {
    scaifeConfig: {
      displayName: 'Display Mode',
      location: 'sidebar',
      singleton: true,
    },
    computed: {
      interlinearMode() {
        return this.$store.getters.interlinearMode;
      },
      namedEntitiesMode() {
        return this.$store.getters.namedEntitiesMode;
      },
      folioMode() {
        return this.$store.getters.folioMode;
      },
      defaultMode() {
        return this.$store.getters.defaultMode;
      },
      metricalMode() {
        return this.$store.getters.metricalMode;
      },
      alignmentsMode() {
        return this.$store.getters.alignmentsMode;
      },
    },
    methods: {
      setWideLayout() {
        document
          .getElementsByClassName('main-layout')[0]
          .classList.add('main-layout-wide');
      },
      setNormalLayout() {
        document
          .getElementsByClassName('main-layout')[0]
          .classList.remove('main-layout-wide');
      },
      setWideText() {
        this.$store.dispatch(`${WIDGETS_NS}/setTextWidth`, {
          width: 'wide',
        });
      },
      setNormalText() {
        this.$store.dispatch(`${WIDGETS_NS}/setTextWidth`, {
          width: 'normal',
        });
      },
      setMode(mode) {
        this.$store.dispatch(SET_DISPLAY_MODE, { mode });
      },
      setDefault() {
        this.setMode(DISPLAY_MODE_DEFAULT);
        this.setNormalLayout();
        this.setNormalText();
      },
      setInterlinear() {
        this.setMode(DISPLAY_MODE_INTERLINEAR);
        this.setNormalLayout();
        this.setNormalText();
      },
      setFolio() {
        this.setMode(DISPLAY_MODE_FOLIO);
        this.setWideLayout();
        this.setNormalText();
      },
      setNamedEntities() {
        this.setMode(DISPLAY_MODE_NAMED_ENTITIES);
        this.setNormalLayout();
        this.setNormalText();
      },
      setMetrical() {
        this.setMode(DISPLAY_MODE_METRICAL);
        this.setNormalLayout();
        this.setWideText();
      },
      setSentence() {
        this.setMode(DISPLAY_MODE_SENTENCE_ALIGNMENTS);
        this.setWideLayout();
        this.setNormalText();
      },
    },
  };
</script>

<style lang="scss">
  .main-layout.main-layout-wide {
    flex: 4;
    .open-seadragon {
      padding-left: 1rem;
      border-left: 1px solid $gray-300;
    }
    .image .open-seadragon {
      border: none;
      padding-left: 0;
    }
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
