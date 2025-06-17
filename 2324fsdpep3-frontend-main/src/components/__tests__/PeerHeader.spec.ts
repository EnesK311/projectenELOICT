import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PeerHeader from '@/components/molecules/PeerHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'

// Mock de router correct
vi.mock('@/router', () => ({
  default: {
    push: vi.fn() // Mock de push methode correct
  }
}))

describe('PeerHeader.vue', () => {
  let authStore: any

  beforeEach(() => {
    authStore = useAuthStore(
      createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          auth: {
            isAuthenticated: false
          }
        }
      })
    )
  })

  it('renders the logo', () => {
    const wrapper = mount(PeerHeader, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('#logo').text()).toBe('Peer')
  })

  it('shows "Login" when not authenticated', () => {
    const wrapper = mount(PeerHeader, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).not.toContain('Profile')
    expect(wrapper.text()).not.toContain('Logout')
  })

  it('shows "Profile" and "Logout" when authenticated', async () => {
    authStore.isAuthenticated = true

    const wrapper = mount(PeerHeader, {
      global: {
        plugins: [router]
      }
    })

    // Forceer een update om de nieuwe waarde van isAuthenticated te laten renderen
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Profile')
    expect(wrapper.text()).toContain('Logout')
  })
})
