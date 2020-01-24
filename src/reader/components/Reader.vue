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
      <div class="line-text" v-html="line.textContent"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['lines', 'textSize', 'textWidth'],
  };
</script>

<style lang="scss">
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
      align-items: center;
      .line-ref {
        font-size: 10pt;
        color: #69c;
        font-family: 'Noto Sans';
        flex-basis: 4.5em;
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
</style>
