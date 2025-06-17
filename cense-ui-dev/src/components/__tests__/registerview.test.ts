import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterView from '@/views/RegisterView.vue'
import { createPinia, setActivePinia } from 'pinia'
import useAuthStore from '@/stores/auth'

// Mock `vue-router`
vi.mock('vue-router', () => {
  return {
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
    useRoute: vi.fn(() => ({
      query: {},
    })),
    RouterLink: {
      template: '<a><slot /></a>',
    },
  }
})

describe('RegisterView.vue', () => {
  let wrapper: ReturnType<typeof mount>
  let authStore: ReturnType<typeof useAuthStore>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let routerMock: { push: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    authStore = useAuthStore()
    routerMock = {
      push: vi.fn(),
    }

    // Mock the auth store methods
    authStore.registerUser = vi.fn().mockResolvedValue(undefined)
    authStore.getMeInfo = vi.fn().mockResolvedValue(undefined)

    wrapper = mount(RegisterView, {
      global: {
        plugins: [pinia],
        stubs: {
          FormField: {
            template: '<div><input v-bind="$attrs" v-on="$listeners" /></div>',
          },
          FormSummary: {
            template: '<div></div>',
          },
          FButton: {
            template:
              '<button v-bind="$attrs" v-on="$listeners"><slot /></button>',
          },
          BackButton: true,
        },
      },
    })
  })

  it('renders the form correctly', () => {
    expect(wrapper.findAll('input')).toHaveLength(3) //  email, password, confirmPassword
    expect(wrapper.find('button[type="submit"]').text()).toBe('Registreer')
  })
})
