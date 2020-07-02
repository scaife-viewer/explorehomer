<script>
  import gql from 'graphql-tag';

  import WIDGETS_NS, {
    NewAlexandriaWidget,
  } from '@scaife-viewer/scaife-widgets';

  export default {
    extends: NewAlexandriaWidget,
    name: 'NewAlexandriaWidget',
    scaifeConfig: {
      displayName: 'New Alexandria Commentary',
    },
    data: () => ({
      resolvedPassageTextParts: [],
      healedPassage: '',
    }),
    computed: {
      originalPassage() {
        return this.$store.getters[`${WIDGETS_NS}/passage`];
      },
      passage() {
        return this.healedPassage;
      },
    },
    watch: {
      originalPassage: {
        immediate: true,
        handler() {
          if (
            this.originalPassage.version ===
            'urn:cts:greekLit:tlg0012.tlg001.msA-folios:'
          ) {
            this.healFolioURN();
          } else {
            this.healedPassage = this.originalPassage.toString();
          }
        },
      },
      resolvedPassageTextParts() {
        const refs = [];
        refs.push(this.resolvedPassageTextParts.slice(0, 1)[0].ref);
        if (this.resolvedPassageTextParts.length > 1) {
          refs.push(this.resolvedPassageTextParts.slice(-1)[0].ref);
        }
        this.extractHealedRefs(refs);
      },
    },
    methods: {
      extractHealedRefs(refs) {
        const healedRefs = [];
        refs.forEach(ref => {
          const refParts = ref.split('.');
          if (refParts.length > 1) {
            healedRefs.push(refParts.slice(1).join('.'));
          } else {
            this.getPassageTextParts();
          }
        });
        if (healedRefs.length > 0) {
          const refPart = healedRefs.join('-');
          this.healedPassage = `${this.originalPassage.version}${refPart}`;
        }
      },
      getPassageTextParts() {
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
          this.resolvedPassageTextParts = data.passageTextParts.edges.map(
            edge => {
              const { node } = edge;
              return node;
            },
          );
        });
        return query;
      },
      healFolioURN() {
        const refs = this.originalPassage.reference.split('-');
        this.extractHealedRefs(refs);
      },
    },
  };
</script>
