import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import CompleteProfile from '@/views/CompleteProfileView.vue';
import { useRouter } from 'vue-router';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('CompleteProfile.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.clearAllMocks();


    useRouter();
    wrapper = mount(CompleteProfile, {
      global: {
        stubs: {
          PersonalInformationForm: {
            template: '<div class="personal-information-form"><button @click="$emit(\'nextStep\')">Next</button></div>',
          },
          ProfessionalBackgroundForm: {
            template: `
              <div class="professional-background-form">
                <button @click="$emit('previousStep')">Previous</button>
                <button @click="$emit('submitForm')">Submit</button>
              </div>
            `,
          },
        },
      },
    });
  });

  it('renders the first step (Personal Information Form) initially', () => {
    expect(wrapper.find('.personal-information-form').exists()).toBe(true);
    expect(wrapper.find('.professional-background-form').exists()).toBe(false);

  });
});
