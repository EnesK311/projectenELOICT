import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PeerInput from '../atoms/PeerInput.vue'

describe('PeerInput.vue', () => {
  it('renders the input element with correct attributes', () => {
    const wrapper = mount(PeerInput, {
      props: {
        modelValue: 'test',
        type: 'text',
        id: 'input-id',
        name: 'input-name',
        autocomplete: 'off'
      }
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('id')).toBe('input-id')
    expect(input.attributes('name')).toBe('input-name')
    expect(input.attributes('autocomplete')).toBe('off')
    expect(input.element.value).toBe('test')
  })

  it('updates the model value correctly on input event for text type', async () => {
    const wrapper = mount(PeerInput, {
      props: {
        modelValue: 'initial value',
        type: 'text'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('updated value')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['updated value'])
  })

  it('updates the model value correctly on input event for number type', async () => {
    const wrapper = mount(PeerInput, {
      props: {
        modelValue: 10,
        type: 'number'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('20')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([20])
  })

  it('emits 0 when input type is number and the value is empty', async () => {
    const wrapper = mount(PeerInput, {
      props: {
        modelValue: 10,
        type: 'number'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([0])
  })
})
