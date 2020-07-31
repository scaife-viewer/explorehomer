<template>
  <li>
    <div class="node-container u-flex" :class="{ highlight }">
      <template v-if="hasChildren">
        <span class="open-toggle" @click.prevent="toggle">
          <icon :name="icon" class="fa-xs" />
        </span>
      </template>

      <span class="node version" v-if="routable">
        <router-link
          :to="{ path: 'reader', query: { urn: metadata.firstPassageUrn } }"
        >
          {{ metadata.label }}
        </router-link>
      </span>
      <span v-else class="node parent">
        <tt>{{ metadata.label }}</tt>
      </span>
    </div>

    <ul class="node-tree" v-if="expanded">
      <Node v-for="(node, index) in node.children" :key="index" :node="node" />
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'Node',
    props: ['node'],
    data() {
      return {
        expanded: false,
      };
    },
    watch: {
      readerUrn: {
        immediate: true,
        handler() {
          if (this.nodeUrnIndex > -1) {
            this.expanded = true;
          }
        },
      },
    },
    computed: {
      highlight() {
        return this.readerUrn && this.readerUrn.version === this.urn;
      },
      nodeUrnIndex() {
        return this.readerUrn && this.readerUrn.absolute.indexOf(
          this.urn.slice(0, this.urn.length - 1), // trim trailing colon
        );
      },
      readerUrn() {
        return this.$store.getters.urn;
      },
      urn() {
        // TODO: Cast to URN post-refactor.
        return this.node.data.urn;
      },
      kind() {
        return this.node.data.kind;
      },
      metadata() {
        return this.node.data.metadata;
      },
      routable() {
        return this.kind === 'version';
      },
      icon() {
        return this.expanded ? 'chevron-down' : 'chevron-right';
      },
      hasChildren() {
        return this.node.children && this.node.children.length;
      },
    },
    methods: {
      toggle() {
        this.expanded = !this.expanded;
      },
    },
  };
</script>

<style lang="scss" scoped>
  li {
    margin-top: 0.33em;
  }
  span {
    text-decoration: none;
    &.open-toggle {
      color: $gray-400;
      padding: 0 0.33em 0 0;
      &:hover {
        color: $gray-700;
      }
    }
  }
  .highlight {
    font-weight: 700;
  }
  .node {
    &.version {
      margin-left: 0.5em;
      font-size: 0.8em;
    }
    &.parent {
      > tt {
        font-family: inherit;
      }
    }
  }
</style>
