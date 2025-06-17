import { useAuthStore } from '@/stores/auth'
import type { RouteLocation } from 'vue-router'

export function loginGuard(to: RouteLocation, from: RouteLocation) {
  if (useAuthStore().isAuthenticated) {
    return { name: 'home' }
  }
}
