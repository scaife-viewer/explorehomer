<template>
  <div class="alignments">
    <Alignment
      v-for="(alignment, index) in alignments"
      :key="index"
      :left="alignment[0]"
      :right="alignment[1]"
      :textSize="textSize"
      :textWidth="textWidth"
    />
  </div>
</template>

<script>
  import Alignment from './Alignment.vue';

  export default {
    props: ['alignments', 'textSize', 'textWidth'],
    components: { Alignment },
  };
</script>

<style lang="scss" scoped>
  .text-xs {
    font-size: 12px;
  }
  .text-sm {
    font-size: 14px;
  }
  .text-md {
    font-size: 16px;
  }
  .text-lg {
    font-size: 20px;
  }
  .text-xl {
    font-size: 24px;
  }

  // TODO: media queries for defaults?
  .text-width-narrow {
    max-width: 20em;
  }

  .text-width-normal {
    max-width: 30em;
  }

  .text-width-wide {
    max-width: 40em;
  }

  .text-width-full {
    max-width: 100%;
  }
</style>
