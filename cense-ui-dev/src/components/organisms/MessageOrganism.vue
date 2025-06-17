<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
import useAuthStore from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import type {
  Chat,
  ChatUser,
  Message,
  MessageDto,
  SocketEvent,
} from '@/types/type'
import ChatMessage from '@/components/atoms/ChatMessage.vue'
import { handleProfilePicture } from '@/utils/helper'
import { useSocket } from '@/composables/socket'

const props = defineProps<{ chatId: string }>()

// Refs
const messagesContainer = ref<HTMLUListElement | null>(null)
const isRecipientTyping = ref(false)
const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
// Models
const newMessage = defineModel<string>()

// Computed properties
const chat = computed<Chat>(() => {
  return chats.value.filter(chat => chat.chatId === props.chatId)[0]
})
const recipientUser = computed<ChatUser | null>(() => {
  if (chat.value) return chat.value.users[0]
  else return null
})
const idFromChat = computed<string>(() => props.chatId)

// Stores
const { user } = storeToRefs(useAuthStore())
const { messages, chats } = storeToRefs(useChatStore())

const { getMessagesFromChat, setCurrentChatId, setUnreadMessageCount } =
  useChatStore()

// Composables
const {
  socket,
  sendEvent,
  isMessageListenerActive,
  setIsMessageListenerActive,
} = useSocket()

// Watchers
watch(idFromChat, () => {
  if (!chat.value) return
  sendEvent('open-chat', {
    ChatId: chat.value.chatId,
    RecipientUser: recipientUser.value?.userId,
  })
  getMessagesFromChat(props.chatId)
})
watch(socket, (newSocket, oldSocket) => {
  if (oldSocket) {
    oldSocket.removeEventListener('message', handleMessageEvent)
    setIsMessageListenerActive(false)
  }
  if (newSocket) {
    newSocket.addEventListener('message', handleMessageEvent)
    setIsMessageListenerActive(true)
  }
})
watch(messages, () => {
  nextTick(() => scrollToBottom())
})

// Lifecycle hooks
onMounted(initChat)
onUnmounted(cleanupChat)

// Methods
function initChat() {
  setupSocketListeners()
  setCurrentChatId(props.chatId)
  setUnreadMessageCount(props.chatId, 0)
  getMessagesFromChat(props.chatId).then(scrollToBottom)
  if (chat.value && chat.value.chatId && recipientUser.value?.userId) {
    sendEvent('open-chat', {
      ChatId: chat.value.chatId,
      RecipientUser: recipientUser.value?.userId,
    })
  }
}

function setupSocketListeners() {
  if (!socket.value) {
    console.error('Socket connection not available.')
    return
  }

  console.log(isMessageListenerActive.value)
  if (!isMessageListenerActive.value) {
    socket.value.addEventListener('message', handleMessageEvent)
    setIsMessageListenerActive(true)
  }
}

function cleanupChat() {
  if (socket.value) {
    socket.value.removeEventListener('message', handleMessageEvent)
  }
  setIsMessageListenerActive(false)

  setCurrentChatId(null)
  sendEvent('close-chat', {
    ChatId: chat.value.chatId,
    RecipientUser: recipientUser.value?.userId,
  })
}

const handleMessageEvent = async (e: MessageEvent) => {
  const event = JSON.parse(e.data) as SocketEvent
  if (event.Type === 'message') {
    const data = event.Payload as MessageDto
    if (data.ChatId !== props.chatId) return

    if (!user.value || !user.value.id) return

    const newMessage: Message = {
      userId: data.UserId,
      recipientId: user.value?.id,
      content: data.Content,
      timeStamp: data.TimeStamp,
      chatId: data.ChatId,
      isRead: data.IsRead,
    }
    messages.value.push(newMessage)
    await nextTick()
    scrollToBottom()
  }

  if (event.Type === 'chat-read') {
    console.log('chat read event')
    handleChatReadEvent(event.Payload as { ChatId: string })
  }

  if (event.Type === 'typing-status') {
    handleTypingStatusEvent(
      event.Payload as { SenderId: string; IsTyping: boolean },
    )
  }
}

const handleTypingStatusEvent = (eventPayload: {
  SenderId: string
  IsTyping: boolean
}) => {
  if (eventPayload.SenderId === recipientUser.value?.userId) {
    isRecipientTyping.value = eventPayload.IsTyping
  }
}

const handleChatReadEvent = (eventPayload: { ChatId: string }) => {
  if (eventPayload.ChatId === props.chatId) {
    messages.value.forEach(msg => {
      if (!msg.isRead) {
        msg.isRead = true
      }
    })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!socket.value || socket.value?.readyState !== WebSocket.OPEN) {
    alert('WebSocket connection is not open.')
    return
  }

  if (!newMessage.value) return

  const currentMessage = {
    userId: user.value?.id,
    recipientId: recipientUser.value?.userId,
    content: newMessage.value,
    timeStamp: new Date().toISOString(),
    chatId: props.chatId,
    isRead: false,
  } as Message

  messages.value.push(currentMessage)

  const message = {
    Type: 'message',
    Payload: {
      UserId: user.value?.id,
      RecipientId: recipientUser.value?.userId,
      Content: newMessage.value,
      TimeStamp: new Date().toISOString(),
      ChatId: props.chatId,
      IsRead: false,
    } as MessageDto,
  }

  if (message.Payload.RecipientId && message.Payload.Content) {
    socket.value?.send(JSON.stringify(message))
    newMessage.value = ''

    await nextTick()
    scrollToBottom()
  } else {
    alert('Recipient and message cannot be empty.')
  }
}

