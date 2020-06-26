<template>
  <div class="attribution">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';

  .attribution {
    font-family: 'Noto Sans';
    font-size: 14px;
    color: $gray-600;
  }
</style>
