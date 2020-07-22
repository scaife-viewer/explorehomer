<template>
  <div class="image-viewer-toolbar">
    <a href :class="{ active: showText }" @click.prevent="onShowText">
      <icon name="align-left" />
    </a>
    <a href :class="{ active: showImage }" @click.prevent="onShowImage">
      <icon name="book-open" />
    </a>
    <a href :class="{ active: showBoth }" @click.prevent="onShowBoth">
      <icon name="align-left" /> |
      <icon name="book-open" />
    </a>
  </div>
</template>

<script>
  import {
    IMAGE_VIEWER_STATE_TEXT,
    IMAGE_VIEWER_STATE_IMAGE,
    IMAGE_VIEWER_STATE_BOTH,
  } from '@/constants';

  export default {
    props: ['show'],
    computed: {
      showText() {
        return this.show === IMAGE_VIEWER_STATE_TEXT;
      },
      showImage() {
        return this.show === IMAGE_VIEWER_STATE_IMAGE;
      },
      showBoth() {
        return this.show === IMAGE_VIEWER_STATE_BOTH;
      },
    },
    methods: {
      onShowText() {
        this.$emit('show', IMAGE_VIEWER_STATE_TEXT);
      },
      onShowImage() {
        this.$emit('show', IMAGE_VIEWER_STATE_IMAGE);
      },
      onShowBoth() {
        this.$emit('show', IMAGE_VIEWER_STATE_BOTH);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .image-viewer-toolbar {
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
