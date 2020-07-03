<template>
  <span
    class="token"
    :class="{
      selected,
      interlinear,
      'place-selected': placeSelected,
      entity: namedEntities && isEntity,
      'selected-entity': namedEntities && hasSelectedEntity,
    }"
    @click="onSelect"
  >
    <template v-if="interlinear">
      <span class="ref">{{ token.veRef }}</span>
      <span class="text">{{ token.value }}</span>
      <span class="lemma">{{ token.lemma || '-' }}</span>
      <span class="pos">{{ token.partOfSpeech || '-' }}</span>
      <span class="analysis">{{ token.tag || '-' }}</span>
    </template>
    <template v-else>
      <span class="text">{{ token.value }}</span
      >{{ ' ' }}
    </template>
  </span>
</template>

<script>
  import { SELECT_TOKEN, MODULE_NS } from '../constants';
  import { SELECT_NAMED_ENTITIES } from '../../constants';

  export default {
    props: ['token', 'mapPlaceSelected'],
    methods: {
      onSelect() {
        this.$store.dispatch(SELECT_NAMED_ENTITIES, {
          entities: this.token.entities,
        });
        this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
          token: this.token,
        });
      },
    },
    computed: {
      placeSelected() {
        if (!this.isEntity || !this.namedEntities) {
          return false;
        }
        return (
          this.token.entities.filter(id => id === this.mapPlaceSelected)
            .length > 0
        );
      },
      selectedEntities() {
        return this.$store.state.selectedNamedEntities;
      },
      interlinear() {
        return this.$store.state.displayMode === 'interlinear';
      },
      namedEntities() {
        return this.$store.state.displayMode === 'named-entities';
      },
      isEntity() {
        return this.token.entities.length > 0;
      },
      hasSelectedEntity() {
        return (
          this.token.entities.filter(
            id => this.selectedEntities.filter(sid => sid === id).length > 0,
          ).length > 0
        );
      },
      selected() {
        if (!this.selectedToken) {
          return false;
        }
        if (this.namedEntities) {
          const { entities, veRef } = this.selectedToken;
          const entity = entities[0];
          return (
            veRef === this.token.veRef ||
            (entity && entity === this.token.entities[0])
          );
        }
        return this.selectedToken.veRef === this.token.veRef;
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../styles/variables';
  .token .text {
    cursor: pointer;
  }
  .token.selected .text {
    @include highlight($selected-token);
  }
  .token.entity .text {
    @include highlight($entity);
  }
  .token.selected-entity .text {
    @include highlight($selected-entity);
  }
  .token.entity.place-selected .text {
    @include highlight($place-selected-entity);
  }
  .token.interlinear {
    display: inline-block;
    padding: 2px 4px;
    margin: 0 4px 10px;
    > span {
      display: block;
    }
    .ref {
      font-family: 'Lucida Console', Monaco, monospace;
      font-size: 0.55em;
      color: #999;
    }
    .text {
      font-size: 1em;
      font-weight: 700;
      color: #000;
    }
    .lemma {
      font-size: 0.88em;
      color: #333;
    }
    .pos {
      font-size: 0.77em;
      color: #999;
    }
    .analysis {
      font-family: 'Lucida Console', Monaco, monospace;
      font-size: 0.66em;
      color: #999;
    }
    .gloss {
      font-size: 0.88em;
      color: #333;
      font-style: italic;
    }
  }
</style>
