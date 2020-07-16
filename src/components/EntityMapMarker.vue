<template>
  <MglMarker :coordinates="[lat, lng]" @click="onMarkerClick">
    <MglPopup v-if="placeLabel" :closeButton="false" :showed="selected">
      <div class="label">{{ placeLabel }}</div>
    </MglPopup>
  </MglMarker>
</template>

<script>
  import { MglMarker, MglPopup } from 'vue-mapbox';
  import { SELECT_NAMED_ENTITIES, CLEAR_NAMED_ENTITIES } from '../constants';

  export default {
    components: { MglMarker, MglPopup },
    props: {
      lat: Number,
      lng: Number,
      placeId: String,
      placeLabel: String,
    },
    methods: {
      onMarkerClick() {
        if (this.selected) {
          this.$store.dispatch(CLEAR_NAMED_ENTITIES);
        } else {
          this.$store.dispatch(SELECT_NAMED_ENTITIES, {
            entities: [this.placeId],
          });
        }
      },
    },
    computed: {
      selected() {
        return (
          this.selectedEntities.filter(id => this.placeId === id).length > 0
        );
      },
      selectedEntities() {
        return this.$store.state.selectedNamedEntities;
      },
    }
  };
</script>

<style lang="scss" scoped>

</style>
