import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import { RouterLinkStub } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('HomeView.vue', () => {
  it('renders correctly and contains the expected elements', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // Check for the presenceq of the header image
    expect(wrapper.find('header img').exists()).toBe(true);

    // Check for the presence of the main hero section
    expect(wrapper.find('.hero').exists()).toBe(true);

    // Check for the presence of the features section
    expect(wrapper.find('.features').exists()).toBe(true);

    // Verify the presence of the "Begin nu" link
    const beginNuLink = wrapper.findComponent(RouterLinkStub);
    expect(beginNuLink.exists()).toBe(true);
    expect(beginNuLink.props().to).toBe('/login');
    expect(beginNuLink.text()).toBe('Begin nu');

    // Verify the number of feature items
    const featureItems = wrapper.findAll('.features ul li');
    expect(featureItems.length).toBe(6);
  });
});
