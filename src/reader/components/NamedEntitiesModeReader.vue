<template>
  <div :class="`entity-mode map-direction-${showMap}`">
    <LoaderBall v-if="loading" />
    <EntityMapToolbar v-if="canShowMap" :showMap="showMap" @show="onShowMap" />
    <div class="entity-mode-container">
      <Reader
        class="entity-reader"
        :lines="readerData.lines"
        :textSize="textSize"
        :textWidth="textWidth"
      />
      <div class="map" v-if="showMap && canShowMap">
        <SelectableEntityMap
          :key="`${showMap}-${sidebars}`"
          :coordinates-list="coordinatesList"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import SelectableEntityMap from '@/components/SelectableEntityMap.vue';
  import EntityMapToolbar from '@/components/EntityMapToolbar.vue';
  import Reader from './Reader.vue';
  import { MAP_STATE_NONE, MAP_STATE_HORIZONTAL } from '@/constants';

  export default {
    props: {
      textSize: String,
      textWidth: String,
      loading: Boolean,
      readerData: Object,
    },
    components: {
      SelectableEntityMap,
      EntityMapToolbar,
      Reader,
    },
    data() {
      return {
        showMap: MAP_STATE_NONE,
      };
    },
    watch: {
      coordinatesList: {
        immediate: true,
        handler() {
          this.showMap = this.canShowMap
            ? MAP_STATE_HORIZONTAL
            : MAP_STATE_NONE;
        },
      },
    },
    methods: {
      onShowMap(kind) {
        this.showMap = kind;
      },
    },
    computed: {
      canShowMap() {
        return this.coordinatesList && this.coordinatesList.length > 0;
      },
      coordinatesList() {
        return this.readerData.coordinatesList;
      },
      sidebars() {
        // used for keys to force map redraw on sidebar changes
        const { leftOpen, rightOpen } = this.$store.state.scaifeSkeleton;
        if (leftOpen && rightOpen) {
          return 'both';
        }
        if (leftOpen) {
          return 'left';
        }
        if (rightOpen) {
          return 'right';
        }
        return 'neither';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .entity-mode {
    flex: 1;
    &.map-direction-horizontal {
      .entity-mode-container {
        grid-template-columns: 1fr 1fr;
        column-gap: 0.75rem;
      }
    }
    &.map-direction-vertical {
      .entity-mode-container {
        grid-template-rows: 1fr 1fr;
        row-gap: 0.75rem;
      }
    }
    .entity-mode-container {
      display: grid;
      height: calc(100vh - 75px - 3rem);
      .entity-reader {
        overflow-y: scroll;
      }
    }
  }
</style>
