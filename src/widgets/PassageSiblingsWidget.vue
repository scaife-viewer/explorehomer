<template v-if="siblings">
  <div class="passage-siblings-widget u-widget u-grid">
    <div
      class="grid-cell-square"
      v-for="sibling in siblings"
      :key="sibling.urn"
    >
      <a v-if="sibling.selected" class="active-sibling">
        {{ sibling.lcp }}
      </a>
      <router-link
        v-else
        :to="{ path: 'reader', query: { urn: `${sibling.urn}` } }"
      >
        {{ sibling.lcp }}
      </router-link>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import WIDGETS_NS from '@scaife-viewer/scaife-widgets';

  export default {
    name: 'PassageSiblingsWidget',
    scaifeConfig: {
      displayName: 'Siblings',
    },
    computed: {
      passage() {
        return this.$store.getters[`${WIDGETS_NS}/passage`];
      },
      siblings() {
        if (this.siblingsData === undefined) {
          return [];
        }
        const { selected } = this.siblingsData;
        return this.siblingsData.all.map(s => {
          return {
            ...s,
            selected: selected.filter(s2 => s2.urn === s.urn).length > 0,
          };
        });
      },
    },
    apollo: {
      siblingsData: {
        query: gql`
          query Siblings($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata {
                siblings {
                  all
                  selected
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.passage.absolute };
        },
        update(data) {
          const { all, selected } = data.passageTextParts.metadata.siblings;
          return { all, selected };
        },
        skip() {
          return !this.passage;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
  .passage-siblings-widget {
    width: 100%;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(auto-fill, minmax(1.6em, 1fr));
  }
  .passage-siblings-widget * {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.7rem;
    padding: 0.1rem 0.3rem;
  }
  .passage-siblings-widget a {
    border: none;
  }
  a:not(.active-sibling):hover {
    background: var(--scaife-sibling-hover-background, $gray-100);
  }
  .active-sibling {
    font-weight: bold;
    color: $white;
    background: var(--scaife-brand-color, $gray-800);
  }
</style>
