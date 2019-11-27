/* global describe, expect, it  */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import SkeletonPlugin from 'scaife-skeleton';

import URN from '@/scaife-widgets/urn';
// eslint-disable-next-line max-len
import PassageReferenceWidget from '@/scaife-widgets/widgets/PassageReferenceWidget.vue';
import mockRouter from '@/scaife-widgets/test/utils/mockRouter';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = mockRouter.mock();
const widgets = [PassageReferenceWidget];
localVue.use(SkeletonPlugin, { widgets });

describe('PassageReferenceWidget.vue', () => {
  it('pushes a new URN to the correct route', async () => {
    const wrapper = shallowMount(PassageReferenceWidget, {
      router,
      localVue,
      computed: {
        passage() {
          return new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3');
        },
      },
    });
    const input = wrapper.find('input');

    const urn = 'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4-3.5';
    router.push({ path: '/reader', query: { urn } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$route.path).toBe('/reader');
    expect(wrapper.vm.$route.query.urn).toBe(
      'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4-3.5',
    );

    input.element.value = '1.2';
    input.trigger('input');
    input.trigger('keyup.enter');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$route.path).toBe('/reader');
    expect(wrapper.vm.$route.query.urn).toBe(
      'urn:cts:greekLit:tlg0012.tlg001.msA:1.2',
    );
  });
});
