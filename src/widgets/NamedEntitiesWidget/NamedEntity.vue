<template>
  <div class="named-entity" :class="{ selected }">
    <div class="named-entity-title" @click.prevent="$emit('select', entity)">
      <span>
        <icon class="icon" v-if="iconName" :name="iconName" />
        {{ entity.title }}
      </span>
      <span v-if="selected">x</span>
    </div>
    <div class="named-entity-body" v-if="selected">
      <div class="named-entity-description">{{ entity.description }}</div>
      <a :href="entity.url" target="_blank">Read More</a>
      <div class="map" v-if="place">
        <EntityMap :coordinates-list="[center]" />
      </div>
    </div>
  </div>
</template>

<script>
  import EntityMap from '../../components/EntityMap.vue';

  const iconMap = {
    PERSON: 'user',
    PLACE: 'map-marker-alt',
  };
  export default {
    props: {
      entity: {
        type: Object,
        required: true,
      },
    },
    components: { EntityMap },
    computed: {
      place() {
        return this.entity.kind === 'PLACE';
      },
      center() {
        return (
          this.entity.data &&
          this.entity.data.coordinates &&
          this.entity.data.coordinates.split(', ').map(c => parseFloat(c))
        );
      },
      iconName() {
        return iconMap[this.entity.kind];
      },
      selected() {
        return (
          this.$store.state.selectedNamedEntities.filter(
            id => this.entity.id === id,
          ).length > 0
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../styles/variables';
  .map {
    height: 250px;
  }
  .named-entity.selected {
    background: $gray-100;
    margin-left: -10px;
    padding: 3px 7px;
    border-left: 3px solid $gray-800;
    .named-entity-description {
      color: $gray-700;
    }
    .icon {
      color: $gray-800;
    }
  }
  .icon {
    color: $gray-600;
  }
  .named-entity {
    margin: 0.375rem 0;
  }
  .named-entity-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: $gray-800;
    cursor: pointer;
    &:hover {
      font-weight: 600;
    }
  }
</style>
