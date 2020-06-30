<template>
  <div class="ball-pulse partial-loader">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
  @import 'node_modules/loaders.css/src/loaders.scss';
  .page-loader {
    margin: auto;
    transform: translate3d(0, 0, 0);
  }
  .page-loader > div {
    background-color: #343a40;
  }
  .partial-loader {
    margin-top: 1em;
    text-align: center;
    transform: translate3d(0, 0, 0);
  }
  .partial-loader > div {
    background-color: #ccc;
    width: 10px;
    height: 10px;
  }
</style>
