<template>
  <div class="reader-line">
    <ReaderToken v-for="token in tokens" :token="token" :key="token.veRef" />
  </div>
</template>

<script>
  import ReaderToken from './ReaderToken.vue';

  export default {
    props: ['tokens'],
    components: { ReaderToken },
  };
</script>
