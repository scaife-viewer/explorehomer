<template>
  <div class="library-widget u-widget u-flex">
    <LoaderBall v-if="gqlLoading" />
    <ul class="node-tree root" v-else-if="libraryTree">
      <Node v-for="(node, index) in libraryTree" :key="index" :node="node" />
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import Node from './Node.vue';

  export default {
    name: 'LibraryWidget',
    components: {
      Node,
    },
    scaifeConfig: {
      displayName: 'Library',
    },
    computed: {
      gqlQuery() {
        return gql`
          {
            tree(urn: "urn:cts:", upTo: "version") {
              tree
            }
          }
        `;
      },
      libraryTree() {
        const nid = this.gqlData.tree.tree[0] || { children: [] };
        return nid.children.reduce((a, b) => {
          return a.concat(b.children);
        }, []);
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
