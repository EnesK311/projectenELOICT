import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'

describe('App.vue', () => {
  it('renders without crashing and contains the header, main content, and footer', async () => {
    // Arrange
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn // Necessary for Pinia testing
          }),
          router
        ]
      }
    })

    // Wait for the router to be ready
    await router.isReady()

    // Act
    const header = wrapper.find('header')
    const main = wrapper.find('main')
    const footer = wrapper.find('footer')

    // Assert
    expect(header.exists()).toBe(true)
    expect(main.exists()).toBe(true)
    expect(footer.exists()).toBe(true)
  })

  it('renders the loader when checking login status', () => {
    // Arrange
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { checkingLogin: true }
            },
            createSpy: vi.fn
          }),
          router
        ]
      }
    })

    // Act
    const loader = wrapper.find('.centered')

    // Assert
    expect(loader.exists()).toBe(true)
  })

  it('renders the RouterView content when not checking login status', async () => {
    // Arrange
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { checkingLogin: false }
            },
            createSpy: vi.fn
          }),
          router
        ]
      }
    })

    await router.isReady()

    // Act
    const routerView = wrapper.findComponent({ name: 'RouterView' })

    // Assert
    expect(routerView.exists()).toBe(true)
  })
})
