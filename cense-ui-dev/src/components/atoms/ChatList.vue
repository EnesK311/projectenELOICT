<script setup lang="ts">
import { type Chat } from '@/types/type'
import { formatTime } from '@/utils/helper'
import { vShortenText } from '@/utils/custom-directives'
import { handleProfilePicture } from '@/utils/helper'
import { storeToRefs } from 'pinia'
import useAuthStore from '@/stores/auth'

defineProps<{ chat: Chat }>()

const preventDragNavigation = (event: DragEvent) => {
  event.preventDefault()
}

const { user } = storeToRefs(useAuthStore())
</script>
<template>
  <RouterLink
    :to="'/chats/' + chat.chatId"
    @dragstart="preventDragNavigation"
    :class="{ unread: chat.unreadMessageCount && chat.unreadMessageCount > 0 }"
  >
    <div class="pf">
      <img
        :src="handleProfilePicture(chat.users[0].profilePicture)"
        :alt="'Profiel foto van ' + chat.users[0].firstname + ' ' + chat.users[0].lastname"
        draggable="false"
      />
      <span
        class="status"
        :style="{
          backgroundColor: chat.users[0].isOnline
            ? 'var(--green)'
            : 'var(--gray)',
        }"
      ></span>
    </div>
    <div class="preview">
      <h3>
        {{
          chat.users[0].firstname && chat.users[0].lastname
            ? chat.users[0].firstname + ' ' + chat.users[0].lastname
            : 'Anonymous'
        }}
      </h3>
      <p v-if="chat.lastMessage">
        <span>{{
          chat.lastMessage?.user.userId === user?.id
            ? 'Jij:'
            : chat.lastMessage?.user.firstname + ':'
        }}</span>
        <span v-shorten-text>{{ chat.lastMessage?.content }}</span>
      </p>
    </div>
    <div class="extra">
      <span v-if="chat.lastMessage" class="time">{{
        formatTime(chat.lastMessage.timeStamp)
      }}</span>
      <span
        v-if="chat.unreadMessageCount && chat.unreadMessageCount > 0"
        class="message-count"
        >{{ chat.unreadMessageCount }}</span
      >
    </div>
  </RouterLink>
</template>
<style scoped lang="scss">
a {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0.5rem;
  align-items: center;
  background: linear-gradient(
    0.25turn,
    var(--dark-blue-05),
    var(--light-blue-25) 70%
  );
  padding: 0.3rem;
  border-radius: 0.5rem;
  color: var(--text);
  opacity: background-color 0.2s ease;
  user-select: none;

  &.unread {
    h3 {
      color: var(--dark-blue);
    }
    p {
      opacity: 1;
    }
  }

  &:hover {
    background-color: var(--light-blue);
  }

  &.router-link-active {
    background-color: var(--light-blue);
  }

  .pf {
    position: relative;
    img {
      width: 4rem;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 0.25rem solid var(--light-blue);
    }
    .status {
      width: 1rem;
      aspect-ratio: 1;
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0.5rem 0rem;
      border: 0.15rem solid var(--white);
    }
  }

  h3 {
    margin: 0;
    font-size: 100%;
    text-align: center;
  }

  .preview {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  p {
    margin: 0;
    font-weight: 800;
    opacity: 0.5;
    line-height: 0.9;
    font-size: 90%;
    margin-top: 0.5rem;
    display: none;

    span:last-child {
      margin-left: 0.2rem;
    }
  }

  .extra {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    justify-content: center;
    flex: 1;
    span {
      color: var(--dark-blue);
      font-weight: 800;
      align-self: center;
      font-size: 70%;
      display: none;
    }

    .message-count {
      background-color: var(--green);
      padding: 0.2rem;
      border-radius: 50%;
      aspect-ratio: 1;
      display: grid;
      place-content: center;
      font-weight: 800;
      color: var(--white);
    }
  }
}

@media screen and (width > 35rem) {
  a {
    flex-direction: row;

    .preview {
      display: flex;

      p {
        display: block;
        margin-top: 0;
      }
    }

    .extra span {
      display: block;
    }

    img {
      width: 3.5rem;
    }

    h3 {
      text-align: left;
    }
  }
}
</style>
