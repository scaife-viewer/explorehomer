<template>
  <span
    :class="['text-width-control', { active }]"
    @click.prevent="$emit('input', width)"
    >{{ text }}</span
  >
</template>

<script>
  export default {
    props: ['value', 'width'],
    computed: {
      active() {
        return this.value === this.width;
      },
      text() {
        return this.width.charAt(0).toUpperCase() + this.width.slice(1);
      },
    },
  };
</script>

<style lang="scss">
  .text-width-control {
    font-family: $font-family-serif;
    cursor: pointer;
    color: $gray-500;
    font-size: 14px;
    padding-right: 5px;
  }
  .text-width-control.active {
    color: $black;
  }
</style>
