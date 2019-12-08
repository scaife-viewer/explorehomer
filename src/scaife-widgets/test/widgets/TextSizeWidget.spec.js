/* global describe, expect, it  */
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SkeletonPlugin from 'scaife-skeleton';

import createStore from '@/scaife-widgets/config';
import TextSizeWidget from '@/scaife-widgets/widgets/TextSizeWidget.vue';

const localVue = createLocalVue();
const widgets = [TextSizeWidget];
localVue.use(SkeletonPlugin, { widgets });
localVue.use(Vuex);

describe('TextSizeWidget.vue', () => {
  const moduleStore = createStore();
  const store = new Vuex.Store({
    modules: {
      [moduleStore.namespace]: moduleStore.store,
    },
  });

  it('updates the "readerTextSize" appropriately', () => {
    const wrapper = mount(TextSizeWidget, {
      store,
      localVue,
    });
    const xsSpan = wrapper.findAll('span').at(0);
    const smSpan = wrapper.findAll('span').at(1);
    const mdSpan = wrapper.findAll('span').at(2);
    const lgSpan = wrapper.findAll('span').at(3);
    const xlSpan = wrapper.findAll('span').at(4);

    xsSpan.trigger('click');
    expect(moduleStore.store.state.readerTextSize).toBe('xs');
    expect(moduleStore.store.state.readerTextWidth).toBe('normal');
    expect(wrapper.html()).toContain(
      'class="text-size-control text-xs selected">Αα</span>',
    );

    smSpan.trigger('click');
    expect(moduleStore.store.state.readerTextSize).toBe('sm');
    expect(moduleStore.store.state.readerTextWidth).toBe('normal');
    expect(wrapper.html()).toContain(
      'class="text-size-control text-sm selected">Αα</span>',
    );

    mdSpan.trigger('click');
    expect(moduleStore.store.state.readerTextSize).toBe('md');
    expect(moduleStore.store.state.readerTextWidth).toBe('normal');
    expect(wrapper.html()).toContain(
      'class="text-size-control text-md selected">Αα</span>',
    );

    lgSpan.trigger('click');
    expect(moduleStore.store.state.readerTextSize).toBe('lg');
    expect(moduleStore.store.state.readerTextWidth).toBe('normal');
    expect(wrapper.html()).toContain(
      'class="text-size-control text-lg selected">Αα</span>',
    );

    xlSpan.trigger('click');
    expect(moduleStore.store.state.readerTextSize).toBe('xl');
    expect(moduleStore.store.state.readerTextWidth).toBe('normal');
    expect(wrapper.html()).toContain(
      'class="text-size-control text-xl selected">Αα</span>',
    );
  });
});
