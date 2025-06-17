import { useLoading } from '@/composables/loading'
import { describe } from 'vitest'
import { expect, it } from 'vitest'
import { useFormValidation } from '@/composables/formValidation'
import { ref } from 'vue'

describe('useLoading', () => {
  it('starts loading when startLoading is called', () => {
    const { startLoading, isLoading } = useLoading()
    startLoading()
    expect(isLoading.value).toBe(true)
  })

  it('stops loading when stopLoading is called', () => {
    const { startLoading, stopLoading, isLoading } = useLoading()
    startLoading()
    stopLoading()
    expect(isLoading.value).toBe(false)
  })

  it('isLoading is initially false', () => {
    const { isLoading } = useLoading()
    expect(isLoading.value).toBe(false)
  })
})

describe('useFormValidation', () => {
  it('correctly validates form fields', async () => {
    const form = ref({
      email: {
        value: '',
        rules: [
          (v: string) => (!v ? 'Email is required' : null),
          (v: string) =>
            !/\S+@\S+\.\S+/.test(v)
              ? 'Email is invalid format (name@domain.com)'
              : null,
        ],
      },
      password: {
        value: '',
        rules: [
          (v: string) => (!v ? 'Password is required' : null),
          (v: string) =>
            v.length < 8 ? 'Password must be at least 8 characters' : null,
        ],
      },
    })

    const submitted = ref(true)
    const { errors, validate } = useFormValidation(form, submitted)
    validate()

    expect(errors.value.password).toBe('Password is required')
    expect(errors.value.email).toBe('Email is required')
  })

  it('does not validate fields if not submitted', async () => {
    const form = ref({
      username: {
        value: 'john_doe',
        rules: [
          (value: string) =>
            value.length < 5
              ? 'Username must be at least 5 characters long'
              : null,
        ],
      },
    })

    const submitted = ref(false)
    const { errors, validate } = useFormValidation(form, submitted)
    validate()

    expect(errors.value.username).toBeUndefined()

    form.value.username.value = 'john'

    validate()

    expect(errors.value.username).toBeUndefined()
  })
})
