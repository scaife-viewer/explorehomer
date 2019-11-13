<template>
  <div class="reader" :class="['text']">
    <div class="line"
      v-for="(line, index) in lines"
      :key="`${index}-${line.label}`"
    >
      <div class="line-ref">{{ line.label }}</div>
      <div class="line-text" v-html="line.textContent"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['lines'],
};
</script>

<style lang="scss">
  .text {
    font-family: 'Noto Serif';
    margin: 0.5em 0.5em 1em;

    .line {
      display: flex;
      .line-ref {
        font-size: 10pt;
        color: #69C;
        font-family: 'Noto Sans';
        text-align: left;
        padding-right: 1.0em;
      }
      .line-text {
      }
    }
  }
</style>
