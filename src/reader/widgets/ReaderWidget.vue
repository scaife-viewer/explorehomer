<template>
  <article class="u-flex" :class="{ 'full-height': fullHeight }">
    <section class="reader-left">
      <h2 v-if="passageTitle" class="reader-heading main-widget-heading">
        {{ passageTitle }}
      </h2>
      <ApolloQuery
        class="reader-container u-flex"
        :query="query"
        :variables="queryVariables"
        :update="queryUpdate"
      >
        <template v-slot="{ result: { error, data }, isLoading }">
          <Paginator :urn="data && data.previous" direction="left" />

          <LoaderBall v-if="isLoading" />
          <ErrorMessage v-else-if="error">
            There was an error loading the requested data.
          </ErrorMessage>

          <ImageModeReader
            v-else-if="folioMode"
            :text-size="textSize"
            :text-width="textWidth"
            :reader-data="data"
          />
          <AlignmentsModeReader
            v-else-if="alignmentsMode"
            :text-size="textSize"
            :text-width="textWidth"
            :reader-data="data"
          />
          <NamedEntitiesModeReader
            v-else-if="namedEntitiesMode"
            :text-size="textSize"
            :text-width="textWidth"
            :reader-data="data"
          />
          <Reader
            v-else
            :lines="data.lines"
            :textSize="textSize"
            :textWidth="textWidth"
          />

          <Paginator :urn="data && data.next" direction="right" />
        </template>
      </ApolloQuery>
    </section>
  </article>
</template>

<script>
  import WIDGETS_NS, { URN } from '@scaife-viewer/scaife-widgets';
  import Reader from '@/reader/components/Reader.vue';
  // eslint-disable-next-line max-len
  import AlignmentsModeReader from '@/reader/components/AlignmentsModeReader.vue';
  import ImageModeReader from '@/reader/components/ImageModeReader.vue';
  // eslint-disable-next-line max-len
  import NamedEntitiesModeReader from '@/reader/components/NamedEntitiesModeReader.vue';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import Paginator from '@/components/Paginator.vue';
  import { SET_PASSAGE, UPDATE_METADATA } from '@/constants';
  import { MODULE_NS } from '@/reader/constants';
  import READER_QUERIES from './queries';

  export default {
    components: {
      ErrorMessage,
      Paginator,
      Reader,
      AlignmentsModeReader,
      ImageModeReader,
      NamedEntitiesModeReader,
    },
    scaifeConfig: {},
    methods: {
      setVersionMetadata() {
        this.$store.dispatch(
          UPDATE_METADATA,
          { urn: this.urn.version },
          { root: true },
        );
      },
      queryUpdate(data) {
        return READER_QUERIES[this.displayMode].update(data);
      },
    },
    watch: {
      urn: {
        immediate: true,
        handler() {
          this.$nextTick(() => {
            this.$parent.$el.scrollTop = 0;
          });
          if (this.urn) {
            this.$store.dispatch(
              SET_PASSAGE,
              { urn: this.urn.toString() },
              { root: true },
            );
          }
        },
      },
      versionMetadata: {
        immediate: true,
        handler() {
          if (!this.versionMetadata && this.urn) {
            this.setVersionMetadata();
          }
        },
      },
    },
    beforeUpdate() {
      if (this.urn && !this.$route.query.urn) {
        this.$router.push({
          to: 'reader',
          query: {
            urn: this.urn.toString(),
          },
        });
      }
      if (this.version !== this.urn.version) {
        this.setVersionMetadata();
      }
    },
    computed: {
      query() {
        return READER_QUERIES[this.displayMode].query;
      },
      queryVariables() {
        return { urn: this.urn.absolute };
      },
      displayMode() {
        return this.$store.state.displayMode;
      },
      folioMode() {
        return this.$store.getters.folioMode;
      },
      alignmentsMode() {
        return this.$store.getters.alignmentsMode;
      },
      namedEntitiesMode() {
        return this.$store.getters.namedEntitiesMode;
      },
      urn() {
        return this.$route.query.urn
          ? new URN(this.$route.query.urn)
          : this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
      },
      version() {
        return this.$store.getters[`${MODULE_NS}/firstPassageUrn`].version;
      },
      workTitle() {
        return this.$store.getters[`${MODULE_NS}/workTitle`];
      },
      textSize() {
        return this.$store.getters[`${WIDGETS_NS}/readerTextSize`];
      },
      textWidth() {
        return this.$store.getters[`${WIDGETS_NS}/readerTextWidth`];
      },
      versionMetadata() {
        return this.$store.state.metadata;
      },
      passageTitle() {
        return this.versionMetadata ? this.versionMetadata.label : null;
      },
      fullHeight() {
        return this.namedEntitiesMode;
      },
    },
  };
</script>

<style lang="scss" scoped>
  article {
    width: 100%;
  }
  section {
    width: 100%;
  }
  .full-height {
    height: 100vh;
    overflow: hidden;
  }
  .reader-heading {
    flex: 1;
  }
  .reader-container {
    align-items: baseline;
    justify-content: left;
    & nav:last-child {
      margin-left: auto;
    }
    ::v-deep .ball-pulse {
      margin-left: auto;
      padding-top: 40px;
    }
  }
</style>
