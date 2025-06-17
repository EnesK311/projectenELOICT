import { useAuthStore } from '@/stores/auth'
import type { RouteLocation } from 'vue-router'

export function authGuard(to: RouteLocation, from: RouteLocation) {
  if (!useAuthStore().isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
}
