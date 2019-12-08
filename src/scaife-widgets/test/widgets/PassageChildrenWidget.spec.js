/* global describe, expect, it  */
import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import SkeletonPlugin from 'scaife-skeleton';

import { URN } from '@scaife-viewer/scaife-widgets';
import createStore from '@/scaife-widgets/config';
// eslint-disable-next-line max-len
import PassageChildrenWidget from '@/scaife-widgets/widgets/PassageChildrenWidget.vue';

const localVue = createLocalVue();
const widgets = [PassageChildrenWidget];
localVue.use(SkeletonPlugin, { widgets });
localVue.use(Vuex);

describe('PassageChildrenWidget.vue', () => {
  it('renders nothing given no URNs', () => {
    const moduleStore = createStore();
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = shallowMount(PassageChildrenWidget, {
      localVue,
      store,
      computed: {
        children() {
          return [];
        },
      },
    });

    expect(wrapper.html()).toBe(
      '<div class="passage-children-widget u-grid"></div>',
    );
  });

  it('renders a single child from a single URN', () => {
    const moduleStore = createStore();
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = shallowMount(PassageChildrenWidget, {
      localVue,
      store,
      computed: {
        children() {
          return [new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.1')];
        },
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
    const routes = wrapper.findAll(RouterLinkStub);

    expect(routes.length).toBe(1);
    expect(wrapper.html()).toContain('1');
    expect(routes.at(0).props().to).toEqual({
      path: 'reader',
      query: {
        urn: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.1',
      },
    });
  });

  it('renders multiple children from multiple URNs', () => {
    const moduleStore = createStore();
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = shallowMount(PassageChildrenWidget, {
      localVue,
      store,
      computed: {
        children() {
          return [
            new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.1'),
            new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.2'),
          ];
        },
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
    const routes = wrapper.findAll(RouterLinkStub);

    expect(routes.length).toBe(2);
    expect(wrapper.html()).toContain('1');
    expect(routes.at(0).props().to).toEqual({
      path: 'reader',
      query: {
        urn: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.1',
      },
    });
    expect(wrapper.html()).toContain('2');
    expect(routes.at(1).props().to).toEqual({
      path: 'reader',
      query: {
        urn: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.2',
      },
    });
  });
});
