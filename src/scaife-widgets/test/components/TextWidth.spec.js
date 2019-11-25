/* global describe, expect, it  */
import { mount } from '@vue/test-utils';

import TextWidth from '../../components/TextWidth.vue';

describe('TextWidth.vue', () => {
  it.each([
    ['narrow', 'active">Narrow'],
    ['normal', 'active">Normal'],
    ['wide', 'active">Wide'],
    ['full', 'active">Full'],
  ])('it renders active correctly via props', (value, expected) => {
    const wrapper = mount(TextWidth, {
      propsData: { value, width: value },
    });
    expect(wrapper.html()).toContain(expected);
  });

  it.each([
    ['narrow', 'text-width-control">Narrow'],
    ['normal', 'text-width-control">Normal'],
    ['wide', 'text-width-control">Wide'],
  ])('it renders without active correctly via props', (value, expected) => {
    const wrapper = mount(TextWidth, {
      propsData: { value: 'different', width: value },
    });
    expect(wrapper.html()).toContain(expected);
  });
});
