<template>
  <Reader :lines="lines" />
</template>

<script>
import Reader from '../reader/components/Reader.vue';

export default {
  scaifeConfig: {
    displayName: 'Reader',
    location: 'main',
  },
  components: {
    Reader,
  },
  computed: {
    lines() {
      // @@@ retrieve via GraphQL
      return [
        {
          label: '1.1',
          textContent: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
        },
        {
          label: '1.2',
          textContent: 'οὐλομένην, ἣ μυρίʼ Ἀχαιοῖς ἄλγεʼ ἔθηκε,',
        },
      ];
    },
  },
};
</script>
