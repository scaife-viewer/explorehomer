<template>
  <aside class="toc-container">
    <h3 lang="ar" v-if="toc.title">{{ toc.title }}</h3>
    <p class="u-legend">{{ toc.description }}</p>
    <div class="u-grid toc-grid" v-if="toc.items.length">
      <template v-for="(item, index) in toc.items">
        <span :key="`index-${index}`" class="ref">{{ index + 1 }}.</span>
        <div :key="`item-${index}`" class="item u-flex">
          <slot name="item-link">
            <router-link class="item-link" lang="ar" :to="getItemPayload(item.uri)">
              {{ item.title }}
            </router-link>
          </slot>
          <span v-if="showURNs">
            <tt>{{ item.uri }}</tt>
          </span>
        </div>
      </template>
    </div>
    <h4 v-else>{{ noResultsMessage }}</h4>
  </aside>
</template>

<script>
  export default {
    name: 'TOC',
    props: ['toc', 'showURNs', 'getItemPayload', 'noResultsMessage'],
    computed: {
      showingRootTOC() {
        return this.toc && this.toc.urn === 'urn:cite:dsp-dar:toc.root';
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../variables';
  h3:lang(ar) {
    font-family: $ar-font-family;
    font-size: $ar-default-font-size * 2 !important;
    direction: rtl;
  }
  .item-link:lang(ar) {
    font-family: $ar-font-family;
    font-size: $ar-default-font-size;
    direction: rtl;
  }
  .toc-container {
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
  }
  .toc-grid {
    align-items: baseline;
    grid-template-columns: auto 9.25fr;
    grid-column-gap: 1em;
    > * {
      margin-bottom: 0.33em;
    }
  }
  p {
    margin: 0.66em 0;
  }
  span.ref {
    font-size: 10pt;
    color: #69c;
    font-family: 'Noto Sans';
    text-align: left;
  }
  .item {
    flex-direction: column;
  }
</style>
