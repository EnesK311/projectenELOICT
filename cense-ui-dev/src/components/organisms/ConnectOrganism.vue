<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SwipePicture from '../atoms/SwipePicture.vue'
import { useUserStore } from '@/stores/user'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import useAuthStore from '@/stores/auth'
import SwipeActions from '../atoms/SwipeActions.vue'
import SwipeDetails from '../atoms/SwipeDetails.vue'
import HistoryList from '../molucules/HistoryList.vue'
import { useChatStore } from '@/stores/chat'
import { useToast } from 'vue-toastification'

const index = ref<number>(0)
const noOne = ref<boolean>(true)
const showHistory = ref<boolean>(true)

const { swipeUsers, history } = storeToRefs(useUserStore())
const { getSwipeUsers, swipeUser, getSwipeHistory } = useUserStore()
const { user } = storeToRefs(useAuthStore())
const { makeChat } = useChatStore()
const toast = useToast()

onMounted(async () => {
  if (user.value?.specialities?.needed)
    await getSwipeUsers(user.value?.specialities?.needed?.map(s => s.name))
  await getSwipeHistory()
  if (swipeUsers.value.length > 0) noOne.value = false
  console.log(noOne.value)
  console.log(history.value)
})

watch(swipeUsers, async () => {
  await nextTick()
  if (swipeUsers.value.length === 0) return (noOne.value = true)
  const wrapper: HTMLElement | null = document.querySelector('.swipe-picture')
  if (!wrapper) return console.error('Wrapper not found')
  wrapper.addEventListener('pointerdown', onPointerDown)
  wrapper.addEventListener('pointermove', onPointerMove)
  wrapper.addEventListener('pointerup', onPointerUp)
  wrapper.addEventListener('pointerleave', onPointerUp)
  wrapper.addEventListener('pointerout', onPointerUp)
  wrapper.addEventListener('touchmove', onPointerUp)
  wrapper.addEventListener('touchstart', onPointerDown)
  wrapper.addEventListener('touchend', onPointerUp)
  wrapper.addEventListener('touchcancel', onPointerUp)
  wrapper.addEventListener('touchleave', onPointerUp)
})

const handleSwipe = async (direction: 'left' | 'right' | 'history') => {
  if (direction === 'history') {
    showHistory.value = !showHistory.value
    return
  }

  const currentUser = swipeUsers.value[index.value]

  if (direction === 'right') {
    if (!currentUser.id) return
    await swipeUser(currentUser.id, true)
    await makeChat(currentUser.id)
    toast.success('Chat aangemaakt met ' + currentUser.firstname + '!')
  } else {
    await swipeUser(currentUser.id, false)
  }

  await getSwipeHistory()

  if (!swipeUsers.value[index.value + 1]) {
    noOne.value = true
    return
  }

  index.value++

  swipeData.value.startX = 0
  swipeData.value.currentX = 0
  swipeData.value.swiping = false
}

const handleActionClick = (action: 'dislike' | 'like' | 'history') => {
  handleSwipe(
    action === 'like' ? 'right' : action === 'dislike' ? 'left' : 'history',
  )
}

const swipeData = ref({
  startX: 0,
  currentX: 0,
  swiping: false,
})
const maxRotation = 25
const rotation = computed(() => {
  const deltaX = swipeData.value.currentX - swipeData.value.startX
  const rotation = (deltaX / window.innerWidth) * maxRotation
  return Math.min(maxRotation, Math.max(-maxRotation, rotation))
})

const onPointerDown = (event: PointerEvent | TouchEvent) => {
  if ('button' in event && event.button !== 0) return // Alleen linkerknop toestaan
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  swipeData.value.startX = clientX
  swipeData.value.swiping = true
}

const onPointerMove = (event: PointerEvent | TouchEvent) => {
  if (!swipeData.value.swiping) return
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  swipeData.value.currentX = clientX
}

const onPointerUp = () => {
  if (!swipeData.value.swiping) return

  const deltaX = swipeData.value.currentX - swipeData.value.startX
  const threshold = 100

  if (deltaX > threshold) {
    handleSwipe('right')
  } else if (deltaX < -threshold) {
    handleSwipe('left')
  }

  swipeData.value.swiping = false
  swipeData.value.startX = 0
  swipeData.value.currentX = 0
}
</script>
<template>
  <main
    v-if="swipeUsers.length > 0"
    :style="{ display: noOne ? 'none' : 'flex' }"
  >
    <div class="wrapper">
      <SwipePicture
        :img="swipeUsers[index].profilePicture"
        :color="swipeUsers[index].color"
        v-if="swipeUsers[index] && swipeUsers[index].profilePicture"
        :style="{
          rotate: swipeData.swiping ? rotation + 'deg' : '0deg',
        }"
        :alt="
          swipeUsers[index].firstname +
          ' ' +
          swipeUsers[index].lastname +
          ' swipe picture'
        "
      />
      <SwipeActions @action-click="handleActionClick" />
      <SwipeDetails :user="swipeUsers[index]" :show-details="showHistory" />
      <HistoryList :history="history" :show-history="!showHistory" />
    </div>
  </main>
  <div class="no-one" :style="{ display: noOne ? 'flex' : 'none' }">
    <div class="not-found">
      <div class="wrapper">
        <img src="@/assets/images/Crying_Face.png" alt="Sad face" />
        <h1>Niemand gevonden</h1>
        <p>
          Sorry, we hebben momenteel niemand gevonden om je gezelschap te
          houden.
        </p>
      </div>
      <HistoryList :history="history" :show-history="showHistory" />
    </div>
  </div>
</template>
<style scoped lang="scss">
main,
.no-one {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 80dvh;

  .wrapper {
    user-select: none;
    width: 100%;
  }

  .not-found {
    margin-top: 3rem;
    background-color: var(--light-blue);
    padding: 0.5rem;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    text-align: center;

    img {
      margin: 0 0 1rem 0;
    }

    h1 {
      margin: 0;
    }

    p {
      margin: 0;
    }
  }
}
@media screen and (width > 50rem) {
  main > div {
    display: grid;
    grid-template-columns: 25rem 1fr;
    grid-template-rows: 25rem 5rem;
    max-width: 70rem;
    margin-inline: auto;

    .actions {
      grid-column-start: 1;
      grid-row-start: 2;
    }

    .content {
      grid-column-start: 2;
      grid-column: span 3;
      grid-row: span 2;
    }

    .history-list {
      grid-column-start: 5;
      grid-row: span 2;
    }

    .swipe-picture {
      margin-left: auto;
    }
  }

  .not-found.not-found {
    flex-direction: row;
  }
}
</style>
