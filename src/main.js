import Vue from 'vue';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import SkeletonPlugin from 'scaife-skeleton';
import GraphQLPlugin from './gql';

import App from './App.vue';
import router from './router';
import store from './store';

const iconMap = [faChevronLeft, faChevronRight].reduce((map, obj) => {
  // eslint-disable-next-line no-param-reassign
  map[obj.iconName] = obj;
  return map;
}, {});

Vue.use(SkeletonPlugin, { iconMap });
Vue.use(GraphQLPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
