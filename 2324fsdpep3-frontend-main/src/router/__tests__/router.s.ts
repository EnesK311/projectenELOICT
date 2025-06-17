import { afterEach, describe, expect, it, test, vi } from 'vitest'
import { useTitle } from '@vueuse/core'
import router from '@/router'
import flushPromises from 'flush-promises'

// Mock the Auth Store
const mocks = vi.hoisted(() => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: false,
    hasRehydrated: true, // Mock this as true to simulate that rehydration is complete
    rehydrateAuth: vi.fn(() => Promise.resolve()), // Simulate rehydration process
    tryAutoLogin: () => Promise.resolve()
  }))
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: mocks.useAuthStore
}))

// Mock the data service used in the store
vi.mock('@/services/dataService', () => ({
  getUser: vi.fn(() =>
    Promise.resolve({
      data: { data: { id: 1, role: 'student' } } // Mocked user data
    })
  ),
  postLogin: vi.fn(() => Promise.resolve()),
  postLogout: vi.fn(() => Promise.resolve()),
  postRegister: vi.fn(() => Promise.resolve()),
  getCsrfCookie: vi.fn(() => Promise.resolve())
}))

describe('page title', () => {
  test('after every navigation, the page title should be updated', async () => {
    await router.push('/')
    await flushPromises() // Ensure all async operations are resolved
    const title = useTitle()
    expect(document.title).toContain(title.value)
  })
})

describe('authorization', () => {
  afterEach(async () => {
    await router.push('/') // Reset to a known state after each test
    vi.restoreAllMocks() // Restore original implementations of mocks
  })

  it('should not redirect authenticated users', async () => {
    mocks.useAuthStore.mockReturnValue({
      isAuthenticated: true,
      hasRehydrated: true,
      rehydrateAuth: vi.fn(() => Promise.resolve()),
      tryAutoLogin: () => Promise.resolve()
    })

    await router.push({ name: 'profile' })
    await flushPromises() // Ensure all async operations are resolved

    expect(router.currentRoute.value.name).toBe('profile')
  })

  it('should redirect unauthenticated users', async () => {
    await router.push({ name: 'profile' })
    await flushPromises() // Ensure all async operations are resolved
    expect(router.currentRoute.value.name).not.toBe('profile')
  })
})
