<template>
  <div class="display-mode-widget">
    <div
      v-for="mode in displayModes"
      :key="mode.mode"
      :class="{ active: mode.active }"
      @click.prevent="setMode(mode)"
    >
      {{ mode.label }}
    </div>
  </div>
</template>

<script>
  import WIDGETS_NS from '@scaife-viewer/scaife-widgets';
  import { SET_DISPLAY_MODE } from '@/constants';

  export default {
    scaifeConfig: {
      displayName: 'Display Mode',
      location: 'sidebar',
      singleton: true,
    },
    computed: {
      displayModes() {
        const { readerComponents } = this.$scaife.config;
        return Object.keys(readerComponents).map(key => ({
          ...readerComponents[key].readerConfig,
          component: readerComponents[key],
          mode: key,
          active: this.$store.state.displayMode === key,
        }));
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
      setMode(mode) {
        this.$store.dispatch(SET_DISPLAY_MODE, { mode: mode.mode });
        this.$store.dispatch(`${WIDGETS_NS}/setTextWidth`, {
          width: mode.textWidth || 'normal',
        });
        if (mode.layout === 'wide') {
          this.setWideLayout();
        } else {
          this.setNormalLayout();
        }
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
