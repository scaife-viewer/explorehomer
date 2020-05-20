<template>
  <div class="named-entity">
    <div class="named-entity-title" @click.prevent="$emit('select', entity)">
      {{ entity.title }}
    </div>
    <template v-if="selected">
      <div class="named-entity-description">{{ entity.description }}</div>
      <a :href="entity.url" target="_blank">Read More</a>
    </template>
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
  .named-entity {
    margin-bottom: 1rem;
  }
  .named-entity-title {
    font-size: 14px;
    color: $gray-800;
    cursor: pointer;
    &:hover {
      font-weight: 600;
    }
  }
</style>
