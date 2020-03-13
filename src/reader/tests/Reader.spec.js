/* global describe, expect, it  */
import { shallowMount } from '@vue/test-utils';
import Reader from '@/reader/components/Reader.vue';

describe('Reader.vue', () => {
  it('it renders lines and line references', () => {
    const lines = [
      { ref: '1', textContent: 'Some text' },
      { ref: '2', textContent: 'More text' },
    ];
    const wrapper = shallowMount(Reader, {
      propsData: { lines, textSize: 'text-md', textWidth: 'normal' },
    });

    expect(wrapper.html()).toContain(
      '<div class="reader text text-text-md text-width-normal"',
    );
    expect(wrapper.html()).toContain('<div class="line-ref">1</div>');
    expect(wrapper.html()).toContain('<div class="line-text">Some text</div>');
    expect(wrapper.html()).toContain('<div class="line-ref">2</div>');
    expect(wrapper.html()).toContain('<div class="line-text">More text</div>');
  });
});
