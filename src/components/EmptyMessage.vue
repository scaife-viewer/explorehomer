<template>
  <div class="empty-message">
    <slot>No content available</slot>
  </div>
</template>

<style lang="scss" scoped>
  @import '../styles/variables';
  .empty-message {
    font-family: 'Noto Sans';
    font-size: 14px;
    padding: 0 0 0.4rem;
    color: $gray-700;
    font-style: italic;
    flex: 1;
  }
</style>
