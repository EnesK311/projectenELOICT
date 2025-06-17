<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import ChatList from '@/components/atoms/ChatList.vue'
import 'vs-vue3-select/dist/vs-vue3-select.css'
import {
  type Chat,
  type SocketEvent,
  type StatusDto,
  type User,
} from '@/types/type'
import { handleProfilePicture } from '@/utils/helper'
import { useSocket } from '@/composables/socket'

const { chats } = storeToRefs(useChatStore())
const { getAvailableUsersForSelect, makeChat } = useChatStore()
const users = ref<User[]>()
const selectedUser = ref<User | null>(null)

const dialog = ref<HTMLDialogElement | undefined>(undefined)

getAvailableUsersForSelect().then((res: User[]) => (users.value = res))

const { socket } = useSocket()

socket.value?.addEventListener('message', async e => {
  const event = JSON.parse(e.data) as SocketEvent

  if (event.Type === 'chat') {
    const payload = event.Payload as Chat
    if (
      chats.value.find(chat => chat.chatId === payload.chatId) ||
      !chats.value
    )
      return
    chats.value.push(payload as Chat)
    await getAvailableUsersForSelect().then(
      (res: User[]) => (users.value = res),
    )
  } else if (event.Type === 'user-status') {
    const data = event.Payload as StatusDto
    const chat = chats.value.find(chat => chat.users[0].userId === data.UserId)
    if (chat && chat.users[0]) {
      chat.users[0].isOnline = data.IsOnline
    }
  }
})

const route = useRoute()

const isSubRouteActive = computed(() => {
  return route.matched.length > 1
})

const getOptionLabel = (user: User) =>
  user.firstname && user.lastname
    ? user.firstname + ' ' + user.lastname
    : 'Anonymous'

const handleAddChat = async () => {
  if (selectedUser.value && selectedUser.value.id) {
    await makeChat(selectedUser.value?.id)
    dialog.value?.close()
  } else {
    console.log('no selected user')
  }
}

const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const container = ref<HTMLUListElement | null>(null)

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  startX.value = 'touches' in e ? e.touches[0].pageX : e.pageX
  scrollLeft.value = container.value!.scrollLeft
}

const stopDrag = () => {
  isDragging.value = false
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const x = 'touches' in e ? e.touches[0].pageX : e.pageX
  const walk = (startX.value - x) * 1
  container.value!.scrollLeft = scrollLeft.value + walk
}
</script>

<template>
  <main>
    <aside class="sidebar">
      <div>
        <h2>Messages</h2>
        <button @click="dialog?.showModal()" aria-label="maak chat aan">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </div>
      <dialog ref="dialog">
        <h2>Maak een nieuwe chat aan</h2>
        <v-select
          v-model="selectedUser"
          :options="users"
          :get-option-label="getOptionLabel"
        >
          <template #option="u">
            <img
              :src="handleProfilePicture(u.profilePicture)"
              :alt="'Profiel foto van ' + u.firstname + ' ' + u.lastname"
              class="avatar"
              draggable="false"
            />
            {{
              u.firstname && u.lastname
                ? u.firstname + ' ' + u.lastname
                : 'Anonymous'
            }}
          </template>
        </v-select>
        <ul class="users"></ul>
        <div class="buttons">
          <button @click="dialog?.close()">Cancel</button>
          <button @click="handleAddChat">Maak Chat</button>
        </div>
      </dialog>
      <ul
        ref="container"
        class="draggable-list"
        @mousedown="startDrag"
        @mousemove="handleDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startDrag"
        @touchmove="handleDrag"
        @touchend="stopDrag"
        @touchcancel="stopDrag"
      >
        <li v-for="chat in chats" :key="chat.chatId">
          <ChatList :chat="chat" />
        </li>
      </ul>
    </aside>
    <RouterView />
    <div v-if="!isSubRouteActive" class="empty-chat">
      Open een chat en begin het gesprek!
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  gap: 1rem;
}

.empty-chat {
  min-height: 77dvh;
  flex: 1;
  background-color: var(--light-blue);
  display: grid;
  place-items: center;
  font-weight: 800;
  color: var(--black);
  border-radius: 1rem;
  border: 0.3rem solid var(--dark-blue);
  border-style: dashed;
}

aside {
  background-color: var(--bg);
  transition: background-color 0.3s ease;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    button {
      aspect-ratio: 1;
      border: none;
      border: 0.12rem solid transparent;
      border-radius: 50%;
      background-color: transparent;
      color: var(--red);
      cursor: pointer;
      display: grid;
      place-content: center;
      font-size: 70%;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: var(--red);
      }
    }
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 0.5rem;
  li {
    padding: 0;
    width: min(100%, 7rem);
    min-width: 7rem;
  }
}

.draggable-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: hidden;
  cursor: grab;

  &.dragging {
    cursor: grabbing;
  }

  li {
    flex-shrink: 0;
    width: min(100%, 7rem);
    min-width: 7rem;
  }
}

dialog[open] {
  height: 12rem;
  aspect-ratio: 2/1;
  border-radius: 0.5rem;
  border: 0.2rem solid var(--dark-blue);
  background-color: var(--light-blue);
  display: flex;
  flex-direction: column;

  &::backdrop {
    backdrop-filter: brightness(0.4) blur(0.2rem);
  }

  .buttons {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    button {
      border: none;
      background-color: var(--dark-blue);
      color: var(--white);
      padding: 0.3rem;
      border-radius: 0.3rem;
      cursor: pointer;

      &:first-of-type {
        background-color: var(--red);
      }
    }
  }
}

.avatar {
  width: 2rem;
}

@media screen and (width > 35rem) {
  main {
    flex-direction: row;

    .sidebar {
      width: min(100%, 15rem);
    }

    .draggable-list {
      flex-direction: column;

      li {
        width: 100%;
      }
    }
  }
}
</style>
