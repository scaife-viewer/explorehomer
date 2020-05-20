<template>
  <span class="token" :class="{ selected }" @click.prevent="onSelect">
    {{ token.value }}
  </span>
</template>

<script>
  import { SELECT_TOKEN, MODULE_NS } from '../constants';

  export default {
    props: ['token'],
    methods: {
      onSelect() {
        this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
          token: this.token,
        });
      },
    },
    computed: {
      selected() {
        if (!this.selectedToken) {
          return false;
        }
        const { entities, veRef } = this.selectedToken;
        const entity = entities[0];
        return (
          veRef === this.token.veRef ||
          (entity && entity === this.token.entities[0])
        );
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .token {
    cursor: pointer;
    &.selected {
      font-weight: bold;
    }
  }
</style>
