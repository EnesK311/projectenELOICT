import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Slider from '../atoms/RangeAtom.vue'

describe('Slider.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(Slider)

    // Check if the slider input exists
    const slider = wrapper.find('input[type="range"]')
    expect(slider.exists()).toBe(true)

    // Check default props
    expect(slider.attributes('min')).toBe('0')
    expect(slider.attributes('max')).toBe('100')
    expect(slider.attributes('step')).toBe('1')
    expect((slider.element as HTMLInputElement).value).toBe('0')
  })

  it('displays the label and error if provided', () => {
    const wrapper = mount(Slider, {
      props: {
        label: 'Test Label',
        error: 'Test Error',
      },
    })

    // Check for label
    const label = wrapper.find('.field-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')

    // Check for error
    const error = wrapper.findComponent({ name: 'FormError' })
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Test Error')
  })

  it('binds props to the slider correctly', () => {
    const wrapper = mount(Slider, {
      props: {
        min: 10,
        max: 50,
        step: 5,
        modelValue: '25',
      },
    })

    const slider = wrapper.find('input[type="range"]')

    // Check attributes
    expect(slider.attributes('min')).toBe('10')
    expect(slider.attributes('max')).toBe('50')
    expect(slider.attributes('step')).toBe('5')
    expect((slider.element as HTMLInputElement).value).toBe('25')
  })

  it('updates the internal value when the modelValue prop changes', async () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: '20',
      },
    })

    const slider = wrapper.find('input[type="range"]')

    // Initial value
    expect((slider.element as HTMLInputElement).value).toBe('20')

    // Update prop
    await wrapper.setProps({ modelValue: '50' })
    expect((slider.element as HTMLInputElement).value).toBe('50')
  })

  it('renders the slider value next to the slider', () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: '75',
      },
    })

    const valueDisplay = wrapper.find('.slider-value')
    expect(valueDisplay.exists()).toBe(true)
    expect(valueDisplay.text()).toBe('75')
  })
})
