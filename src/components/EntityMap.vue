<template>
  <MglMap
    :zoom="10"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="center"
    @load="onMapLoaded"
  >
    <EntityMapMarker
      v-for="(coordinates, index) in coordinatesList"
      :key="`${coordinates[2]}-${coordinates[3]}-${index}`"
      :lat="coordinates[0]"
      :lng="coordinates[1]"
      :placeId="coordinates[2]"
      :placeLabel="coordinates[3]"
    />
    <MglNavigationControl position="top-right" />
  </MglMap>
</template>

<script>
  import Mapbox from 'mapbox-gl';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';
  import EntityMapMarker from './EntityMapMarker.vue';

  export default {
    props: ['coordinatesList', 'selectedPlace'],
    components: {
      MglMap,
      MglNavigationControl,
      EntityMapMarker,
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
