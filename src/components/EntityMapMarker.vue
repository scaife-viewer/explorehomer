<template>
  <MglMarker ref="marker" :coordinates="[lat, lng]" @click="onMarkerClick">
    <MglPopup ref="popup" :closeButton="false" :closeOnClick="false">
      <div class="label">{{ placeLabel }}</div>
    </MglPopup>
  </MglMarker>
</template>

<script>
  import { MglMarker, MglPopup } from 'vue-mapbox';
  import { SELECT_NAMED_ENTITIES } from '../constants';

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
        if (!this.selected) {
          this.$store.dispatch(SELECT_NAMED_ENTITIES, {
            entities: [this.placeId],
          });
        }
      },
    },
    watch: {
      selected: {
        immediate: true,
        handler() {
          console.log('selected', this.selected, this.placeLabel);
          if (this.selected) {
            this.$nextTick(() => {
              console.log('open', this.$refs.popup.open, this.placeLabel);
              if (this.$refs.popup.open) {
                this.$refs.popup.remove();
              }
              console.log('toggle', this.placeLabel);
              this.$refs.marker.togglePopup();
              console.log('now open?', this.$refs.popup.open, this.placeLabel);
            });
          } else {
            this.$nextTick(() => {
              console.log('remove it', this.placeLabel);
              this.$refs.popup.remove();
            });
          }
        },
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
