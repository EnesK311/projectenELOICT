import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormSummary from '../atoms/FormSummary.vue'

describe('FormSummary.vue', () => {
  it('displays error summary when there are errors and success is false', () => {
    const errors = {
      username: 'Username is required',
      password: 'Password is too short',
    }

    const wrapper = mount(FormSummary, {
      props: {
        success: false,
        errors,
        message: '',
      },
    })

    expect(wrapper.find('.error-summary').exists()).toBe(true)
    expect(wrapper.findAll('.error-summary li')).toHaveLength(2)

    expect(wrapper.text()).toContain('Username is required')
    expect(wrapper.text()).toContain('Password is too short')
  })

  it('renders error links with correct href attributes', () => {
    const errors = {
      email: 'Email is invalid',
      password: 'Password is required',
    }

    const wrapper = mount(FormSummary, {
      props: {
        success: false,
        errors,
        message: '',
      },
    })

    const errorLinks = wrapper.findAll('.error-summary li a')
    expect(errorLinks).toHaveLength(2)
    expect(errorLinks[0].attributes('href')).toBe('#email')
    expect(errorLinks[0].text()).toBe('Email is invalid')
    expect(errorLinks[1].attributes('href')).toBe('#password')
    expect(errorLinks[1].text()).toBe('Password is required')
  })

  it('displays success message when success is true and no errors are present', () => {
    const wrapper = mount(FormSummary, {
      props: {
        success: true,
        errors: {},
        message: 'Form submitted successfully!',
      },
    })

    expect(wrapper.find('.success').exists()).toBe(true)
    expect(wrapper.find('.success h3').text()).toBe(
      'Form submitted successfully!',
    )
    expect(wrapper.find('.error-summary').exists()).toBe(false)
  })

  it('does not display success message if message prop is not provided', () => {
    const wrapper = mount(FormSummary, {
      props: {
        success: true,
        errors: {},
      },
    })

    expect(wrapper.find('.success').exists()).toBe(false)
  })

  it('does not display error summary if errors are empty', () => {
    const wrapperNoErrors = mount(FormSummary, {
      props: {
        success: false,
        errors: {},
        message: '',
      },
    })

    expect(wrapperNoErrors.find('.error-summary').exists()).toBe(false)
  })

  it('does not display error summary if success is true', () => {
    const wrapperSuccess = mount(FormSummary, {
      props: {
        success: true,
        errors: { email: 'Email is invalid' },
        message: 'Success',
      },
    })

    expect(wrapperSuccess.find('.error-summary').exists()).toBe(false)
  })
})
