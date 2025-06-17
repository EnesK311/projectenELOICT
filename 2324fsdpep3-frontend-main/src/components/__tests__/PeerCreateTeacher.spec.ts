// PeerCreateTeacher.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PeerCreateTeacher from '../organisms/PeerCreateTeacher.vue'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/auth'

describe('PeerCreateTeacher.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(PeerCreateTeacher, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
  })

  it('renders the form inputs and button', () => {
    expect(wrapper.find('input#firstName').exists()).toBe(true)
    expect(wrapper.find('input#lastName').exists()).toBe(true)
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows validation errors when fields are empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')

    // Check if any error messages are displayed
    const errorMessages = wrapper.findAllComponents({ name: 'PeerError' })
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('calls createTeacher with correct data when inputs are filled', async () => {
    const authStore = useAuthStore()
    authStore.createTeacher = vi
      .fn()
      .mockResolvedValue({ success: true, message: 'Teacher created successfully' })

    await wrapper.find('input#firstName').setValue('John')
    await wrapper.find('input#lastName').setValue('Doe')
    await wrapper.find('input#email').setValue('john.doe@example.com')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.createTeacher).toHaveBeenCalledWith({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com'
    })

    expect(wrapper.find('.success-message').text()).toBe('Teacher created successfully')
  })

  it('shows error message when createTeacher fails', async () => {
    const authStore = useAuthStore()
    authStore.createTeacher = vi
      .fn()
      .mockResolvedValue({ success: false, message: 'Email already in use' })

    await wrapper.find('input#firstName').setValue('Jane')
    await wrapper.find('input#lastName').setValue('Doe')
    await wrapper.find('input#email').setValue('jane.doe@example.com')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.createTeacher).toHaveBeenCalled()

    // Access the correct FormInput component for the email
    const emailInput = wrapper.findAllComponents({ name: 'FormInput' }).at(2)
    expect(emailInput?.props('errorMessage')).toBe('Email already in use')
  })
})
