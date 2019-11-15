import App from './App.vue';

export default [
  { path: '/', redirect: 'reader' },
  { path: '/reader', component: App, name: 'reader' },
];
