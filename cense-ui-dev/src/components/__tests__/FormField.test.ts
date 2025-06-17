import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormField from '../atoms/FormField.vue'
import FormError from '../atoms/FormError.vue'

describe('FormField.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(FormField, {
      props: {
        id: 'test-id',
        type: 'text',
        required: true,
        label: 'Test Label',
        error: null,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the label with the correct text', () => {
    const wrapper = mount(FormField, {
      props: {
        id: 'test-id',
        type: 'text',
        required: true,
        label: 'Test Label',
        error: null,
      },
    })
    expect(wrapper.find('label .field-label').text()).toBe('Test Label')
  })

  it('renders the FormError slot with the error message', () => {
    const wrapper = mount(FormField, {
      props: {
        id: 'test-id',
        type: 'text',
        required: true,
        error: 'This is an error',
        label: 'Test Label',
      },
      global: {
        components: { FormError },
      },
    })
    expect(wrapper.findComponent(FormError).text()).toBe('This is an error')
  })

  it('toggles password visibility when eye button is clicked', async () => {
    const wrapper = mount(FormField, {
      props: {
        id: 'password-id',
        type: 'password',
        eye: true,
        required: true,
        label: 'Password',
        error: null,
      },
    })

    const button = wrapper.find('.show-password')
    const input = wrapper.find('input')

    // Initially, input type should be password
    expect(input.attributes('type')).toBe('password')

    // Click to toggle visibility
    await button.trigger('click')
    expect(input.attributes('type')).toBe('text')

    // Click again to hide
    await button.trigger('click')
    expect(input.attributes('type')).toBe('password')
  })

  it('applies the correct props to input', () => {
    const wrapper = mount(FormField, {
      props: {
        id: 'test-id',
        type: 'number',
        required: true,
        min: 1,
        max: 10,
        label: 'Number Input',
        error: null,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('id')).toBe('test-id')
    expect(input.attributes('type')).toBe('number')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('max')).toBe('10')
  })

  it('renders the eye button conditionally based on the "eye" prop', () => {
    const wrapper = mount(FormField, {
      props: {
        id: 'test-id',
        type: 'password',
        required: true,
        label: 'Password',
        eye: true,
        error: null,
      },
    })

    expect(wrapper.find('.show-password').exists()).toBe(true)

    // Test without the "eye" prop
    const wrapperNoEye = mount(FormField, {
      props: {
        id: 'test-id',
        type: 'password',
        required: true,
        label: 'Password',
        eye: false,
        error: null,
      },
    })
    expect(wrapperNoEye.find('.show-password').exists()).toBe(false)
  })
})
