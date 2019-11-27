/* global describe, expect, it  */
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SkeletonPlugin from 'scaife-skeleton';

import createStore from '@/scaife-widgets/config';
import TextWidthWidget from '@/scaife-widgets/widgets/TextWidthWidget.vue';

const localVue = createLocalVue();
const widgets = [TextWidthWidget];
localVue.use(SkeletonPlugin, { widgets });
localVue.use(Vuex);

describe('TextWidthWidget.vue', () => {
  it('updates the "textWidth" appropriately', () => {
    const moduleStore = createStore();
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = mount(TextWidthWidget, {
      store,
      localVue,
    });
    const narrowSpan = wrapper.findAll('span').at(0);
    const normalSpan = wrapper.findAll('span').at(1);
    const wideSpan = wrapper.findAll('span').at(2);
    const fullSpan = wrapper.findAll('span').at(3);

    expect(moduleStore.store.state.readerTextWidth).toBe('normal');
    expect(narrowSpan.html()).toBe(
      '<span class="text-width-control">Narrow</span>',
    );
    expect(normalSpan.html()).toBe(
      '<span class="text-width-control active">Normal</span>',
    );
    expect(wideSpan.html()).toBe(
      '<span class="text-width-control">Wide</span>',
    );
    expect(fullSpan.html()).toBe(
      '<span class="text-width-control">Full</span>',
    );

    wideSpan.trigger('click');
    expect(moduleStore.store.state.readerTextWidth).toBe('wide');
    expect(narrowSpan.html()).toBe(
      '<span class="text-width-control">Narrow</span>',
    );
    expect(normalSpan.html()).toBe(
      '<span class="text-width-control">Normal</span>',
    );
    expect(wideSpan.html()).toBe(
      '<span class="text-width-control active">Wide</span>',
    );
    expect(fullSpan.html()).toBe(
      '<span class="text-width-control">Full</span>',
    );

    narrowSpan.trigger('click');
    expect(moduleStore.store.state.readerTextWidth).toBe('narrow');
    expect(narrowSpan.html()).toBe(
      '<span class="text-width-control active">Narrow</span>',
    );
    expect(normalSpan.html()).toBe(
      '<span class="text-width-control">Normal</span>',
    );
    expect(wideSpan.html()).toBe(
      '<span class="text-width-control">Wide</span>',
    );
    expect(fullSpan.html()).toBe(
      '<span class="text-width-control">Full</span>',
    );

    normalSpan.trigger('click');
    expect(moduleStore.store.state.readerTextWidth).toBe('normal');
    expect(narrowSpan.html()).toBe(
      '<span class="text-width-control">Narrow</span>',
    );
    expect(normalSpan.html()).toBe(
      '<span class="text-width-control active">Normal</span>',
    );
    expect(wideSpan.html()).toBe(
      '<span class="text-width-control">Wide</span>',
    );
    expect(fullSpan.html()).toBe(
      '<span class="text-width-control">Full</span>',
    );

    fullSpan.trigger('click');
    expect(moduleStore.store.state.readerTextWidth).toBe('full');
    expect(narrowSpan.html()).toBe(
      '<span class="text-width-control">Narrow</span>',
    );
    expect(normalSpan.html()).toBe(
      '<span class="text-width-control">Normal</span>',
    );
    expect(wideSpan.html()).toBe(
      '<span class="text-width-control">Wide</span>',
    );
    expect(fullSpan.html()).toBe(
      '<span class="text-width-control active">Full</span>',
    );
  });
});
