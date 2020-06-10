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
    <div :class="{ active: metrical }" @click="setMetrical">
      Metrical Annotation
    </div>
    <div :class="{ active: namedEntities }" @click="setNamedEntities">
      Named Entities
    </div>
    <div :class="{ active: sentence }" @click="setSentence">
      Sentence Alignments
    </div>
  </div>
</template>

<script>
  import {
    SET_DISPLAY_MODE_INTERLINEAR,
    SET_DISPLAY_MODE_NAMED_ENTITIES,
    SET_DISPLAY_MODE_FOLIO,
    SET_DISPLAY_MODE_DEFAULT,
    SET_DISPLAY_MODE_METRICAL,
    SET_DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  } from '@/constants';

  export default {
    scaifeConfig: {
      displayName: 'Display Mode',
      location: 'sidebar',
      singleton: true,
    },
    computed: {
      displayMode() {
        return this.$store.state.displayMode;
      },
      interlinear() {
        return this.displayMode === 'interlinear';
      },
      namedEntities() {
        return this.displayMode === 'named-entities';
      },
      folio() {
        return this.displayMode === 'folio';
      },
      defaultMode() {
        return this.displayMode === 'default';
      },
      metrical() {
        return this.displayMode === 'metrical';
      },
      sentence() {
        return this.displayMode === 'sentence-alignments';
      },
    },
    methods: {
      setWideLayout() {
        document.getElementsByClassName('main-layout')[0]
          .classList.add('main-layout-wide');
      },
      setNormalLayout() {
        document.getElementsByClassName('main-layout')[0]
          .classList.remove('main-layout-wide');
      },
      setDefault() {
        this.$store.dispatch(SET_DISPLAY_MODE_DEFAULT);
        this.setNormalLayout();
      },
      setInterlinear() {
        this.$store.dispatch(SET_DISPLAY_MODE_INTERLINEAR);
        this.setNormalLayout();
      },
      setFolio() {
        this.$store.dispatch(SET_DISPLAY_MODE_FOLIO);
        this.setWideLayout();
      },
      setNamedEntities() {
        this.$store.dispatch(SET_DISPLAY_MODE_NAMED_ENTITIES);
        this.setNormalLayout();
      },
      setMetrical() {
        this.$store.dispatch(SET_DISPLAY_MODE_METRICAL);
        this.setNormalLayout();
      },
      setSentence() {
        this.$store.dispatch(SET_DISPLAY_MODE_SENTENCE_ALIGNMENTS);
        this.setWideLayout();
      },
    },
  };
</script>

<style lang="scss">
  .main-layout.main-layout-wide {
    flex: 4;
    .reader {
      padding-right: 1rem;
    }
    .open-seadragon {
      padding-left: 1rem;
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
