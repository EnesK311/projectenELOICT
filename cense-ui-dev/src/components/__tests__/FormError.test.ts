import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormError from '../atoms/FormError.vue'

describe('FieldError Component', () => {
  it('renders slot content', () => {
    const wrapper = mount(FormError, {
      slots: {
        default: 'This is an error message',
      },
    })

    expect(wrapper.text()).toBe('This is an error message')
  })

  it('applies field-error class', () => {
    const wrapper = mount(FormError)
    expect(wrapper.classes()).toContain('field-error')
  })
})
