import type { RouteLocation } from 'vue-router'

export function resetGuard(to: RouteLocation, from: RouteLocation) {
  if (!to.query.token) {
    return { name: 'login' }
  }
}
