<template>
  <div class="lookahead-container u-flex">
    <Lookahead
      :placeholder="placeholder"
      :reducer="reducer"
      :data="toc"
      @filter-data="data => $emit('filter-data', data)"
    />
    <Icon class="icon" name="home" v-if="showingRootToc" disabled />
    <router-link class="icon" :to="getRootTOCPayload()" v-else>
      <Icon name="home" />
    </router-link>
    <span v-if="showToggle" @click.prevent="$emit('toggle-urns')">
      <Icon class="icon urn" name="eye" v-if="!showURNs" />
      <Icon class="icon urn" name="eye-slash" v-else />
    </span>
  </div>
</template>

<script>
  import { Icon, Lookahead } from '@scaife-viewer/scaife-widgets';

  const tocReducer = (data, query) => {
    const lenses = { getTitle: obj => obj.title, getUri: obj => obj.uri };
    return {
      ...data,
      items: data.items.filter(obj =>
        Object.values(lenses)
          .map(lens => lens(obj).toLowerCase().includes(query.toLowerCase()))
          .some(Boolean),
      ),
    };
  };

  export default {
    name: 'TOCHeader',
    props: [
      'toc',
      'showURNs',
      'showToggle',
      'showingRootToc',
      'getRootTOCPayload',
      'placeholder',
    ],
    components: {
      Icon,
      Lookahead,
    },
    computed: {
      reducer() {
        return tocReducer;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .lookahead-container {
    align-items: center;
    margin-bottom: 0.66em;
    .form-group {
      width: 90%;
    }
  }
  .icon {
    color: black;
    margin-inline-start: 0.66em;
    &.urn {
      cursor: pointer;
    }
  }
</style>
