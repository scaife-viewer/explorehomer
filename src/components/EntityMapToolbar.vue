<template>
  <div class="entity-map-toolbar">
    <a href :class="{ active: noMap }" @click.prevent="$emit('show', null)">
      <icon name="align-justify" />
    </a>
    <a
      href
      :class="{ active: showVertical }"
      @click.prevent="$emit('show', 'vertical')"
    >
      <icon name="grip-lines" />
    </a>
    <a
      href
      :class="{ active: showHorizontal }"
      @click.prevent="$emit('show', 'horizontal')"
    >
      <icon name="grip-lines-vertical" />
    </a>
  </div>
</template>

<script>
  export default {
    props: ['showMap'],
    computed: {
      noMap() {
        return this.showMap === null;
      },
      showHorizontal() {
        return this.showMap === 'horizontal';
      },
      showVertical() {
        return this.showMap === 'vertical';
      },
    }
  }
</script>

<style lang="scss" scoped>
  .entity-map-toolbar {
    display: flex;
    padding-bottom: 0.75rem;
    a {
      margin: 0 0.5rem;
      padding: 0.25rem;
      border-radius: 3px;
      border: 1px solid transparent;
    }
    a:hover {
      border-color: $explorehomer-brand;
    }
    a.active {
      font-weight: 700;
      background: $explorehomer-brand;
      color: $white;
      border-color: transparent;
    }
  }
</style>
