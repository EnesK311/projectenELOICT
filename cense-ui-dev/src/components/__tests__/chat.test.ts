import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { getAvailableUsers, makeChatBetweenUsers } from '@/services/chatService'
import type { Chat, User } from '@/types/type'

vi.mock('@/services/chatService', () => ({
  getMyChats: vi.fn(),
  getMessages: vi.fn(),
  getAvailableUsers: vi.fn(),
  makeChatBetweenUsers: vi.fn(),
}))

describe('useChatStore', () => {
  let chatStore: ReturnType<typeof useChatStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    chatStore = useChatStore()
  })

  it('fetches available users for selection', async () => {
    const mockUsers: User[] = [
      {
        id: 'user1',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        bio: 'Developer',
        profilePicture: null,
      },
    ]

    ;(getAvailableUsers as Mock).mockResolvedValueOnce({
      data: { data: mockUsers },
    })

    const users = await chatStore.getAvailableUsersForSelect()

    expect(getAvailableUsers).toHaveBeenCalled()
    expect(users).toEqual(mockUsers)
  })

  it('creates a chat and adds it to the chats state', async () => {
    const newChat: Chat = {
      chatId: 'chat2',
      users: [{ userId: 'user2', firstname: 'Jane', lastname: 'Smith' }],
      lastMessage: {
        content: 'Welcome!',
        timeStamp: new Date().toISOString(),
        user: { userId: 'user2', firstname: 'Jane', lastname: 'Smith' },
      },
    }

    ;(makeChatBetweenUsers as Mock).mockResolvedValueOnce({
      data: { data: newChat },
    })

    await chatStore.makeChat('user2')
    expect(makeChatBetweenUsers).toHaveBeenCalledWith('user2')
    expect(chatStore.chats).toContainEqual(newChat)
  })
})
