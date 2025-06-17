import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MapView from '@/views/MapView.vue'
import { useUserStore } from '@/stores/user'

// Mock `mapbox-gl`
vi.mock('mapbox-gl', () => ({
  Map: vi.fn(() => ({
    addControl: vi.fn(),
    setStyle: vi.fn(),
    on: vi.fn(),
    remove: vi.fn(),
  })),
}))

// Mock `@studiometa/vue-mapbox-gl`
vi.mock('@studiometa/vue-mapbox-gl', () => ({
  MapboxMap: {
    name: 'MapboxMap',
    template: '<div><slot /><slot name="popup" /></div>',
  },
  MapboxMarker: {
    name: 'MapboxMarker',
    template: '<div><slot /></div>',
    props: ['lngLat', 'element'],
  },
}))

vi.stubGlobal('import.meta', { env: { VITE_API_PREFIX: 'api.example.com/' } })

describe('MapView.vue', () => {
  let wrapper: ReturnType<typeof mount>
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    userStore = useUserStore()
    userStore.users = [
      {
        id: '1',
        firstname: 'John',
        lastname: 'Doe',
        age: 30,
        bio: 'Software Developer from New York',
        company: {
          id: 'company1',
          name: 'TechCorp',
          street: 'Main Street',
          houseNumber: '123',
          city: 'New York',
          postalcode: '10001',
          country: 'USA',
          latitude: 51.05,
          longitude: 3.73,
        },
        profilePicture: 'profile1.jpg',
        email: '',
      },
      {
        id: '2',
        firstname: 'Jane',
        lastname: 'Doe',
        age: 28,
        bio: 'Graphic Designer',
        company: {
          id: 'company2',
          name: 'DesignStudio',
          street: 'Side Street',
          houseNumber: '456',
          city: 'Los Angeles',
          postalcode: '90001',
          country: 'USA',
          latitude: 51.01,
          longitude: 3.75,
        },
        profilePicture: null,
        email: '',
      },
    ]

    wrapper = mount(MapView, {
      global: {
        plugins: [pinia],
        stubs: {
          MapFilters: true,
          MapHeader: true,
          MapSearch: true,
        },
      },
    })
  })

  it.skip('renders the map and subcomponents', () => {
    expect(wrapper.find('.map').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MapboxMap' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MapFilters' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MapHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MapSearch' }).exists()).toBe(true)
  })

  it.skip('displays markers for users', () => {
    const markers = wrapper.findAllComponents({ name: 'MapboxMarker' })
    expect(markers).toHaveLength(2)

    const firstMarker = markers.at(0)
    expect(firstMarker?.props('lngLat')).toEqual([3.73, 51.05])
    expect(firstMarker?.props('element').src).toContain('profile1.jpg')

    const secondMarker = markers.at(1)
    expect(secondMarker?.props('lngLat')).toEqual([3.75, 51.01])
    expect(secondMarker?.props('element').src).toContain(
      'blank-profile-picture-973460_1280.png',
    )
  })
})
