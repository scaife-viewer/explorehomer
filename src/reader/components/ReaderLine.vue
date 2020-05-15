<template>
  <div class="reader-line">
    <section class="tokens" v-if="interlinear">
    </section>
    <div class="line u-flex" v-else>
      <div class="line-ref">{{ line.ref }}</div>
      <div class="line-text">
        <ReaderToken
          v-for="token in tokens"
          :key="token.veRef"
          :token="token"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import ReaderToken from './ReaderToken.vue';

  export default {
    props: ['line'],
    components: { ReaderToken },
    computed: {
      tokens() {
        return this.line.tokens;
      },
      interlinear() {
        return this.$store.state.interlinear;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .line {
    display: flex;
    align-items: baseline;
    .line-ref {
      font-size: 10pt;
      color: #69c;
      font-family: 'Noto Sans';
      min-width: 4em;
      margin-left: 1em;
      text-align: right;
    }
    .line-text {
      margin-left: 1em;
    }
  }
</style>
