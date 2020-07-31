<template>
  <div class="audio-widget">
    <audio
      ref="sound"
      controls
      :src="nowPlaying"
      :class="nowPlaying === null ? 'hide' : 'show'"
    >
      No audio support
    </audio>
    <EmptyMessage v-if="nowPlaying === null" />
    <Attribution v-else>
      <!-- @@@ extract attribution from audio annotations  -->
      &copy; 2016
      <a href="https://hypotactic.com/" target="_blank">David Chamberlain</a>
      under
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"
        >CC BY 4.0 License</a
      >
    </Attribution>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import { PLAY_AUDIO, STOP_AUDIO } from '@/constants';
  import Attribution from '@/components/Attribution.vue';

  export default {
    scaifeConfig: {
      displayName: 'Audio',
    },
    components: { Attribution },
    data() {
      return {
        nowPlayingIndex: 0,
        currentTime: 0,
      };
    },
    watch: {
      currentSelection: {
        immediate: true,
        handler() {
          if (this.currentSelection !== null) {
            const index = this.audios.findIndex(a => {
              return a.data.references[0] === this.currentSelection;
            });
            if (index > -1) {
              this.nowPlayingIndex = index;
              this.$nextTick(() => this.start());
            }
          }
        },
      },
    },
    methods: {
      start() {
        this.$refs.sound.play();
      },
      stop() {
        this.$refs.sound.pause();
      },
      onTimeUpdate() {
        this.currentTime = this.$refs.sound.currentTime;
      },
      onStarted() {
        const ref = this.audios[this.nowPlayingIndex].data.references[0];
        this.$store.dispatch(PLAY_AUDIO, { ref });
      },
      onEnded() {
        this.$store.dispatch(STOP_AUDIO);
        if (this.nowPlayingIndex < this.audios.length - 1) {
          this.nowPlayingIndex += 1;
          this.$nextTick(() => {
            this.start();
          });
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.sound.addEventListener('timeupdate', this.onTimeUpdate);
        this.$refs.sound.addEventListener('ended', this.onEnded);
        this.$refs.sound.addEventListener('play', this.onStarted);
      });
    },
    beforeDestroy() {
      this.stop();
      this.$refs.sound.removeEventListener('timeupdate', this.onTimeUpdate);
      this.$refs.sound.removeEventListener('ended', this.onEnded);
    },
    computed: {
      currentSelection() {
        return this.$store.state.selectedLine;
      },
      audio() {
        if (this.nowPlayingIndex >= this.audios.length) {
          return null;
        }
        return this.audios[this.nowPlayingIndex];
      },
      nowPlaying() {
        return this.audio && this.audio.assetUrl;
      },
      attribution() {
        return this.audio && this.audio.data.attribution;
      },
      sound() {
        return this.$refs.sound;
      },
      urn() {
        return this.$store.getters.urn;
      },
      audios() {
        return this.audioData ? this.audioData : [];
      },
      audioMap() {
        return this.audios.reduce((map, obj) => {
          return {
            ...map,
            [obj.data.references[0]]: obj.assetUrl,
          };
        }, {});
      },
    },
    apollo: {
      audioData: {
        query: gql`
          query Audio($urn: String!) {
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  audioAnnotations {
                    edges {
                      node {
                        data
                        assetUrl
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.passageTextParts.edges
            .map(e => e.node.audioAnnotations.edges.map(a => a.node))
            .flat();
        },
        skip() {
          return this.urn === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/variables';
  .audio-widget {
    margin: 0 2rem;
    flex: 1;
  }
  .hide {
    display: none;
  }
  .show {
    display: inherit;
  }
  button {
    display: block;
    width: 100%;
    outline: none;
    background: $gray-100;
    border: 1px solid $gray-300;
    cursor: pointer;
    border-radius: 3px;
    font-size: 14px;
    padding: 0.5rem;
    color: $gray-700;
    &:hover {
      background: $gray-200;
      color: $gray-800;
    }
  }
  .audio-on {
    button {
      background: $explorehomer-brand;
      border-color: $explorehomer-darker-brand;
      color: $gray-100;
      &:hover {
        background: $explorehomer-darker-brand;
        color: $white;
      }
    }
  }
</style>
