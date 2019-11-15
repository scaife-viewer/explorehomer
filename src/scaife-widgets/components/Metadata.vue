<template functional>
  <h1 class="work-title">{{ props.metadata.work_title }}</h1>
</template>

<script>
  export default {
    name: 'Metadata',
    props: {
      metadata: {
        required: true,
        type: Object,
      },
    },
  };
</script>

<style lang="scss">
  @import '../_variables.scss';
  h1 {
    font-size: 1.75em;
    margin: 0;
  }
</style>
