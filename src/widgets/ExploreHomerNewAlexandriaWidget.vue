<template>
  <div class="new-alexandria-widget u-widget u-flex">
    <NewAlexandria :comments="comments" />
  </div>
</template>

<script>
  import qs from 'querystring';
  import gql from 'graphql-tag';

  import WIDGETS_NS, { NewAlexandria } from '@scaife-viewer/scaife-widgets';

  export default {
    name: 'ExploreHomerNewAlexandriaWidget',
    components: { NewAlexandria },
    scaifeConfig: {
      displayName: 'New Alexandria Commentary',
    },
    data() {
      return {
        passageTextParts: [],
        healedPassage: '',
        comments: null,
      };
    },
    created() {
      if (this.enabled) {
        this.fetchData();
      }
    },
    computed: {
      needsHealing() {
        // special-case handling for the Folios version of
        // the Iliad
        return (
          this.originalPassage.version ===
          'urn:cts:greekLit:tlg0012.tlg001.msA-folios:'
        );
      },
      originalPassage() {
        // the passage retrieved from the store
        return this.$store.getters[`${WIDGETS_NS}/passage`];
      },
      passage() {
        // overrides `NewAlexandriaWidget.computed.passage`
        // so that only the healedPassage is passed to NAC
        // via the `passage` watcher
        return this.healedPassage;
      },
      enabled() {
        return !!this.passage;
      },
      endpoint() {
        return 'https://commentary-api.chs.harvard.edu/graphql';
      },
      params() {
        const gqlQuery = `{
          commentsOn(urn: "${this.passage}") {
            _id
            updated
            latestRevision {
              title
              text
            }
            commenters {
              _id
              name
            }
          }
        }`;
        return this.passage ? qs.stringify({ query: gqlQuery }) : null;
      },
      url() {
        return `${this.endpoint}?${this.params}`;
      },
    },
    watch: {
      passage: 'fetchData',
      originalPassage: {
        immediate: true,
        handler() {
          if (this.needsHealing) {
            this.healFolioURN();
          } else {
            this.healedPassage = this.originalPassage.toString();
          }
        },
      },
      passageTextParts() {
        // after we have retrieved passage text parts,
        // extract the refs and populate healedPassage
        const refs = this.extractPassageTextPartRefs();
        const healedRefs = this.extractHealedRefs(refs);
        this.updateHealedPassage(healedRefs);
      },
    },
    methods: {
      hasLinesInRef(ref) {
        // good: 2r.1.1
        // bad: 12r, 12r.1
        return ref.split('.').length === 3;
      },
      healFolioURN() {
        const refs = this.originalPassage.reference.split('-');
        if (this.hasLinesInRef(refs[0])) {
          const healedRefs = this.extractHealedRefs(refs);
          this.updateHealedPassage(healedRefs);
        } else {
          this.fetchPassageTextParts();
        }
      },
      extractHealedRefs(refs) {
        // pops the folio off of refs,
        // e.g. 12r.1.1-12r.1.7 --> 1.1-1.7
        const healedRefs = [];
        refs.forEach(ref => {
          const refParts = ref.split('.');
          healedRefs.push(refParts.slice(1).join('.'));
        });
        return healedRefs;
      },
      updateHealedPassage(refs) {
        if (refs.length > 0) {
          const refPart = refs.join('-');
          this.healedPassage = `${this.originalPassage.version}${refPart}`;
        }
      },
      fetchData() {
        fetch(this.url)
          .then(response => response.json())
          .then(data => {
            this.comments = data.data.commentsOn;
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error.message);
          });
      },
      fetchPassageTextParts() {
        // retrieves the lowest text parts for a folio level reference,
        // e.g. 12r --> 12r.1.1-12.r.1.25
        const query = gql`
          {
            passageTextParts(
              reference: "${this.originalPassage}"
            ) {
              edges {
                node {
                  id
                  ref
                }
              }
            }
          }
        `;
        this.$gql(query).then(data => {
          this.passageTextParts = data.passageTextParts.edges.map(edge => {
            const { node } = edge;
            return node;
          });
        });
        return query;
      },
      extractPassageTextPartRefs() {
        // extracts the ref(s) from the text parts
        const refs = [];
        // start ref
        refs.push(this.passageTextParts.slice(0, 1)[0].ref);
        if (this.passageTextParts.length > 1) {
          // end ref
          refs.push(this.passageTextParts.slice(-1)[0].ref);
        }
        return refs;
      },
    },
  };
</script>

<style lang="scss">
  .new-alexandria-widget {
    width: 100%;
    img {
      max-width: 100%;
    }
  }
</style>
