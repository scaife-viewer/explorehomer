/* global describe, expect, it  */
import { mount } from '@vue/test-utils';

import Metadata from '@/scaife-widgets/components/Metadata.vue';

describe('Metadata.vue', () => {
  it('it renders the work title', () => {
    const wrapper = mount(Metadata, {
      context: { props: { workTitle: 'Some Title' } },
    });
    expect(wrapper.html()).toBe('<h1 class="work-title">Some Title</h1>');
  });
});
