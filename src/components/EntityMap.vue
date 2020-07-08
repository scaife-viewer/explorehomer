<template>
  <MglMap
    :zoom="10"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="center"
    @load="onMapLoaded"
  >
    <MglMarker
      v-for="(coordinates, index) in coordinatesList"
      :key="`${coordinates[2]}-${coordinates[3]}-${index}`"
      :coordinates="[coordinates[0], coordinates[1]]"
      @click="onMarkerClick(coordinates)"
    >
      <MglPopup
        v-if="coordinates[3]"
        :closeButton="false"
        :closeOnClick="true"
        :showed="selectedPlace === coordinates[2]"
      >
        <div class="label">{{ coordinates[3] }}</div>
      </MglPopup>
    </MglMarker>
    <MglNavigationControl position="top-right" />
  </MglMap>
</template>

<script>
  import Mapbox from 'mapbox-gl';
  import {
    MglMap,
    MglMarker,
    MglPopup,
    MglNavigationControl,
  } from 'vue-mapbox';

  export default {
    props: ['coordinatesList', 'selectedPlace'],
    components: {
      MglMap,
      MglMarker,
      MglPopup,
      MglNavigationControl,
    },
    created() {
      this.map = null;
      this.mapbox = Mapbox;
    },
    methods: {
      onMapLoaded(event) {
        this.map = event.map;
        if (this.coordinatesList.length > 1) {
          const bbox = this.coordinatesList.map(c => {
            return [c[0], c[1]];
          });
          this.map.fitBounds(bbox);
        }
      },
      onMarkerClick(coordinates) {
        this.$emit('select', coordinates[2]);
      },
    },
    watch: {
      coordinatesList: {
        immediate: true,
        handler() {
          this.$nextTick(() => {
            if (this.map !== null) {
              if (this.coordinatesList.length > 1) {
                this.map.fitBounds(this.coordinatesList);
              } else {
                this.map.setCenter(this.coordinatesList[0]);
              }
            }
          });
        },
      },
    },
    computed: {
      center() {
        return [this.coordinatesList[0][0], this.coordinatesList[0][1]];
      },
      config() {
        return this.$scaife.config.entityMap;
      },
      accessToken() {
        return this.config.accessToken;
      },
      mapStyle() {
        return this.config.mapStyle;
      },
    },
  };
</script>

<style lang="scss" scoped></style>
