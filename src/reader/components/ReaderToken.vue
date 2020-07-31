<template>
  <span
    class="token"
    :class="{
      selected,
      interlinear: interlinearMode,
      'entity-mode': namedEntitiesMode,
      entity: namedEntitiesMode && isEntity,
      'selected-entity': namedEntitiesMode && hasSelectedEntity,
    }"
    @click="onSelect"
  >
    <template v-if="interlinearMode">
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
  import { SELECT_TOKEN, MODULE_NS } from '@/reader/constants';
  import { CLEAR_NAMED_ENTITIES, SELECT_NAMED_ENTITIES } from '@/constants';

  export default {
    props: ['token'],
    methods: {
      onSelect() {
        if (this.selected) {
          this.$store.dispatch(CLEAR_NAMED_ENTITIES);
          this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
            token: null,
          });
        } else if (
          (this.namedEntitiesMode && this.isEntity) ||
          !this.namedEntitiesMode
        ) {
          this.$store.dispatch(SELECT_NAMED_ENTITIES, {
            entities: this.entities,
          });
          this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
            token: this.token,
          });
        }
      },
    },
    computed: {
      selectedEntities() {
        return this.$store.state.selectedNamedEntities;
      },
      interlinearMode() {
        return this.$store.getters.interlinearMode;
      },
      namedEntitiesMode() {
        return this.$store.getters.namedEntitiesMode;
      },
      entities() {
        return (this.token && this.token.entities) || [];
      },
      isEntity() {
        return this.entities.length > 0;
      },
      hasSelectedEntity() {
        return (
          this.entities.filter(
            id => this.selectedEntities.filter(sid => sid === id).length > 0,
          ).length > 0
        );
      },
      selected() {
        if (!this.selectedToken) {
          return false;
        }
        if (this.namedEntitiesMode) {
          const { entities, veRef } = this.selectedToken;
          const entity = entities[0];
          return (
            veRef === this.token.veRef ||
            (entity && entity === this.entities[0])
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
  .token.entity-mode:not(.entity) .text {
    cursor: inherit;
  }
  .token.entity .text {
    @include highlight($entity);
  }
  .token.selected-entity .text {
    @include highlight($selected-entity);
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
