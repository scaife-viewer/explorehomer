/* global describe, expect, it  */
import { mount } from '@vue/test-utils';

import Metadata from '../../components/Metadata.vue';

describe('Metadata.vue', () => {
  it('it renders the work title', () => {
    const wrapper = mount(Metadata, {
      context: { props: { metadata: { work_title: 'Some Title' } } },
    });
    expect(wrapper.html()).toBe('<h1 class="work-title">Some Title</h1>');
  });
});
