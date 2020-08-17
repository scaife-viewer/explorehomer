<script>
  /*
  This widget contains customizations for Explore Homer that handle
  special-case queries tothe New Alexandria Commentary API.
  In the future, we may want to take this type of customization
  into consideration when implementing hooks / extensibility points
  within `scaife-widgets`.
  We may also find that the Vue Composition API
  (https://composition-api.vuejs.org/) lends itself to these types of
  customizations.
  */
  import gql from 'graphql-tag';

  import { MODULE_NS } from '@scaife-viewer/store';
  import NewAlexandriaWidget from '@scaife-viewer/widget-new-alexandria';

  export default {
    extends: NewAlexandriaWidget,
    name: 'EHNewAlexandriaWidget',
    scaifeConfig: {
      displayName: 'New Alexandria Commentary',
    },
    data: () => ({
      passageTextParts: [],
      healedPassage: '',
    }),
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
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      passage() {
        // overrides `NewAlexandriaWidget.computed.passage`
        // so that only the healedPassage is passed to NAC
        // via the `passage` watcher
        return this.healedPassage;
      },
    },
    watch: {
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
