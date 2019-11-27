<template>
  <div class="text-size-widget">
    <TextSize :value="textSize" @input="changeTextSize" size="xs" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="sm" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="md" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="lg" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="xl" />
  </div>
</template>

<script>
  import TextSize from '@/scaife-widgets/components/TextSize.vue';
  import {
    MODULE_NS,
    SET_TEXT_SIZE,
    SET_TEXT_WIDTH,
  } from '@/scaife-widgets/constants';

  export default {
    components: { TextSize },
    scaifeConfig: {
      displayName: 'Text Size',
      singleton: true,
      location: 'sidebar',
    },
    computed: {
      textSize() {
        return this.$store.getters[`${MODULE_NS}/readerTextSize`];
      },
    },
    methods: {
      changeTextSize(size) {
        this.$store.dispatch(`${MODULE_NS}/${SET_TEXT_SIZE}`, { size });
        this.$store.dispatch(`${MODULE_NS}/${SET_TEXT_WIDTH}`, {
          width: 'normal',
        });
      },
    },
  };
</script>

<style lang="scss">
  @import '@/_variables.scss';
  .text-size-widget {
    margin: 0 2em;
    flex: 1;
  }
</style>
