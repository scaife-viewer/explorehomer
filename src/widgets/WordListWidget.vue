<template>
  <div class="word-list-widget u-widget u-flex">
    <WordList v-if="filteredWordList.length > 0" :wordList="filteredWordList" />
    <EmptyMessage v-else />
  </div>
</template>

<script>
  import WIDGETS_NS, { WordList } from '@scaife-viewer/scaife-widgets';
  import { MODULE_NS } from '@/reader/constants';

  export default {
    name: 'WordListWidget',
    scaifeConfig: {
      displayName: 'Word List',
    },
    components: {
      WordList,
    },
    created() {
      if (this.enabled) {
        this.fetchData();
      }
    },
    data() {
      return {
        wordList: [],
      };
    },
    watch: {
      passage: 'fetchData',
    },
    computed: {
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
      filteredWordList() {
        if (this.selectedToken === null) {
          return this.wordList;
        }
        return this.wordList.filter(w => w.text === this.selectedToken.lemma);
      },
      enabled() {
        // TODO: Stubbed until metadata ingestion update.
        // return this.passage && this.metadata.lang === 'grc';
        return this.passage;
      },
      metadata() {
        return this.$store.getters[`${WIDGETS_NS}/metadata`];
      },
      passage() {
        return this.$store.getters[`${WIDGETS_NS}/passage`];
      },
      endpoint() {
        return 'https://vocab.perseus.org/word-list';
      },
      url() {
        const params = 'page=all&amp;o=1';
        return this.passage
          ? `${this.endpoint}/${this.passage}/json/?${params}`
          : null;
      },
    },
    methods: {
      fetchData() {
        fetch(this.url)
          .then(response => response.json())
          .then(data => {
            this.wordList = data.lemmas.map(lemma => ({
              text: lemma.lemma_text,
              shortdef: lemma.shortdef,
              frequency: lemma.work_frequency.toFixed(2),
            }));
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error.message);
          });
      },
    },
  };
</script>

<style lang="scss">
  .word-list-widget {
    width: 100%;
  }
</style>
