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


import SkeletonPlugin from 'scaife-skeleton';
import { EndpointsPlugin } from '@scaife-viewer/scaife-widgets';
import client from '@/gql';

import LoaderBall from '@/components/LoaderBall.vue';
import EmptyMessage from '@/components/EmptyMessage.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

import {
  DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_DEFAULT,
} from '@/constants';

import AlignmentsModeReader from '@/reader/components/AlignmentsModeReader.vue';
import ImageModeReader from '@/reader/components/ImageModeReader.vue';
// eslint-disable-next-line max-len
import NamedEntitiesModeReader from '@/reader/components/NamedEntitiesModeReader.vue';
import MetricalModeReader from '@/reader/components/MetricalModeReader.vue';
// eslint-disable-next-line max-len
import InterlinearModeReader from '@/reader/components/InterlinearModeReader.vue';
import DefaultModeReader from '@/reader/components/DefaultModeReader.vue';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

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

const apolloProvider = new VueApollo({
  defaultClient: client,
});

const widgetEndpoints = {};
if (process.env.VUE_APP_TOC_ENDPOINT) {
  widgetEndpoints.tocEndpoint = process.env.VUE_APP_TOC_ENDPOINT;
}
Vue.use(EndpointsPlugin, widgetEndpoints);

Vue.config.productionTip = false;

Vue.prototype.$isEmpty = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

Vue.component('LoaderBall', LoaderBall);
Vue.component('EmptyMessage', EmptyMessage);
Vue.component('ErrorMessage', ErrorMessage);

new Vue({
  router,
  store,
  render: h => h(App),
  apolloProvider,
}).$mount('#app');
