<template>
  <MglMap
    :zoom="10"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="coordinatesList[0]"
    @load="onMapLoaded"
  >
    <MglMarker
      v-for="(coordinates, index) in coordinatesList"
      :key="index"
      :coordinates="coordinates"
    />
    <MglNavigationControl position="top-right" />
  </MglMap>
</template>

<script>
  import Mapbox from 'mapbox-gl';
  import { MglMap, MglMarker, MglNavigationControl } from 'vue-mapbox';

  const accessToken =
    // eslint-disable-next-line max-len
    'pk.eyJ1IjoicGFsdG1hbiIsImEiOiJja2JpNDVpbmUwOGF1MnJwZm91c3VybDVrIn0.KRcXBGtiUWFXkp2uaE5LLw';

  export default {
    props: ['coordinatesList'],
    components: {
      MglMap,
      MglMarker,
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
          this.map.fitBounds(this.coordinatesList);
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
      accessToken() {
        return accessToken;
      },
      mapStyle() {
        return 'mapbox://styles/paltman/ckbi4thqt156y1ijz5wldui14';
      },
    },
  };
</script>

<style lang="scss" scoped></style>
