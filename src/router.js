import Vue from 'vue';
import Router from 'vue-router';

import App from './App.vue';

Vue.use(Router);

const routes = [
  { path: '/', redirect: 'reader' },
  { path: '/reader', component: App, name: 'reader' },
];

const router = new Router({
  mode: 'history',
  base: '',
  routes,
});

export default router;
