import Vue from 'vue';
import VueApollo from 'vue-apollo';

import {
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faVolumeUp,
  faUser,
  faMapMarkerAlt,
  faAlignJustify,
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
  faAlignJustify,
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

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: client,
});

Vue.use(SkeletonPlugin, { iconMap });

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

new Vue({
  router,
  store,
  render: h => h(App),
  apolloProvider,
}).$mount('#app');
