<template>
  <div class="alignments-mode-reader">
    <LoaderBall v-if="loading" />
    <EmptyMessage class="empty-annotations" v-else-if="data.length === 0" />
    <Alignments
      v-else
      :alignments="data"
      :textSize="textSize"
      :textWidth="textWidth"
    />
  </div>
</template>

<script>
  import Alignments from './Alignments.vue';

  export default {
    props: {
      textSize: String,
      textWidth: String,
      loading: Boolean,
      data: Array,
    },
    components: {
      Alignments,
    },
  };
</script>

<style lang="scss" scoped>
  .empty-annotations {
    text-align: center;
    margin-top: 1rem;
  }
</style>
