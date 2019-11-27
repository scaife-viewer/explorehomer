/* global describe, expect, it  */
import { mount } from '@vue/test-utils';

import Reader from '@/reader/components/Reader.vue';

describe('Reader.vue', () => {
  it('it renders lines and line references', () => {
    const lines = [
      { label: '1', textContent: 'Some text' },
      { label: '2', textContent: 'More text' },
    ];
    const wrapper = mount(Reader, {
      propsData: { lines, textSize: 'text-md', textWidth: 'normal' },
    });

    expect(wrapper.html()).toContain(
      '<div class="reader text text-text-md text-width-normal"',
    );
    expect(wrapper.html()).toContain(
      '<div class="line-ref">1</div> <div class="line-text">Some text</div>',
    );
    expect(wrapper.html()).toContain(
      '<div class="line-ref">2</div> <div class="line-text">More text</div>',
    );
  });
});
