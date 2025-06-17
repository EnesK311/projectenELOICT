import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CheckboxFieldset from '../atoms/DropDownAtom.vue'; // Update path if needed

describe('CheckboxFieldset.vue', () => {
  it('renders correctly with props', () => {
    const wrapper = mount(CheckboxFieldset, {
      props: {
        values: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
        legend: 'Test Legend',
      },
    });

    // Check if legend is rendered correctly
    expect(wrapper.find('legend').text()).toBe('Test Legend');

    // Check if the correct number of checkboxes are rendered
    expect(wrapper.findAll('input[type="checkbox"]').length).toBe(5);

    // Ensure only 3 options are visible initially
    expect(wrapper.findAll('div:nth-of-type(n+4)').length).toBe(2); // 4th and 5th are hidden
  });




  it('hides the "Show More" button if less than 4 options', () => {
    const wrapper = mount(CheckboxFieldset, {
      props: {
        values: ['Option 1', 'Option 2', 'Option 3'],
        legend: 'Test Legend',
      },
    });

    const button = wrapper.find('button');
    expect(button.exists()).toBe(false);
  });
});
