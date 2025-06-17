<script setup lang="ts">
import { useRouter } from 'vue-router'
import SgButton from '../atoms/SgButton.vue'
import { inject, ref, onBeforeUnmount } from 'vue'
import { Socket } from 'socket.io-client'
import type { socketPlayer } from '@/types/'
import { usePlayStore } from '@/stores/play'

const router = useRouter()
const socket: Socket = inject('socket') as Socket
const play = usePlayStore()

const redirecting = ref(false)
const full = ref(false)

const goToPlay = () => {
  router.push('/play')
}
const goFindGame = () => {
  router.push('/find-game')
}
const goCreateRoom = () => {
  sessionStorage.setItem('creator', 'true')
  router.push('/create-room')
}
const goSkins = () => {
  router.push('/skins')
}
const goSettings = () => {
  router.push('/settings')
}

socket.on('prepNewRoom', (playerSocketId: string) => {
  console.log('didnt get this far')
  console.log(playerSocketId)
  console.log(socket.id)
  if (socket.id === playerSocketId) {
    console.log(sessionStorage.getItem('newRoom'))
    socket.emit('checkIfRoomExists', sessionStorage.getItem('newRoom'))
  }
})

socket.on('roomExists', (roomId: string) => {
  // alert('Sending you to the room now!')
  redirecting.value = true
  setTimeout(() => {
    redirecting.value = false
    sessionStorage.removeItem('creator')
    router.push('/create-room?id=' + roomId)
  }, 2500)
})

socket.on('roomDoesNotExist', (roomId) => {
  console.log('room doesnt exists')
  console.log(roomId)
  sessionStorage.setItem('reQ', 'true')
  sessionStorage.setItem('creator', 'true')
  sessionStorage.setItem('reQ', 'true')
  router.push('/create-room?id=' + roomId)
})

if (sessionStorage.getItem('Full')) {
  full.value = true
  setTimeout(() => {
    full.value = false
    sessionStorage.removeItem('Full')
  }, 5000)
}

onBeforeUnmount(() => {
  socket.off('prepNewRoom')
  socket.off('roomExists')
  socket.off('roomDoesNotExist')
})
</script>

<template>
  <section class="main-window">
    <div>
      <div v-if="redirecting" class="redirecting">
        <div class="loading">
          <h2>Redirecting to lobby...</h2>
        </div>
      </div>
      <div v-if="full" class="redirecting">
        <div class="loading">
          <h2>The lobby you tried to join was full!</h2>
        </div>
      </div>
    </div>
    <div class="main-menu">
      <SgButton @click="goFindGame"><RouterLink to="/find-game">Play</RouterLink></SgButton>
      <SgButton @click="goCreateRoom"
        ><RouterLink to="/create-room">Create room</RouterLink></SgButton
      >
      <SgButton @click="goSkins"><RouterLink to="/skins">Skins</RouterLink></SgButton>
      <SgButton @click="goSettings"><RouterLink to="/settings">Settings</RouterLink></SgButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.main-window {
  background-image: url('/src/assets/img/SgBackground.jpg');
  background-size: cover;
  height: 74vh;
  padding-top: 10rem;
  overflow: hidden;

  .redirecting {
    position: fixed; /* Stay in place */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Black with 50% opacity */
    z-index: 1000; /* Ensure it sits on top */

    .loading {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--default-text-dark);
      background-color: var(--bg2-dark);
      padding: 1rem 2rem;
      border-radius: 10px;
    }
  }

  .main-menu {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 80%;
    margin: auto;
    padding: 2rem 0rem;
    border-radius: 10px;
    background-color: var(--bg2-dark);

    button {
      width: 80%;
      background-color: var(--dark-gray);

      a {
        text-decoration: none;
        color: var(--default-text-dark);
      }

      &:hover {
        background-color: var(--btn-hover);
      }
    }
  }
}

/* Breakpoints */
@media (width >= 65em) {
  .main-window {
    padding: 5rem 0rem;
    background-size: cover;
    overflow: hidden;

    .main-menu {
      width: 30%;
      padding: 2rem 0rem;
      border-radius: 10px;
      background-color: var(--bg2-dark);
    }
  }
}
</style>
