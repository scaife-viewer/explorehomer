import Vue from 'vue';
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
import GraphQLPlugin from '@/gql';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

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
};

Vue.use(SkeletonPlugin, { iconMap, config });
Vue.use(GraphQLPlugin);

const widgetEndpoints = {};
if (process.env.VUE_APP_TOC_ENDPOINT) {
  widgetEndpoints.tocEndpoint = process.env.VUE_APP_TOC_ENDPOINT;
}
Vue.use(EndpointsPlugin, widgetEndpoints);

Vue.config.productionTip = false;

Vue.prototype.$isEmpty = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
