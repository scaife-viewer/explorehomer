import Vue from 'vue';

import SkeletonPlugin from 'scaife-skeleton';

import App from './App.vue';
import router from './router';
import store from './store';

const iconMap = [].reduce((map, obj) => {
  // eslint-disable-next-line no-param-reassign
  map[obj.iconName] = obj;
  return map;
}, {});

Vue.use(SkeletonPlugin, { iconMap });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
