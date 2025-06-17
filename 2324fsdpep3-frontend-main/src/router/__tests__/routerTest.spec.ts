// router.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { type Router } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

describe('Router', () => {
  let localRouter: Router

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn
    })

    localRouter = createRouter({
      history: createWebHistory(),
      routes: router.options.routes // Use the same routes from your main router
    })

    // Mock the authentication state
    const authStore = useAuthStore(pinia)
    authStore.isAuthenticated = false // default state
  })

  it('renders notFound view for invalid routes', async () => {
    localRouter.push('/random/nonexistent')
    await localRouter.isReady()
    expect(localRouter.currentRoute.value.name).toBe('notFound')
  })
})
