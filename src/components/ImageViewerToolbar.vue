<template>
  <div class="image-viewer-toolbar">
    <a
      href
      :class="{ active: showText }"
      @click.prevent="$emit('show', 'text')"
    >
      <icon name="align-justify" />
    </a>
    <a
      href
      :class="{ active: showImage }"
      @click.prevent="$emit('show', 'image')"
    >
      <icon name="book-open" />
    </a>
    <a
      href
      :class="{ active: showBoth }"
      @click.prevent="$emit('show', 'both')"
    >
      <icon name="align-justify" /> |
      <icon name="book-open" />
    </a>
  </div>
</template>

<script>
  export default {
    props: ['show'],
    computed: {
      showText() {
        return this.show === 'text';
      },
      showImage() {
        return this.show === 'image';
      },
      showBoth() {
        return this.show === 'both';
      },
    }
  }
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
