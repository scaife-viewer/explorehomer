import ReaderView from '@/reader/components/ReaderView.vue';
import TOCsView from '@/tocs/components/TOCsView.vue';

export default [
  { path: '/', redirect: 'reader' },
  { path: '/reader', component: ReaderView, name: 'reader' },
  { path: '/tocs', component: TOCsView, name: 'tocs' },
];
