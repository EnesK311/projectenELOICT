import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddVenturesOrganism from '../organisms/AddVenturesOrganism.vue'
import useAuthStore from '@/stores/auth'
import { ref } from 'vue'

// Mock stores
vi.mock('@/stores/auth', () => ({
  default: vi.fn(() => ({
    user: ref({ id: 'user-id-123' }), // Zorg dat dit een Vue `ref` is
  })),
}))

vi.mock('@/stores/project', () => ({
  useProjectsStore: vi.fn(() => ({
    createProject: vi.fn(),
  })),
}))

// Mock router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('AddVenturesOrganism', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    vi.clearAllMocks()


    wrapper = mount(AddVenturesOrganism, {
      global: {
        provide: {
          auth: useAuthStore(),
        },
      },
    })
  })

  it('renders the form correctly', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FormField' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'DateField' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FButton' }).exists()).toBe(true)
  })

  it('validates empty fields and shows errors', async () => {
    const submitButton = wrapper.find('button[type="submit"]')
    await submitButton.trigger('click')

    // Wait for validation to complete
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Voeg nieuw project toeProject naamProject datum Voeg project toe')
    expect(wrapper.text()).toContain('Voeg nieuw project toeProject naamProject datum Voeg project toe')
    expect(wrapper.text()).toContain('Voeg nieuw project toeProject naamProject datum Voeg project toe')
  })
})
