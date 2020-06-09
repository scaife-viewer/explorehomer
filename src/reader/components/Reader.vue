<template>
  <div class="reader">
    <div
      class="reader-container text"
      :class="[`text-${textSize}`, `text-width-${textWidth}`]"
    >
      <ul class="metrical" v-if="metrical" v-html="metricalData" />
      <ReaderLine
        v-else
        v-for="(line, index) in lines"
        :key="`${index}-${line.label}`"
        :line="line"
      />
    </div>
  </div>
</template>

<script>
  import ReaderLine from './ReaderLine.vue';

  export default {
    components: { ReaderLine },
    props: ['lines', 'textSize', 'textWidth'],
    computed: {
      metrical() {
        return this.$store.state.displayMode === 'metrical';
      },
      metricalData() {
        if (this.metrical) {
          return this.lines
            .map(l => l.metricalAnnotations[0].htmlContent)
            .join('\n');
        }
        return '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  div.reader {
    flex: 1;
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
