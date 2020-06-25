<template>
  <div class="reader">
    <div
      class="reader-container text"
      :class="[`text-${textSize}`, `text-width-${textWidth}`]"
    >
      <ReaderLine
        v-for="(line, index) in lines"
        :key="`${index}-${line.label}`"
        :line="line"
      />

      <small v-if="showMetricalCredit" class="metrical-attribution">
        <!-- @@@ extract attribution from audio annotations  -->
        Metrical annotation &copy; 2016
        <a href="https://hypotactic.com/" target="_blank">David Chamberlain</a>
        under
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"
          >CC BY 4.0 License</a
        >
      </small>
    </div>
  </div>
</template>

<script>
  import ReaderLine from './ReaderLine.vue';

  export default {
    components: { ReaderLine },
    props: ['lines', 'textSize', 'textWidth'],
    computed: {
      showMetricalCredit() {
        const metricalMode = this.$store.state.displayMode === 'metrical';
        const hasContent = this.lines.filter(line => {
          const { metricalAnnotations } = line;
          return metricalAnnotations[0] && metricalAnnotations[0].htmlContent;
        }).length > 0;
        return metricalMode && hasContent;
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

  .metrical-attribution {
    display: block;
    margin-top: 1rem;
    text-align: center;
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
