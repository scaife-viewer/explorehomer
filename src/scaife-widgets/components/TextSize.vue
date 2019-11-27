<template>
  <span
    class="text-size-control"
    :class="[`text-${size}`, { selected }]"
    @click.prevent="$emit('input', size)"
    >Αα</span
  >
</template>

<script>
  export default {
    props: ['value', 'size'],
    computed: {
      selected() {
        return this.value === this.size;
      },
    },
  };
</script>

<style lang="scss">
  @import '@/_variables.scss';
  .text-size-control {
    cursor: pointer;
    font-family: 'Noto Serif';
    color: $gray-500;
    &.selected {
      color: $gray-800;
    }
  }
</style>
