/* global describe, expect, it  */
import { mount } from '@vue/test-utils';

import TextSize from '../../components/TextSize.vue';

describe('TextSize.vue', () => {
  it.each([
    ['text-xs', 'text-xs selected">Αα'],
    ['text-sm', 'text-sm selected">Αα'],
    ['text-md', 'text-md selected">Αα'],
    ['text-lg', 'text-lg selected">Αα'],
    ['text-xl', 'text-xl selected">Αα'],
  ])('it renders selected correctly via props', (value, expected) => {
    const wrapper = mount(TextSize, {
      propsData: { value, size: value },
    });
    expect(wrapper.html()).toContain(expected);
  });
});

describe('TextSize.vue', () => {
  it.each([
    ['text-xs', 'text-xs">Αα'],
    ['text-sm', 'text-sm">Αα'],
    ['text-md', 'text-md">Αα'],
    ['text-lg', 'text-lg">Αα'],
    ['text-xl', 'text-xl">Αα'],
  ])('it renders without selected correctly via props', (value, expected) => {
    const wrapper = mount(TextSize, {
      propsData: { value: 'different', size: value },
    });
    expect(wrapper.html()).toContain(expected);
  });
});
