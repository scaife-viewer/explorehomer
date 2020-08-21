/* global describe, expect, it  */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import SkeletonPlugin from 'scaife-skeleton';
import URN, { Paginator } from '@scaife-viewer/common';

import createStore from '@/reader/config';
import ReaderWidget from '@/reader/widgets/ReaderWidget.vue';
import Reader from '@/reader/components/Reader.vue';

const localVue = createLocalVue();
const widgets = [ReaderWidget];
localVue.use(SkeletonPlugin, { widgets });
localVue.use(Vuex);

describe('ReaderWidget.vue', () => {
  it('passes props and parses lines from graphql data', () => {
    const moduleStore = createStore();
    const store = new Vuex.Store({
      modules: {
        [moduleStore.namespace]: moduleStore.store,
      },
    });
    const wrapper = shallowMount(ReaderWidget, {
      store,
      localVue,
      computed: {
        urn() {
          return new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.3-4');
        },
        workTitle() {
          return 'Iliad';
        },
        textSize() {
          return 'md';
        },
        textWidth() {
          return 'normal';
        },
      },
      mocks: {
        gqlData: {
          passageTextParts: {
            metadata: {
              siblings: {
                previous: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.1-2',
                next: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.5-6',
              },
            },
            edges: [{ node: 'some' }, { node: 'data' }],
          },
        },
      },
    });
    const paginators = wrapper.findAll(Paginator);

    expect(paginators.at(0).props()).toEqual({
      urn: new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.1-2'),
      direction: 'left',
    });
    expect(wrapper.find(Reader).props()).toEqual({
      lines: ['some', 'data'],
      textSize: 'md',
      textWidth: 'normal',
    });
    expect(paginators.at(1).props()).toEqual({
      urn: new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.5-6'),
      direction: 'right',
    });
  });
});
