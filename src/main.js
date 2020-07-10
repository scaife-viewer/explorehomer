import Vue from 'vue';
import {
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faVolumeUp,
  faUser,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';
import { Vue as VueIntegration } from '@sentry/integrations';

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
].reduce((map, obj) => {
  return {
    ...map,
    [obj.iconName]: obj,
  };
}, {});

Vue.use(SkeletonPlugin, { iconMap });
Vue.use(GraphQLPlugin);

const widgetEndpoints = {};
if (process.env.VUE_APP_TOC_ENDPOINT) {
  widgetEndpoints.tocEndpoint = process.env.VUE_APP_TOC_ENDPOINT;
}
Vue.use(EndpointsPlugin, widgetEndpoints);

Vue.config.productionTip = false;

Vue.prototype.$isEmpty = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

Sentry.init({
  dsn:
    'https://09f738fbe09c4dc0b22d0fa05efc8de7@o418387.ingest.sentry.io/5321255',
  integrations: [
    new VueIntegration({ Vue, attachProps: true }),
    new ApmIntegrations.Tracing(),
  ],
  // @@@ trace everything all the time
  tracesSampleRate: 1.0,
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