const shouldShowTime = (index: number) => {
  if (index === messages.value.length - 1) return true
  const currentMessage = messages.value[index]
  const previousMessage = messages.value[index + 1]
  return currentMessage.userId !== previousMessage.userId
}

const lastReadIndex = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].isRead) {
      return i
    }
  }
  return -1
})

const sendTypingStatus = (isTyping: boolean) => {
  if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return

  sendEvent('typing', {
    RecipientId: recipientUser.value?.userId,
    IsTyping: isTyping,
  })
}

const handleTyping = () => {
  if (typingTimeout.value) clearTimeout(typingTimeout.value)
  sendTypingStatus(true)

  typingTimeout.value = setTimeout(() => {
    sendTypingStatus(false)
  }, 3000)
}
</script>

<template>
  <section class="chat-window">
    <div v-if="recipientUser" class="chat-header">
      <img
        :src="handleProfilePicture(recipientUser?.profilePicture)"
        :alt="'Profiel foto of ' + recipientUser?.firstname + ' ' + recipientUser?.lastname"
        class="avatar"
      />
      <h2 class="chat-name">
        {{
          recipientUser?.firstname && recipientUser?.lastname
            ? recipientUser?.firstname + ' ' + recipientUser?.lastname
            : 'Anonymous'
        }}
      </h2>
    </div>
    <ul ref="messagesContainer" class="chat-messages">
      <li v-for="(msg, idx) in messages" :key="idx">
        <ChatMessage
          :msg="msg"
          :show-time="shouldShowTime(idx)"
          :profile-picture="
            handleProfilePicture(
              msg.recipientId === user?.id
                ? recipientUser?.profilePicture
                : user?.profilePicture,
            )
          "
          :color="msg.recipientId === user?.id ? 'var(--white)' : user?.color"
          :show-read="idx === lastReadIndex"
          :recipient-profile-picture="recipientUser?.profilePicture"
          :recipient-color="recipientUser?.color"
          :image-alt="'Profiel foto of ' + recipientUser?.firstname + ' ' + recipientUser?.lastname"
        />
      </li>
    </ul>
    <div class="container">
      <div v-if="isRecipientTyping" class="typing-indicator">
        <div class="pf" :style="{ backgroundColor: recipientUser?.color }">
          <img :src="recipientUser?.profilePicture" :alt="'Profiel foto of ' + recipientUser?.firstname + ' ' + recipientUser?.lastname" />
        </div>
        <iframe
          src="https://lottie.host/embed/7dbd7818-2588-436d-8500-8476e7d84eed/NZI6msAgZk.lottie"
        ></iframe>
      </div>
      <div class="chat-input">
        <div class="icon">+</div>
        <form class="chat-form" @submit.prevent="sendMessage">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Start met typen..."
            class="chat-input-field"
            @input="handleTyping"
          />
          <button id="send-button" type="submit" class="chat-send-button" aria-label="send">
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.container {
  padding: 0.6rem 0.6rem;
  padding-top: 0.2rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.2rem;

  .pf {
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    aspect-ratio: 1;

    img {
      width: 100%;
    }
  }

  iframe {
    width: 1.5rem;
    aspect-ratio: 1;
    border: none;
  }
}

.chat-window {
  display: flex;
  flex-direction: column;
  background-color: var(--light-blue);
  border-radius: 1rem;
  height: 77dvh;
}

.content {
  width: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  gap: 0.2rem;

  img {
    width: 2rem;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 50%;
    border: 0.15rem solid var(--dark-blue);
  }
}

ul {
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  list-style: none;
  overflow-y: scroll;

  li {
    width: 100%;
    /* max-width: 25rem; */
  }
}

.chat-message-container {
  display: flex;
  flex-direction: column;
}

.chat-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--dark-blue-25);
  border-radius: 5rem;
  padding: 0.6rem 0.6rem;
  gap: 1rem;
}

.chat-form {
  display: flex;
  flex: 1;
  gap: 1rem;
}

.chat-input .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--green);
  color: var(--white);
  border-radius: 50%;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.chat-input input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 1rem;
  color: var(--black);
  opacity: 0.7;
}

.chat-input button {
  background: none;
  border: none;
  color: var(--dark-blue);
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  padding: 0.5rem;
}

.chat-input input {
  flex: 1;
  font-size: 1rem;

  border-radius: 20px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-text {
  margin: 0;
}

.chat-name {
  margin: 0;
}

@media screen and (width > 35rem) {
  .chat-window {
    flex: 1;
  }
}
</style>
