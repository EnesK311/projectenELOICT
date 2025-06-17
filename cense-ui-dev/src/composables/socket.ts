import useAuthStore from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const socket = ref<WebSocket | null>(null)
const isMessageListenerActive = ref(false)

export const useSocket = () => {
  const { user } = storeToRefs(useAuthStore())

  const setSocket = (s: WebSocket | null) => {
    if (!s) socket.value?.close()
    socket.value = s

    if (!socket.value) return
    socket.value.addEventListener('close', () => {
      if (!user || !user.value) return
      isMessageListenerActive.value = false
      setTimeout(() => {
        socket.value = new WebSocket(url + '/ws?token=' + user.value?.id)
        console.log('socket reconnected')
      }, 3000)
    })
  }

  const setIsMessageListenerActive = (isActive: boolean) => {
    isMessageListenerActive.value = isActive
  }

  const sendEvent = (event: string, data: unknown) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify({ Type: event, Payload: data }))
    }
  }

  const url = 'https://' + import.meta.env.VITE_API_PREFIX

  return {
    socket,
    setSocket,
    sendEvent,
    isMessageListenerActive,
    setIsMessageListenerActive,
  }
}
