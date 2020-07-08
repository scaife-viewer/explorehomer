<template>
  <div class="selectable-entity-map">
    <EntityMap
      :coordinates-list="coordinatesList"
      :selectedPlace="selectedPlace"
      @select="onSelect"
    />
  </div>
</template>

<script>
  import { SELECT_NAMED_ENTITIES, CLEAR_NAMED_ENTITIES } from '../constants';
  import EntityMap from './EntityMap.vue';

  export default {
    props: ['coordinatesList'],
    components: { EntityMap },
    computed: {
      selectedPlace() {
        return this.selectedEntities[0];
      },
      selectedEntities() {
        return this.$store.state.selectedNamedEntities;
      },
    },
    methods: {
      onSelect(entityId) {
        if (this.selectedEntities.filter(id => entityId === id).length > 0) {
          this.$store.dispatch(CLEAR_NAMED_ENTITIES);
        } else {
          this.$store.dispatch(SELECT_NAMED_ENTITIES, {
            entities: [entityId],
          });
        }
      },
    },
  };
</script>

<style lang="scss">
  .map-direction-horizontal {
    .map {
      padding-left: 1rem;
      border-left: 1px solid $gray-300;
    }
  }
  .map-direction-vertical {
    .map {
      padding-top: 1rem;
      border-top: 1px solid $gray-300;
    }
  }
</style>

<style lang="scss" scoped>
  .selectable-entity-map {
    height: 100%;
  }
</style>
