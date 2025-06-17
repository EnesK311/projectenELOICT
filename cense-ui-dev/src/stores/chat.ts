import { computed, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
  type Message,
  type Chat,
  type User,
  type StatusDto,
  type SocketEvent,
  type MessageDto,
  type UnreadMessageCount,
} from '@/types/type'
import {
  getAvailableUsers,
  getMessages,
  getMyChats,
  getUnreadMessageCount,
  makeChatBetweenUsers,
} from '@/services/chatService'
import { useSocket } from '@/composables/socket'
import { useUserStore } from './user'
import type { AxiosError } from 'axios'

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([])
  const messages = ref<Message[]>([])
  const totalUnreadMessageCount = computed(() =>
    chats.value.reduce((sum, chat) => sum + (chat.unreadMessageCount || 0), 0),
  )
  const currentChatId = ref<string | null>(null)

  const setCurrentChatId = (chatId: string | null) => {
    currentChatId.value = chatId
  }

  const { socket } = useSocket()
  const { users } = storeToRefs(useUserStore())
  watch(socket, s => {
    if (!s) return
    s.addEventListener('message', e => {
      const event = JSON.parse(e.data) as SocketEvent
      if (event.Type === 'user-status') {
        const data = event.Payload as StatusDto
        const chat = chats.value.find(
          chat => chat.users[0].userId === data.UserId,
        )
        if (chat && chat.users[0]) {
          chat.users[0].isOnline = data.IsOnline
        }
        const user = users.value.find(user => user.id === data.UserId)
        if (user) user.isOnline = data.IsOnline
      } else if (event.Type === 'message') {
        const data = event.Payload as MessageDto
        const chat = chats.value.find(c => c.chatId === data.ChatId)
        if (chat) {
          if (currentChatId.value === data.ChatId) {
            console.log('chat is open')
            setUnreadMessageCount(data.ChatId, 0)
          } else {
            console.log('chat is niet open')

            if (!chat.unreadMessageCount) chat.unreadMessageCount = 0
            chat.unreadMessageCount++
          }
        }
      }
    })
  })

  const getAndSetUnreadMessageCount = async () => {
    const res = await getUnreadMessageCount()
    const unreadMessageCount = res.data.data as UnreadMessageCount[]
    chats.value.forEach(chat => {
      const count = unreadMessageCount.find(
        c => c.chatId === chat.chatId,
      )?.unreadCount
      chat.unreadMessageCount = count || 0
    })
  }

  const getChats = async () => {
    const res = await getMyChats()
    chats.value = res.data.data as Chat[]

    await getAndSetUnreadMessageCount()
  }

  const getMessagesFromChat = async (chatId: string) => {
    const res = await getMessages(chatId)
    messages.value = res.data.data as Message[]

    await getAndSetUnreadMessageCount()
  }

  const getAvailableUsersForSelect = async () => {
    const res = await getAvailableUsers()
    return res.data.data as User[]
  }

  const makeChat = async (recipientId: string) => {
    try {
      const res = await makeChatBetweenUsers(recipientId)
      chats.value.push(res.data.data as Chat)
    } catch (e) {
      const error = e as AxiosError
      if (error.status === 409) {
        throw new Error(
          'Je probeert een chat aan te maken met iemand waarmee je al een chat hebt',
        )
      }
      throw new Error(
        'Er is iets misgegaan bij het maken van de chat. Probeer het later opnieuw.',
      )
    }
  }

  const setUnreadMessageCount = (chatId: string, count: number) => {
    const chat = chats.value.find(c => c.chatId === chatId)
    if (chat) chat.unreadMessageCount = count
  }

  getChats().catch(err => err)

  return {
    chats,
    getMessagesFromChat,
    messages,
    getAvailableUsersForSelect,
    makeChat,
    getChats,
    totalUnreadMessageCount,
    setUnreadMessageCount,
    setCurrentChatId,
  }
})
