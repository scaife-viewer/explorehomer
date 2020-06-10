<template>
  <div class="alignments">
    <Alignment
      v-for="(alignment, index) in alignments"
      :key="index"
      :left="alignment[0]"
      :right="alignment[1]"
    />
  </div>
</template>

<script>
  import Alignment from './Alignment.vue';

  export default {
    props: ['alignments'],
    components: { Alignment },
  }
</script>

<style lang="scss" scoped>

</style>
