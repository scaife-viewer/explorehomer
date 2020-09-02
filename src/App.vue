<template>
  <div id="app">
    <!-- <Nav /> -->
    <router-view></router-view>
  </div>
</template>

<script>
  // import Nav from '@/components/Nav.vue';

  export default {
    components: {
      // Nav,
    },
  };
</script>

<style lang="scss">
  @import './styles/variables';

  html,
  body {
    margin: 0;
    padding: 0;
  }
  :root {
    --scaife-brand-color: #{$explorehomer-brand};
  }
  #app {
    font-family: $font-family-sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .body {
    display: flex;
    justify-content: center;
  }
  div.main-layout > .widget {
    border-top: none;
  }
  div.main-layout > .widget > .main-widget-heading {
    // heading is currently unused, but the slot is defined
    // in scaife-skeleton
    display: none;
  }
  a {
    color: $explorehomer-brand;
  }

  .new-alexandria-widget {
    font-family: $font-family-serif;
    font-size: 14px;
    line-height: 18px;
    .new-alexandria-container {
      padding-right: 1rem;
    }
  }

  .widget-sidebar .body > div.library-widget {
    margin: 0 auto 0 2em;
  }
</style>
