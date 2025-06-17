import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia'; // Pinia setup
import { nextTick } from 'vue';

import PersonalInformationForm from '../organisms/PersonalInformationForm.vue';
import FormSummary from '@/components/atoms/FormSummary.vue';
import FormError from '@/components/atoms/FormError.vue';

describe('ProfileForm.vue', () => {
  let wrapper: VueWrapper<unknown>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = mount(PersonalInformationForm, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('validates required fields on submit', async () => {
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();

    expect(wrapper.findAllComponents(FormError).length).toBeGreaterThan(0);
    expect(wrapper.findComponent(FormSummary).props('errors')).not.toEqual({});
  });
});
