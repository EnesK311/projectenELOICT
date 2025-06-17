import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import type { RouteLocation } from 'vue-router'

export function teacherGuard(to: RouteLocation, from: RouteLocation) {
  const { isTeacher, isAdmin } = storeToRefs(useAuthStore())
  if (!isTeacher.value && !isAdmin.value) {
    return { name: 'dashboard' }
  }
}
