<template>
  <div
    class="reader"
    :class="['text', `text-${textSize}`, `text-width-${textWidth}`]"
  >
    <div
      class="line u-flex"
      v-for="(line, index) in lines"
      :key="`${index}-${line.label}`"
    >
      <div class="line-ref">{{ line.ref }}</div>
      <ReaderLine class="line-text" :tokens="line.tokens" />
    </div>
  </div>
</template>

<script>
  import ReaderLine from './ReaderLine.vue';

  export default {
    components: { ReaderLine },
    props: ['lines', 'textSize', 'textWidth'],
  };
</script>

<style lang="scss" scoped>
  div.reader {
    width: 100%;
  }
  .text {
    font-family: $font-family-serif;
    margin: 1em 0;

    &.text-xs {
      line-height: 1.5;
    }
    &.text-sm {
      line-height: 1.6;
    }
    &.text-md {
      line-height: 1.7;
    }
    &.text-lg {
      line-height: 1.8;
    }
    &.text-xl {
      line-height: 1.9;
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
      }
      .line-text {
        margin-left: 1em;
      }
    }
  }

  .widget-sidebar .text {
    font-size: 14px;
    line-height: 1.6;
  }

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
