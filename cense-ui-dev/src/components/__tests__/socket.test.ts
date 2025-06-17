import { describe, it, expect, beforeEach, vi, } from 'vitest'
import { useSocket } from '@/composables/socket'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/stores/auth', () => ({
  default: vi.fn(() => ({
    user: {
      value: { id: 'user1' },
    },
  })),
}))

describe('useSocket', () => {
  let socketInstance: ReturnType<typeof useSocket>
  let mockWebSocket: WebSocket

  beforeEach(() => {
    setActivePinia(createPinia())
    socketInstance = useSocket()

    mockWebSocket = {
      readyState: WebSocket.OPEN,
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebSocket
  })



  it('sends events when the socket is open', () => {
    socketInstance.setSocket(mockWebSocket)

    const eventType = 'test-event'
    const eventData = { message: 'Hello' }
    socketInstance.sendEvent(eventType, eventData)

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ Type: eventType, Payload: eventData })
    )
  })

  it('does not send events when the socket is not open', () => {
    const eventType = 'test-event'
    const eventData = { message: 'Hello' }

    socketInstance.setSocket(null)
    socketInstance.sendEvent(eventType, eventData)

    expect(mockWebSocket.send).not.toHaveBeenCalled()
  })

  it('updates isMessageListenerActive state', () => {
    socketInstance.setIsMessageListenerActive(true)
    expect(socketInstance.isMessageListenerActive.value).toBe(true)

    socketInstance.setIsMessageListenerActive(false)
    expect(socketInstance.isMessageListenerActive.value).toBe(false)
  })
})
