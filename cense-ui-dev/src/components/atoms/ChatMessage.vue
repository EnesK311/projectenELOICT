<script lang="ts" setup>
import useAuthStore from '@/stores/auth'
import type { Message } from '@/types/type'
import { storeToRefs } from 'pinia'
import { formatTime } from '@/utils/helper'

const props = defineProps<{
  msg: Message
  showTime: boolean
  profilePicture: string | undefined
  color?: string | null
  showRead: boolean
  recipientProfilePicture: string | undefined
  recipientColor: string | undefined
  imageAlt: string
}>()

console.log(props.recipientColor)

const { user } = storeToRefs(useAuthStore())

const handleBackgroundColor = (): string => {
  if (!user.value || !props.color || !props.recipientColor)
    return 'var(--white)'
  return props.msg.userId === user.value?.id
    ? props.color
    : props.recipientColor
}
</script>
<template>
  <div class="message" :class="{ rounded: showTime }">
    <div class="pf" :style="{ backgroundColor: handleBackgroundColor() }">
      <img :src="profilePicture" :alt="imageAlt" />
    </div>
    <div>
      <div
        :class="{
          sent: msg.userId === user?.id,
          received: msg.userId !== user?.id,
        }"
      >
        <p>{{ msg.content }}</p>
      </div>
      <span
        v-if="showTime"
        class="time"
        :class="{
          'sent-time': msg.userId === user?.id,
          'received-time': msg.userId !== user?.id,
        }"
      >
        {{ formatTime(msg.timeStamp) }}
      </span>
    </div>
  </div>
  <div
    v-if="showRead"
    class="read"
    :style="{
      backgroundColor: recipientColor ? recipientColor : 'var(--white)',
    }"
  >
    <img :src="recipientProfilePicture" :alt="imageAlt" />
  </div>
</template>
<style lang="scss" scoped>
.message {
  width: min(100%, 25rem);
  max-width: max-content;
  display: flex;
  align-items: center;
  gap: 0.2rem;

  .pf {
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
  }

  img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  &:has(.sent) {
    margin-left: auto;
    flex-direction: row-reverse;
  }

  &.rounded div div {
    border-radius: 1rem;

    &.sent {
      border-bottom-right-radius: 0;
    }

    &.received {
      border-bottom-left-radius: 0;
    }
  }

  > div div {
    border-radius: 1rem;
    padding: 0.2rem;
    padding-inline: 0.7rem;

    p {
      margin: 0;
      font-weight: 600;
    }

    &.sent {
      background-color: var(--green);

      color: var(--white);

      + .time {
        justify-content: flex-end;
      }
    }

    &.received {
      background-color: var(--bg);
      color: var(--text);
    }
  }

  .time {
    font-size: 70%;
    color: var(--black);
    opacity: 0.5;
    font-weight: bold;
    margin-left: auto;
    display: flex;
    align-items: center;
    text-align: right;
    font-style: italic;
  }
}

.read {
  display: flex;
  justify-content: flex-end;
  width: 1rem;
  margin-left: auto;
  border-radius: 50%;

  img {
    margin-left: auto;
    width: 1rem;
    aspect-ratio: 1;
    border-radius: 50%;
  }
}
</style>
