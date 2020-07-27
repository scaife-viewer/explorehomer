<template>
  <div class="entity-map-toolbar">
    <a href :class="{ active: noMap }" @click.prevent="onNone">
      <icon name="align-left" />
    </a>
    <a href :class="{ active: showVertical }" @click.prevent="onVertical">
      <icon name="grip-lines" />
    </a>
    <a href :class="{ active: showHorizontal }" @click.prevent="onHorizontal">
      <icon name="grip-lines-vertical" />
    </a>
  </div>
</template>

<script>
  import {
    MAP_STATE_HORIZONTAL,
    MAP_STATE_VERTICAL,
    MAP_STATE_NONE,
  } from '@/constants';

  export default {
    props: ['mapState'],
    methods: {
      onNone() {
        this.$emit('show', MAP_STATE_NONE);
      },
      onVertical() {
        this.$emit('show', MAP_STATE_VERTICAL);
      },
      onHorizontal() {
        this.$emit('show', MAP_STATE_HORIZONTAL);
      },
    },
    computed: {
      noMap() {
        return this.mapState === MAP_STATE_NONE;
      },
      showHorizontal() {
        return this.mapState === MAP_STATE_HORIZONTAL;
      },
      showVertical() {
        return this.mapState === MAP_STATE_VERTICAL;
      },
    },
  };
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
