import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FormInput from '@/components/molecules/FormInput.vue'
import PeerLabel from '@/components/atoms/PeerLabel.vue'
import PeerError from '@/components/atoms/PeerError.vue'

describe('FormInput.vue', () => {
  it('renders the label slot content', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: ''
      },
      slots: {
        label: '<span>Custom Label</span>'
      }
    })

    expect(wrapper.find('label').html()).toContain('Custom Label')
  })

  it('renders the label from props when slot is not provided', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: ''
      }
    })

    expect(wrapper.find('label').text()).toBe('Test Label')
  })

  it('renders an input element by default', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        type: 'text'
      }
    })

    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders a textarea when type is set to "textarea"', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test-textarea',
        modelValue: '',
        type: 'textarea'
      }
    })

    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('emits update:modelValue when input value changes', async () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        type: 'text'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('new value')

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new value'])
  })

  it('displays an error message when errorMessage prop is provided', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        errorMessage: 'This field is required'
      }
    })

    expect(wrapper.find('[role="alert"]').text()).toBe('This field is required')
  })

  it('does not display an error message when errorMessage prop is not provided', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'test-input',
        modelValue: ''
      }
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
