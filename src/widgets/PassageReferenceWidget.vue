<template>
  <div class="passage-reference-widget u-widget">
    <input
      v-model="reference"
      v-on:keyup.enter="handleKeyUp"
      v-on:click="handleClick"
      type="text"
      class="form-control form-control-sm"
    />
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import WIDGETS_NS from '@scaife-viewer/scaife-widgets';

  export default {
    name: 'PassageReferenceWidget',
    scaifeConfig: {
      displayName: 'Passage Reference',
    },
    watch: {
      passage: {
        handler: 'setInputRef',
        immediate: true,
      },
    },
    computed: {
      firstPassageUrn() {
        return this.$store.getters[`${WIDGETS_NS}/firstPassageUrn`];
      },
      passage() {
        return this.$store.getters[`${WIDGETS_NS}/passage`];
      },
    },
    data() {
      return {
        reference: '',
      };
    },
    methods: {
      setInputRef() {
        if (this.passage) {
          this.reference = this.passage.reference;
        }
      },
      handleKeyUp() {
        const urn = `${this.passage.version}${this.reference}`;
        this.$apollo
          .query({
            query: gql`
              query ValidateReference($urn: String!) {
                passageTextParts(reference: $urn) {
                  metadata {
                    healedPassage
                    humanReference
                  }
                }
              }
            `,
            variables: { urn },
            skip: this.reference === '',
          }).then(data => {
            console.log('Passage Data', data.data.passageTextParts.metadata);
            const { healedPassage } = data.data.passageTextParts.metadata;
            const ref = healedPassage || urn;
            this.$router.push({ to: 'reader', query: { urn: ref } });
          }).catch(error => {
            console.log('Passage Error', error);
          });
      },
      handleClick(e) {
        const el = e.currentTarget;
        el.select();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .passage-reference-widget {
    margin: 0 2em;
    flex: 1;
    overflow-y: unset;

    input {
      outline: none;
    }
  }
</style>
