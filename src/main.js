import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';

import {
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faVolumeUp,
  faUser,
  faMapMarkerAlt,
  faGripLines,
  faGripLinesVertical,
  faAlignLeft,
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHome,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons';

import { SkeletonPlugin } from '@scaife-viewer/skeleton';
import {
  DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_DEFAULT,
} from '@scaife-viewer/store';
import AlignmentsModeReader from '@scaife-viewer/reader-alignments-mode';
import ImageModeReader from '@scaife-viewer/reader-image-mode';
import NamedEntitiesModeReader from '@scaife-viewer/reader-named-entities-mode';
import MetricalModeReader from '@scaife-viewer/reader-metrical-mode';
import InterlinearModeReader from '@scaife-viewer/reader-interlinear-mode';
import { DefaultModeReader } from '@scaife-viewer/widget-reader';

// import client from '@/gql';
import App from '@/App.vue';
import router from '@/router';
import store, { apolloProvider } from '@/store';

sync(store, router);

const iconMap = [
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faVolumeUp,
  faUser,
  faMapMarkerAlt,
  faGripLines,
  faGripLinesVertical,
  faAlignLeft,
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHome,
  faWindowMaximize,
].reduce((map, obj) => {
  return {
    ...map,
    [obj.iconName]: obj,
  };
}, {});

const config = {
  entityMap: {
    accessToken:
      process.env.VUE_APP_ENTITY_MAP_ACCESS_TOKEN ||
      // eslint-disable-next-line max-len
      'pk.eyJ1IjoicGFsdG1hbiIsImEiOiJja2JpNDVpbmUwOGF1MnJwZm91c3VybDVrIn0.KRcXBGtiUWFXkp2uaE5LLw',
    mapStyle:
      process.env.VUE_APP_ENTITY_MAP_STYLE ||
      'mapbox://styles/paltman/ckbi4thqt156y1ijz5wldui14',
  },
  readerComponents: {
    [DISPLAY_MODE_SENTENCE_ALIGNMENTS]: AlignmentsModeReader,
    [DISPLAY_MODE_FOLIO]: ImageModeReader,
    [DISPLAY_MODE_NAMED_ENTITIES]: NamedEntitiesModeReader,
    [DISPLAY_MODE_METRICAL]: MetricalModeReader,
    [DISPLAY_MODE_INTERLINEAR]: InterlinearModeReader,
    [DISPLAY_MODE_DEFAULT]: DefaultModeReader,
  },
};

Vue.use(SkeletonPlugin, { iconMap, config });

Vue.use(VueApollo);

// const widgetEndpoints = {};
// if (process.env.VUE_APP_TOC_ENDPOINT) {
//   widgetEndpoints.tocEndpoint = process.env.VUE_APP_TOC_ENDPOINT;
// }
// Vue.use(EndpointsPlugin, widgetEndpoints);

Vue.config.productionTip = false;

Vue.prototype.$isEmpty = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

new Vue({
  router,
  store,
  render: h => h(App),
  apolloProvider,
}).$mount('#app');
