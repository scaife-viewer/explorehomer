<template>
  <div class="open-seadragon">
    <div id="image-toolbar" class="toolbar">
      <span v-show="displayViewer">
        <small>
          <a id="zoom-in" class="link" title="Zoom in">Zoom In</a>
          <span>&vert;&nbsp;</span>
          <a id="zoom-out" class="link" title="Zoom out">Zoom Out</a>
          <span>&vert;&nbsp;</span>
          <a id="home" class="link" title="Go home">Home</a>
          <span>&vert;&nbsp;</span>
          <a id="full-page" class="link" title="Toggle full page">Full Page</a>
        </small>
      </span>
      <div v-show="displayViewer" id="image-viewer" class="viewer"></div>
      <div v-show="errorMessage" class="error">
        <i class="fa fa-times-circle"></i>
        <span>&nbsp;<strong>Error:</strong></span>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import OpenSeadragon from 'openseadragon';

  export default {
    props: ['imageIdentifier'],
    data() {
      return {
        viewer: null,
        displayViewer: false,
        errorMessage: null,
      };
    },
    watch: {
      imageIdentifier: {
        immediate: true,
        handler() {
          this.updateImage();
        },
      },
      viewer: {
        immediate: true,
        handler() {
          this.updateImage();
        },
      },
    },
    computed: {
      viewerOptions() {
        return {
          // options: http://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#Viewer
          maxZoomLevel: 5,
          showNavigator: true,
          homeFillsViewer: true,
          zoomInButton: 'zoom-in',
          zoomOutButton: 'zoom-out',
          homeButton: 'home',
          fullPageButton: 'full-page',
          id: 'image-viewer',
        };
      },
    },
    methods: {
      updateImage() {
        if (this.imageIdentifier && this.viewer) {
          this.viewer.open([`${this.imageIdentifier}info.json`]);
        }
      },
      initViewer() {
        if (!this.viewer) {
          const instanceOptions = this.viewerOptions;
          this.viewer = OpenSeadragon(instanceOptions);
        }
        const openHandler = () => {
          this.errorMessage = null;
          this.displayViewer = true;
        }
        const openFailedHandler = err => {
          this.errorMessage = err.message;
          this.displayViewer = false;
        }
        this.viewer.addHandler('open', openHandler, false);
        this.viewer.addHandler('open-failed', openFailedHandler, false);
      },
    },
    mounted() {
      this.initViewer();
      this.displayViewer = false;
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/variables.scss';

  .open-seadragon {
    flex: 1;
    height: 100vh;
    .viewer {
      width: 100%;
      height: 100vh;
    }

    .error {
      margin: 10px 0px;
      padding:12px;
      color: #D8000C;
      background-color: #FFD2D2;
      vertical-align: middle;
      max-width: 40em;
    }
  }
</style>
