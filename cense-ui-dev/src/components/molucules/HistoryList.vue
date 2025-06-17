<script setup lang="ts">
import type { User } from '@/types/type'
import HistoryCard from '@/components/atoms/HistoryCard.vue'
import { ref } from 'vue'

defineProps<{
  history: {
    isApproved: boolean
    user: User
  }[]
  showHistory: boolean
}>()

const isDragging = ref(false)
const startY = ref(0)
const scrollTop = ref(0)
const container = ref<HTMLUListElement | null>(null)

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  startY.value = 'touches' in e ? e.touches[0].pageY : e.pageY
  scrollTop.value = container.value!.scrollTop
  console.log(scrollTop.value)
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
  <div class="history-list" :class="{ showHistory: showHistory }">
    <h2>History</h2>
    <TransitionGroup name="list" tag="div" appear>
      <ul
        ref="container"
        :key="1"
        @mousedown="startDrag"
        @mousemove="handleDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startDrag"
        @touchmove="handleDrag"
        @touchend="stopDrag"
        @touchcancel="stopDrag"
      >
        <li
          v-for="(item, index) in history"
          :key="item.user.id"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <HistoryCard :history-item="item" />
        </li>
      </ul>
    </TransitionGroup>

    <p v-if="!history.length">Geen history</p>
  </div>
</template>

<style scoped lang="scss">
.history-list {
  max-height: 30rem;
  background-color: var(--light-blue);
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  padding: 0 1rem 1rem 1rem;
  overflow: hidden;
  display: none;
  width: min(100%, 30rem);

  h2 {
    margin: 0;
  }

  > div {
    height: 100%;
    cursor: grab;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    // align-items: center;
    gap: 0.5rem;
    flex-direction: column;
    overflow-y: auto;

    li {
      flex: 0 0 auto;
      background-color: var(--blue-25);
      border-radius: 1rem;

      &:nth-child(even) {
        background-color: var(--green-25);
      }
    }
  }
}

.showHistory {
  display: block;
}

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
@media screen and (width > 50rem) {
  .history-list {
    margin-top: 2rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    display: block;

    h2 {
      margin-top: 1.5rem;
    }

    ul {
      flex-direction: column;
      overflow: hidden;
      height: 85%;
      align-items: center;

      li {
        width: 100%;
      }
    }
  }
}
</style>
