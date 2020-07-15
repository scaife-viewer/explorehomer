<template>
  <div class="alignments-mode-reader">
    <EmptyMessage class="empty-annotations" v-if="alignments.length === 0" />
    <Alignments
      v-else
      :alignments="alignments"
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
      readerData: Object,
    },
    components: {
      Alignments,
    },
    computed: {
      alignments() {
        return this.readerData.alignments;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .empty-annotations {
    text-align: center;
    margin-top: 1rem;
  }
</style>
