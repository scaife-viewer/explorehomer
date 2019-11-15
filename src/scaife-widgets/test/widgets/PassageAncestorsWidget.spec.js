/* global describe, expect, it  */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import SkeletonPlugin from 'scaife-skeleton';

import createStore from '../../config';
import mockRouter from '../utils/mockRouter';
import PassageAncestorsWidget from '../../widgets/PassageAncestorsWidget.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = mockRouter.mock();
const widgets = [PassageAncestorsWidget];
localVue.use(SkeletonPlugin, { widgets });
localVue.use(Vuex);

describe('PassageAncestorsWidget.vue', () => {
  it('renders a single ancestor from a URN', () => {
    const moduleStore = createStore();
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = shallowMount(PassageAncestorsWidget, {
      localVue,
      store,
      router,
    });

    expect(wrapper.html()).toContain('1');
  });

  it('renders multiple ancestors from a URN', () => {
    const urn = 'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4';
    const moduleStore = createStore();
    moduleStore.store.state.passage = urn;
    moduleStore.store.state.initialPassage = urn;
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = shallowMount(PassageAncestorsWidget, {
      localVue,
      store,
      router,
    });

    expect(wrapper.html()).toContain('1');
    expect(wrapper.html()).toContain('2');
    expect(wrapper.html()).toContain('3');
  });

  it('renders multiple ancestors from a range URN', () => {
    const urn = 'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4.1-4.2';
    const moduleStore = createStore();
    moduleStore.store.state.passage = urn;
    moduleStore.store.state.initialPassage = urn;
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = shallowMount(PassageAncestorsWidget, {
      localVue,
      store,
      router,
    });

    expect(wrapper.html()).toContain('1');
    expect(wrapper.html()).toContain('2');
    expect(wrapper.html()).toContain('3');
    expect(wrapper.html()).toContain('4');
  });
});
