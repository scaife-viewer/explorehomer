<template>
  <div class="text-width-widget">
    <TextWidth :value="textWidth" @input="changeTextWidth" width="narrow" />
    <TextWidth :value="textWidth" @input="changeTextWidth" width="normal" />
    <TextWidth :value="textWidth" @input="changeTextWidth" width="wide" />
    <TextWidth :value="textWidth" @input="changeTextWidth" width="full" />
  </div>
</template>

<script>
  import TextWidth from '../components/TextWidth.vue';
  import { MODULE_NS, SET_TEXT_WIDTH } from '../constants';

  export default {
    components: { TextWidth },
    scaifeConfig: {
      displayName: 'Text Width',
      singleton: true,
      location: 'sidebar',
    },
    computed: {
      textWidth() {
        return this.$store.getters[`${MODULE_NS}/readerTextWidth`];
      },
    },
    methods: {
      changeTextWidth(width) {
        this.$store.dispatch(`${MODULE_NS}/${SET_TEXT_WIDTH}`, { width });
      },
    },
  };
</script>

<style lang="scss">
  @import '../variables.scss';
  .text-width-widget {
    margin: 0 2em;
    flex: 1;
  }
</style>
