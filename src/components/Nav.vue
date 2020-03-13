<template>
  <div class="top-nav u-flex">
    <router-link to="/reader">Reader</router-link>
    <router-link to="/tocs">TOCs</router-link>
  </div>
</template>

<style lang="scss">
  .top-nav {
    border-bottom: 1px solid $gray-300;
    color: $white;
    flex-direction: row;
    justify-content: center;
    padding: 1em 0;
    width: 100%;
    z-index: 100;
    > * {
      margin-right: 2em;
    }
    a {
      color: $gray-700;
      text-decoration: none;
    }
  }
</style>
