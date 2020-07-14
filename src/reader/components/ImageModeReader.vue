<template>
  <div class="image-mode" :class="showImage">
    <LoaderBall v-if="loading" />
    <template v-else>
      <ImageViewerToolbar :show="showImage" @show="onShowImage" />
      <div class="image-mode-container" v-if="showImage === 'both'">
        <Reader
          :lines="data.lines"
          :textSize="textSize"
          :textWidth="textWidth"
        />
        <ImageViewer
          v-if="data.imageIdentifier"
          :imageIdentifier="data.imageIdentifier"
        />
        <EmptyMessage class="reader-empty-annotations" v-else />
      </div>
      <Reader
        v-else-if="showImage === 'text'"
        :lines="data.lines"
        :textSize="textSize"
        :textWidth="textWidth"
      />
      <ImageViewer
        v-else-if="showImage === 'image' && data.imageIdentifier"
        :imageIdentifier="data.imageIdentifier"
      />
      <EmptyMessage class="reader-empty-annotations" v-else />
    </template>
  </div>
</template>

<script>
  import ImageViewer from '@/components/ImageViewer.vue';
  import ImageViewerToolbar from '@/components/ImageViewerToolbar.vue';
  import Reader from './Reader.vue';
  import { IMAGE_VIEWER_STATE_BOTH } from '@/constants';

  export default {
    props: {
      textSize: String,
      textWidth: String,
      loading: Boolean,
      data: Object,
    },
    components: {
      ImageViewer,
      ImageViewerToolbar,
      Reader,
    },
    data() {
      return {
        showImage: IMAGE_VIEWER_STATE_BOTH,
      };
    },
    methods: {
      onShowImage(kind) {
        this.showImage = kind;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .image-mode {
    flex: 1;
    &.both {
      .image-mode-container {
        grid-template-columns: 1fr 1fr;
        column-gap: 0.75rem;
      }
    }
    &.text,
    &.image {
      .image-mode-container {
        grid-template-columns: 1fr;
      }
    }
    .image-mode-container {
      display: grid;
      height: calc(100vh - 75px);
    }
  }
</style>
