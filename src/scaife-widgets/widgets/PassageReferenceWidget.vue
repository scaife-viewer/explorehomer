<template>
  <div class="passage-reference-widget">
    <input
      v-model="reference"
      v-on:keyup="handleKeyUp"
      v-on:click="handleClick"
      type="text"
      class="form-control form-control-sm"
    />
  </div>
</template>

<script>
  import { MODULE_NS } from '../constants';

  export default {
    scaifeConfig: {
      displayName: 'Passage Reference',
      singleton: true,
      location: 'sidebar',
    },
    watch: {
      passage: {
        handler: 'setInputRef',
        immediate: true,
      },
    },
    computed: {
      initialPassage() {
        return this.$store.getters[`${MODULE_NS}/initialPassage`];
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
    },
    data() {
      return {
        reference: '',
      };
    },
    methods: {
      setInputRef() {
        this.reference = this.passage.reference;
      },
      handleKeyUp(e) {
        if (e.keyCode === 13) {
          this.$router.push({
            to: 'reader',
            query: {
              urn: this.reference
                ? `${this.passage.version}:${this.reference}`
                : this.initialPassage.absolute,
            },
          });
        } else {
          e.stopPropagation();
        }
      },
      handleClick(e) {
        const el = e.currentTarget;
        el.select();
      },
    },
  };
</script>

<style lang="scss">
  @import '../_variables.scss';
  .passage-reference-widget {
    margin: 0 2em;
    flex: 1;
  }
  // TODO: Break out/rationalise.
  .form-control {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.2rem;
    width: 100%;
    border: 1px solid #ced4da;
  }
</style>
