import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import FilterForm from '@/components/molucules/MapFilters.vue';

import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

vi.mock('@/stores/speciality', () => ({
  useSpecialityStore: vi.fn(() => ({
    specialities: ref([
      { specialityType: 'Type 1' },
      { specialityType: 'Type 2' },
      { specialityType: 'Type 3' },
    ]),
  })),
}));

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    getUsers: vi.fn(),
  })),
}));

describe('FilterForm.vue', () => {
  let wrapper: ReturnType<typeof mount>;
  let mockGetUsers: Mock;

  beforeEach(() => {
    mockGetUsers = vi.fn();
    (useUserStore as unknown as Mock).mockReturnValue({ getUsers: mockGetUsers });

    wrapper = mount(FilterForm, {
      global: {
        stubs: {
          DoubleRange: true,
          DropDown: true,
          FButton: true,
        },
      },
    });
  });

  it('renders the form and inputs correctly', () => {
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'DoubleRange' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'DropDown' }).exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(false);
  });


  it('displays the correct options in the DropDown component', () => {
    const dropDown = wrapper.findComponent({ name: 'DropDown' });
    const expectedOptions = ['Type 1', 'Type 2', 'Type 3'];
    expect(dropDown.props('values')).toEqual(expectedOptions);
  });


});
