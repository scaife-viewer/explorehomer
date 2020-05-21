<template>
  <div class="named-entity" :class="{ selected }">
    <div class="named-entity-title" @click.prevent="$emit('select', entity)">
      <span>{{ entity.title }}</span>
      <span v-if="selected">x</span>
    </div>
    <div class="named-entity-body" v-if="selected">
      <div class="named-entity-description">{{ entity.description }}</div>
      <a :href="entity.url" target="_blank">Read More</a>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      entity: {
        type: Object,
        required: true,
      },
      selected: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../styles/variables';
  .named-entity.selected {
   background: $gray-100;
   margin-left: -10px;
   padding: 3px 7px;
   border-left: 3px solid $gray-800;
     .named-entity-description {
       color: $gray-700;
     }
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
