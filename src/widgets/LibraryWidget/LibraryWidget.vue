<template>
  <div class="library-widget u-widget u-flex">
    <ul class="node-tree root" v-if="libraryTree">
      <Node v-for="(node, index) in libraryTree" :key="index" :node="node" />
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import Node from './Node.vue';

  export default {
    name: 'LibraryWidget',
    apollo: {
      libraryData: {
        query: gql`
          {
            tree(urn: "urn:cts:", upTo: "version") {
              tree
            }
          }
        `,
        // we want to access the data as `libraryData`
        update: data => data,
      },
    },
    components: {
      Node,
    },
    scaifeConfig: {
      displayName: 'Library',
    },
    methods: {
      getTextGroupsTree() {
        const nid = this.libraryData.tree.tree[0];
        return nid.children.reduce((a, b) => {
          return a.concat(b.children);
        }, []);
      },
    },
    computed: {
      libraryTree() {
        return this.libraryData ? this.getTextGroupsTree() : [];
      },
    },
  };
</script>

<style lang="scss">
  .u-widget.library-widget {
    margin: 0 auto 0 2em;
    width: 100%;
    overflow: auto;
  }
  ul.node-tree {
    padding: 0;
    flex-wrap: nowrap;
    margin-left: 1em;
    &.root {
      margin: 0 0 0.92em 0;
    }
  }
</style>
