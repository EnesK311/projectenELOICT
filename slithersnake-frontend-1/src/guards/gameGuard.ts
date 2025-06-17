import { usePlayStore } from '@/stores/play'
import type { RouteLocation } from 'vue-router'

export function resetIntervalGuard(to: RouteLocation, from: RouteLocation) {
  const play = usePlayStore()
//   play.gameLoopInterval = setInterval(() => {})
  clearInterval(play.gameLoopInterval)
//   play.socketInterval = setInterval(() => {})
  clearInterval(play.socketInterval)
}