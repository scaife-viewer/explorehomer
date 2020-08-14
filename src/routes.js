import ReaderView from '@/views/ReaderView.vue';
import TOCsView from '@/views/TOCsView.vue';

export default [
  { path: '/', redirect: 'reader' },
  { path: '/reader', component: ReaderView, name: 'reader' },
  { path: '/tocs', component: TOCsView, name: 'tocs' },
];
