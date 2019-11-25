/* global describe, expect, it  */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SkeletonPlugin from 'scaife-skeleton';

import createStore from '../../config';
import ReaderWidget from '../../widgets/ReaderWidget.vue';
import Reader from '../../components/Reader.vue';

const localVue = createLocalVue();
const widgets = [ReaderWidget];
localVue.use(SkeletonPlugin, { widgets });
localVue.use(Vuex);

describe('ReaderWidget.vue', () => {
  it('parses lines from a graphql response', () => {
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
          return 'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3-4';
        },
        metadata() {
          return { some: 'metadata' };
        },
      },
      mocks: {
        gqlData: {
          lines: {
            edges: [{ node: 'some' }, { node: 'data' }],
          },
        },
      },
    });

    expect(wrapper.find(Reader).props()).toStrictEqual({
      lines: ['some', 'data'],
      textSize: 'md',
      textWidth: 'normal',
    });
  });
});
