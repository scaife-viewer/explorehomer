<template>
  <div class="reader-line" :class="{ 'playing-audio': playingAudio }">
    <section class="tokens" v-if="interlinear">
      <ReaderToken v-for="token in tokens" :key="token.veRef" :token="token" />
    </section>
    <div class="line u-flex" v-else>
      <div class="line-ref">
        <icon v-if="playingAudio" name="volume-up" />
        {{ line.ref }}
      </div>
      <div class="line-text metrical" v-if="metrical" v-html="metricalHtml" />
      <div class="line-text" v-else>
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
      playingAudio() {
        if (this.$store.state.nowPlaying === null) {
          return false;
        }
        const parts = this.$store.state.nowPlaying.split(':');
        const ref = parts[parts.length - 1];
        return this.line.ref === ref;
      },
      tokens() {
        return this.line.tokens;
      },
      interlinear() {
        return this.$store.state.displayMode === 'interlinear';
      },
      metricalHtml() {
        return (
          this.line.metricalAnnotations[0] &&
          this.line.metricalAnnotations[0].htmlContent
        );
      },
      metrical() {
        return (
          this.$store.state.displayMode === 'metrical' && this.metricalHtml
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .playing-audio {
      background: $gray-200;
  }
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
      > svg {
        margin-left: -10px;
        margin-right: 10px;
        color: $gray-700;
      }
    }
    .line-text {
      margin-left: 1em;
    }
  }

  .tokens {
    margin: 20px 0;
  }
</style>

<style lang="scss">
  .metrical {
    span.foot {
      box-sizing: border-box;
    }
    span.syll {
      box-sizing: border-box;
    }

    /* show foot and syllable divisions */

    li div {
      word-spacing: 0.6em;
    }
    span.syll {
      padding: 1px 3px;
    }
    span.syll:first-child {
      border-left: 2px solid black;
    }
    span.syll.caesura:first-child {
      border-left: 3px solid blue;
    }
    span.syll:not(:first-child) {
      border-left: 1px dotted black;
    }
    span.syll.caesura:not(:first-child) {
      border-left: 3px dotted blue;
    }

    /* show syllable length */
    span.syll.long {
      background-color: #CCC;
    }
    span.syll:not(.long) {
      background-color: #EEE;
    }
  }
</style>
