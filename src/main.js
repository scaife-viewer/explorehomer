import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';

import {
  DISPLAY_MODE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_SYNTAX_TREES,
  DISPLAY_MODE_DEFAULT,
} from '@scaife-viewer/store';
import { SkeletonPlugin } from '@scaife-viewer/skeleton';

import { DefaultModeReader } from '@scaife-viewer/widget-reader';

import AlignmentsModeReader from '@scaife-viewer/reader-alignments-mode';
import ImageModeReader, {
  iconMap as imageModeReaderIconMap,
} from '@scaife-viewer/reader-image-mode';
import NamedEntitiesModeReader, {
  iconMap as namedEntitesReaderIconMap,
} from '@scaife-viewer/reader-named-entities-mode';
import MetricalModeReader from '@scaife-viewer/reader-metrical-mode';
import InterlinearModeReader from '@scaife-viewer/reader-interlinear-mode';
import SyntaxTreesModeReader from '@scaife-viewer/reader-syntax-trees-mode';

import { iconMap as commonIconMap } from '@scaife-viewer/common';
import { iconMap as audioIconMap } from '@scaife-viewer/widget-audio';
// eslint-disable-next-line max-len
import { iconMap as namedEntitiesIconMap } from '@scaife-viewer/widget-named-entities';

import App from '@/App.vue';
import router from '@/router';
import store, { apolloProvider } from '@/store';

sync(store, router);

Vue.use(SkeletonPlugin, {
  iconMap: {
    ...commonIconMap,
    ...audioIconMap,
    ...namedEntitiesIconMap,
    ...namedEntitesReaderIconMap,
    ...imageModeReaderIconMap,
  },
  config: {
    entityMap: {
      accessToken:
        // eslint-disable-next-line max-len
        'pk.eyJ1IjoicGFsdG1hbiIsImEiOiJja2JpNDVpbmUwOGF1MnJwZm91c3VybDVrIn0.KRcXBGtiUWFXkp2uaE5LLw',
      mapStyle: 'mapbox://styles/paltman/ckbi4thqt156y1ijz5wldui14',
    },
    readerComponents: {
      [DISPLAY_MODE_DEFAULT]: DefaultModeReader,
      [DISPLAY_MODE_INTERLINEAR]: InterlinearModeReader,
      [DISPLAY_MODE_FOLIO]: ImageModeReader,
      [DISPLAY_MODE_METRICAL]: MetricalModeReader,
      [DISPLAY_MODE_NAMED_ENTITIES]: NamedEntitiesModeReader,
      [DISPLAY_MODE_ALIGNMENTS]: AlignmentsModeReader,
      [DISPLAY_MODE_SYNTAX_TREES]: SyntaxTreesModeReader,
    },
    pageTitle: (title) => `Explore Homer | ${title}`,
  },
});

Vue.use(VueApollo);

Vue.config.productionTip = false;

Vue.prototype.$isEmpty = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

new Vue({
  router,
  store,
  render: (h) => h(App),
  apolloProvider,
}).$mount('#app');
