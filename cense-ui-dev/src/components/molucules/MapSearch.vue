<script setup lang="ts">
import UserCard from '../atoms/UserCard.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import useAuthStore from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'

const { users } = storeToRefs(useUserStore())
const { user } = storeToRefs(useAuthStore())

const allUsersWithoutMe = computed(() =>
  users.value.filter(
    u => u.id !== user?.value?.id && u.firstname && u.lastname,
  ),
)

const { isLoading } = storeToRefs(useLoadingStore())

const isDragging = ref(false)
const startY = ref(0)
const scrollTop = ref(0)
const container = ref<HTMLUListElement | null>(null)

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  startY.value = 'touches' in e ? e.touches[0].pageY : e.pageY
  scrollTop.value = container.value!.scrollTop
}

const stopDrag = () => {
  isDragging.value = false
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const y = 'touches' in e ? e.touches[0].pageY : e.pageY
  const walk = (startY.value - y) * 1
  container.value!.scrollTop = scrollTop.value + walk
}
</script>
<template>
  <div
    :class="{ loading: isLoading }"
    class="user-list"
    ref="container"
    @mousedown="startDrag"
    @mousemove="handleDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
    @touchstart="startDrag"
    @touchmove="handleDrag"
    @touchend="stopDrag"
    @touchcancel="stopDrag"
  >
    <TransitionGroup name="list" tag="ul" appear>
      <li
        v-for="(u, index) in allUsersWithoutMe"
        :key="u.id"
        :style="{ transitionDelay: `${index * 100}ms` }"
      >
        <UserCard :user="u" />
      </li>
    </TransitionGroup>
  </div>
</template>
<style scoped lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.5s ease;
}

.user-list {
  overflow-y: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  height: 100%;
  max-height: 17rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  list-style: none;
  padding: 0;
  margin: 0;

  overflow-x: hidden;

  &.loading {
    opacity: 0.5;
  }
  li {
    :deep(.user) {
      user-select: none;
      background: linear-gradient(45deg, var(--dark-blue-05), #00000010 100%);

      border: 0.12rem solid var(--dark-blue-05);
    }

    // button {
    //   width: 100%;
    //   padding: 0;
    //   background-color: transparent;
    //   border: none;
    //   cursor: pointer;
    //   border-radius: 1rem;
    //   font-weight: normal;
    //   text-align: left;
    //   margin-block: 0.2rem;
    // }
  }
}

@media screen and (width > 55rem) {
  .user-list {
    max-height: 60dvh;
  }
}
</style>
