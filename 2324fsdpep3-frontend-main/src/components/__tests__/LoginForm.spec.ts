// LoginForm.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '../organisms/LoginForm.vue'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/auth'

describe('LoginForm.vue', () => {
  let wrapper: any
  const mockRouterPush = vi.fn()

  beforeEach(() => {
    wrapper = mount(LoginForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        mocks: {
          $router: {
            push: mockRouterPush
          }
        }
      }
    })
  })

  it('renders the form inputs and buttons', () => {
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows validation error when email and password are empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('input#email').element.value).toBe('')
    expect(wrapper.find('input#password').element.value).toBe('')
    expect(wrapper.findComponent({ name: 'FormInput' }).props('errorMessage')).toBe(
      'Fill in an email address'
    )
  })

  it('calls login with correct data when inputs are filled', async () => {
    const authStore = useAuthStore()
    authStore.login = vi.fn().mockResolvedValue(null)

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('shows a login error message when login fails', async () => {
    const authStore = useAuthStore()
    authStore.login = vi.fn().mockResolvedValue('Invalid credentials')

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('wrongpassword')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.login).toHaveBeenCalled()
    expect(wrapper.findComponent({ name: 'FormInput' }).props('errorMessage')).toBe(
      'Invalid credentials'
    )
  })
})
