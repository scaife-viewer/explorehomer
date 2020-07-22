<template>
  <div class="error-message">
    <slot />
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .error-message {
    border: 1px solid var(--error-message-border-color, $danger);
    background: var(--error-message-background-color, $danger-background);
    color: var(--error-message-text-color, $danger);
    border-radius: 5px;
    padding: 1rem 3rem;
    text-align: center;
    font-size: 18px;
    margin-top: 40px;
  }
</style>
