import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AccessibilityMenu from '@/components/molucules/AccessibilityButton.vue'

describe('AccessibilityMenu.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof AccessibilityMenu>>

  beforeEach(() => {
    // Set up Pinia
    setActivePinia(createPinia())

    // Mount the component
    wrapper = mount(AccessibilityMenu, {
      global: {
        plugins: [createPinia()],
      },
    })
  })

  it('renders the accessibility button', () => {
    const button = wrapper.find('.circle')
    expect(button.exists()).toBe(true)
    expect(button.attributes('aria-label')).toBe('Toegankelijkheidsmenu')
  })

  it('toggles the menu visibility when the button is clicked', async () => {
    const button = wrapper.find('.circle')
    const menu = wrapper.find('.menu')

    // Initially menu should be hidden
    expect(menu.classes()).not.toContain('active')

    // Click to open the menu
    await button.trigger('click')
    expect(menu.classes()).toContain('active')

    // Click to close the menu
    await button.trigger('click')
    expect(menu.classes()).not.toContain('active')
  })
})
