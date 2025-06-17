import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FButton from '../atoms/FButton.vue'

describe('ButtonComponent', () => {
  it('renders a button element', () => {
    const wrapper = mount(FButton)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('renders default type as button', () => {
    const wrapper = mount(FButton)
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('accepts the "submit" type', () => {
    const wrapper = mount(FButton, {
      props: {
        type: 'submit',
      },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('renders default slot content', () => {
    const wrapper = mount(FButton, {
      slots: {
        default: 'Click Me',
      },
    })
    expect(wrapper.text()).toBe('Click Me')
  })

  it('does not show loading styles when loading is false', () => {
    const wrapper = mount(FButton, {
      props: { loading: false },
    })
    expect(wrapper.classes()).not.toContain('loading')
  })
})
