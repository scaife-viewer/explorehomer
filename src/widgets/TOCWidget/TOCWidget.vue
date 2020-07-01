<template>
  <div class="toc-widget u-widget u-flex">
    <TOCHeader
      :toc="toc"
      :showURNs="showURNs"
      :showingRootToc="showingRootToc"
      :getRootTOCPayload="getRootTOCPayload"
      :placeholder="placeholder"
      :show-toggle="showToggle"
      @filter-data="filterData"
      @toggle-urns="toggleURNs"
    />
    <TOC
      v-if="toc"
      :toc="filtered || toc"
      :showURNs="showURNs"
      :noResultsMessage="noResultsMessage"
      :getItemPayload="getItemPayload"
    />
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { WIDGETS_NS } from '@scaife-viewer/scaife-widgets';

  import TOC from './TOC.vue';
  import TOCHeader from './TOCHeader.vue';

  export default {
    name: 'TOCWidget',
    components: {
      TOCHeader,
      TOC,
    },
    scaifeConfig: {
      displayName: 'Table of Contents',
    },
    watch: {
      $route() {
        this.filtered = null;
      },
    },
    data() {
      return {
        filtered: null,
        showURNs: false,
        showToggle: true,
      };
    },
    computed: {
      gqlQuery() {
        return gql`
          {
            tocs(urn:  "${this.tocUrn}") {
              edges {
                node {
                  title
                  description
                  urn
                  entries {
                    edges {
                      node {
                        title
                        uri
                      }
                    }
                  }
                }
              }
            }
          }
        `;
      },
      toc() {
        if (!this.gqlData) {
          return null;
        }
        // @@@ consider making more of this functionality "first-class"
        // in ATLAS
        const node = this.transformTOC(this.gqlData.tocs.edges[0].node);
        const toc = {
          ...node,
          items: node.entries.edges.map(entry =>
            this.transformEntry(entry.node),
          ),
        };
        return toc;
      },
      placeholder() {
        return 'Filter this table of contents...';
      },
      noResultsMessage() {
        return 'No results.';
      },
      metadata() {
        return this.$store.getters[`${WIDGETS_NS}/metadata`];
      },
      showingRootToc() {
        if (!this.$route.query.toc && this.initialTocUrn === this.rootTocUrn) {
          return true;
        }
        if (this.$route.query.toc === this.rootTocUrn) {
          return true;
        }
        return false;
      },
      defaultTocUrn() {
        return this.metadata && this.metadata.defaultTocUrn
          ? this.metadata.defaultTocUrn
          : null;
      },
      initialTocUrn() {
        return this.defaultTocUrn || this.rootTocUrn;
      },
      rootTocUrn() {
        // @@@ site level or dynamic from ATLAS
        return 'urn:cite2:exploreHomer:toc.v1.root';
      },
      tocUrn() {
        return this.$route.query.toc || this.initialTocUrn;
      },
    },
    methods: {
      transformTOC(tocObj) {
        const toc = {
          ...tocObj,
        };
        if (toc.urn === 'urn:cite2:exploreHomer:toc.v1.root') {
          toc.title = '';
        }
        return toc;
      },
      transformEntry(entryObj) {
        return { ...entryObj };
      },
      isCiteUrn(urn) {
        return urn.startsWith('urn:cite:');
      },
      getItemPayload(urn) {
        if (this.isCiteUrn(urn)) {
          return {
            name: 'reader',
            query: {
              ...this.$route.query,
              toc: urn,
            },
          };
        }
        return {
          name: 'reader',
          query: {
            ...this.$route.query,
            urn,
          },
        };
      },
      getRootTOCPayload() {
        const query = {
          ...this.$route.query,
          toc: this.rootTocUrn,
        };
        return { query };
      },
      toggleURNs() {
        this.showURNs = !this.showURNs;
      },
      filterData(data) {
        this.filtered = data;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .toc-widget {
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }
</style>
