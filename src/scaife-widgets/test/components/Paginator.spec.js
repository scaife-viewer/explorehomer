/* global describe, expect, it  */
import { mount, RouterLinkStub } from '@vue/test-utils';

import URN from '@/scaife-widgets/urn';
import Paginator from '@/scaife-widgets/components/Paginator.vue';

describe('Paginator.vue', () => {
  it('renders nothing when not passed a URN', () => {
    const wrapper = mount(Paginator, {
      propsData: { urn: null, direction: 'left' },
    });

    expect(wrapper.html()).toBe('<nav class="paginator"><!----></nav>');
  });

  it.each([
    ['left', 'chevron-left'],
    ['right', 'chevron-right'],
  ])('it renders URNs and chevrons', (direction, expected) => {
    const urn = new URN('urn:cts:greekLit:tlg0012.tlg001.msA:1.1');
    const wrapper = mount(Paginator, {
      propsData: { urn, direction },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find(RouterLinkStub).props().to).toEqual({
      path: 'reader',
      query: {
        urn: 'urn:cts:greekLit:tlg0012.tlg001.msA:1.1',
      },
    });
    expect(wrapper.html()).toContain(
      `<icon name="${expected}" fixed-width=""></icon>`,
    );
  });
});
