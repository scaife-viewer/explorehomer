<template>
  <FixedSkeleton :main-widget="mainWidget" :right-widgets="rightWidgets" />
</template>

<script>
  import { TOCWidget, HelloWorld } from '@scaife-viewer/scaife-widgets';

  export default {
    name: 'TOCsView',
    computed: {
      mainWidget() {
        return TOCWidget;
      },
      rightWidgets() {
        return [HelloWorld];
      },
    },
  };
</script>
