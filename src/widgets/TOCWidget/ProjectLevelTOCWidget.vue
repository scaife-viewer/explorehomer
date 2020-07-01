<script>
  import TOCWidget from './TOCWidget.vue';
  // import i18n from '../../i18n';

  export default {
    name: 'NamedEntitiesWidget',
    // @@@ we may want to use mixins or
    // https://github.com/kaorun343/vue-property-decorator
    extends: TOCWidget,
    created() {
      this.showToggle = false;
    },
    scaifeConfig: {
      // displayName: () => i18n.t('namedEntitiesWidget.title'),
      defaults: {
        open: true,
        fixed: true,
      },
    },
    computed: {
      placeholder() {
        return '';
        // return i18n.t('namedEntitiesWidget.placeholder');
      },
      noResultsMessage() {
        return '';
        // return i18n.t('namedEntitiesWidget.noResults');
      },
    },
  };
</script>
<style lang="scss">
  // @@@ resolve these overrides with scoped styles
  @import '../../variables';

  #app[data-locale='ar'] .toc-widget {
    direction: rtl;
    font-family: $ar-font-family;
    font-size: $ar-default-font-size;
    input.form-control {
      font-family: $ar-font-family;
      font-size: $ar-default-font-size;
    }
  }
  #app[data-locale='ar'] .toc-widget.u-widget.u-flex {
    margin: unset;
  }
  .toc-widget.u-widget.u-flex {
    margin: 10px;
    width: unset;
    .toc-container {
      h3 {
        font-size: $h3-font-size * 0.8;
        margin-bottom: 10px;
        width: unset;
        overflow: hidden;
      }
    }
    .toc-grid {
      // @@@ remove grid
      display: block;
      .item {
        display: block;
        a {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: block;
          padding: 0 0.5em;
        }
      }
    }
    .form-group {
      .form-control {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        border-radius: 0.2rem;
        width: 100%;
        border: 1px solid $gray-400;
      }
    }
    .ref {
      // @@@ remove ref
      color: unset;
      display: none;
    }
  }
</style>
