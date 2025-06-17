<script setup lang="ts">
import { useUrlSearchParams, useClipboard } from '@vueuse/core'
import SgButton from '../atoms/SgButton.vue'
import { computed, inject, ref, watchEffect, onBeforeUnmount } from 'vue'
import type { Room, Map, GameMode, Player } from '@/types/'
import SgToast from '../atoms/SgToast.vue'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'
import { useMapsStore } from '@/stores/maps'
import { useGamemodesStore } from '@/stores/gamemodes'
import { storeToRefs } from 'pinia'
import SgSoundRange from '../atoms/SgSoundRange.vue'
import { useSettingsStore } from '@/stores/settings'
import { Socket } from 'socket.io-client'
import { watch } from 'fs'
import { useAuthStore } from '@/stores/auth'
import { useCharStore } from '@/stores/char'

// pinia
/* auth store */
const authStore = useAuthStore()
const charStore = useCharStore()

let creator = false

watchEffect(() => {
  const params = useUrlSearchParams('history')
  if (sessionStorage.getItem('creator') === params.id) {
    creator = true
  } else {
    creator = false
  }
})

checkIfRoomInitated()

function checkIfRoomInitated() {
  setTimeout(() => {
    console.log(creator)
    const params = useUrlSearchParams('history')
    console.log(params.id)
    if (!params.id) {
      creator = true
      console.log('no room 1111')
    }
    if (params.id && !sessionStorage.getItem('reQ')) {
      console.log('no room 2222')
      return
    }
    if (!creator && !sessionStorage.getItem('reQ')) {
      console.log('no room 3333')
      return
    }
    console.log('room initiated')
    const randomGuid: string = uuidv4()
    if (sessionStorage.getItem('newRoom')) {
      params.id = sessionStorage.getItem('newRoom') + ''
      console.log('new room with id: ' + params.id)
      creator = true
    } else {
      params.id = randomGuid
      console.log('new room with random id: ' + params.id)
    }
    if (creator) {
      sessionStorage.setItem('creator', params.id)
    }
    sessionStorage.removeItem('newRoom')
    sessionStorage.removeItem('reQ')
    setTimeout(() => {
      socket.emit('createRoom', currentRoom.value, player, params.id)
    }, 1000)
  }, 1000)
}
/* maps store */
const mapsStore = useMapsStore()
const { selectedMap, maps } = storeToRefs(mapsStore)
selectedMap.value = maps.value[0]

/* modes store */
const modesStore = useGamemodesStore()
const { selectedMode, modes } = storeToRefs(modesStore)
selectedMode.value = modes.value[0]

/* settings store */
const settingsStore = useSettingsStore()
const { volume } = storeToRefs(settingsStore)

const currentRoom = ref<Room | null>(null)

// router
const socket: Socket = inject('socket') as Socket
const router = useRouter()
const players = ref<Player[]>([])
const oldPlayers = ref<String[]>([])

const player = ref<Player>()

if (authStore.isAuthenticated && authStore.user) {
  player.value = {
    id: '' + authStore.user.id,
    username: authStore.user.username,
    email: authStore.user.email,
    level: authStore.user.level,
    highscore: authStore.user.highscore,
    games_played: authStore.user.games_played,
    games_won: authStore.user.games_won,
    players_killed: authStore.user.players_killed,
    skins: authStore.user.skins,
    role: authStore.user.role
  }
} else {
  player.value = {
    id: 'player' + Math.floor(Math.random() * (10000 - 0 + 1)) + 0,
    // id: 'player' + 0,
    username: 'guest' + Math.floor(Math.random() * (10000 - 0 + 1)) + 0,
    email: '',
    level: 0,
    highscore: 0,
    games_played: 0,
    games_won: 0,
    players_killed: 0,
    skins: [],
    role: ''
  }
}

// function checkStatus () {
//   socket.emit('checkStatus', useUrlSearchParams('history').id)
//   console.log('checking status')
// }

socket.on('evacuateRoom', (roomId: string) => {
  if (roomId === useUrlSearchParams('history').id) {
    router.push('/')
  }
})

socket.on('gameBusy', (gId) => {
  if (gId === useUrlSearchParams('history').id) {
    router.push('/')
  }
})

socket.on('joinedRoom', (room: Room) => {
  const params = useUrlSearchParams('history')

  sessionStorage.setItem('players', JSON.stringify(room.players))
  console.log('player joined room')
  if (params.id === room.id) {
    currentRoom.value = room
    console.log(room)
    players.value = currentRoom.value.players
    //push each players username to oldusers with a foreach
    room.players.forEach((player) => {
      oldPlayers.value?.push(player.username)
    })

    //get the id of the player that last joined this room and push it intho the messages array to display in chat
    messages.value.push({
      playerName: room.players[room.players.length - 1].username,
      message: 'joined the room'
    })
  }
})

socket.on('newCreator', (plId) => {
  const params = useUrlSearchParams('history')
  console.log('new creator')
  if (socket.id === plId) {
    sessionStorage.setItem('creator', params.id + '')
    creator = true
  }
})

socket.on('playerLeft', (room: Room) => {
  //get the id of the player that left and push a message in the messages array
  console.log('above oldplayers')
  console.log(oldPlayers.value)
  if (oldPlayers.value) {
    console.log('inside oldplayers')
    messages.value.push({
      playerName: oldPlayers.value[room.players.length - 1] as string,
      message: 'left the room'
    })
  }
  //get rid of last name in oldplayers
  oldPlayers.value?.pop()
  players.value = room.players
})

const params = useUrlSearchParams('history')
socket.emit('getPlayers', params.id)
socket.on('players', (room: Room) => {
  currentRoom.value = room
})

if (!creator) {
  const params = useUrlSearchParams('history')
  if (!params.id) {
    if (creator) document.location.reload()
  }
  console.log(params.id)
  socket.emit('checkPlayerCount', params.id)
}

socket.on('roomFull', (roomId: string) => {
  if (roomId === useUrlSearchParams('history').id) {
    sessionStorage.setItem('Full', 'true')
    router.push('/')
  }
})

socket.on('roomNotFull', (roomId: string) => {
  if (roomId === useUrlSearchParams('history').id) {
    socket.emit('joinRoom', params.id, player)
  }
})

// Generate a random GUID

/* toast settigns */
const showToast = ref<boolean>(false)

const toggleToast = () => {
  showToast.value = !showToast.value
}

/* invite button */
const source = ref('Hello')
const { copy, copied } = useClipboard({ source })

const invite = () => {
  copy(window.location.href)
  if (copied) {
    toggleToast()
  }
}

/* Previous and next buttons */
// Method to switch to the previous map
const prevMap = () => {
  const currentIndex = maps.value.findIndex((map) => map === selectedMap.value)
  const newIndex = (currentIndex - 1 + maps.value.length) % maps.value.length
  selectedMap.value = maps.value[newIndex]
}

// Method to switch to the next map
const nextMap = () => {
  const currentIndex = maps.value.findIndex((map) => map === selectedMap.value)
  const newIndex = (currentIndex + 1) % maps.value.length
  selectedMap.value = maps.value[newIndex]
}

// Method to switch to the previous game mode
const prevMode = () => {
  const currentIndex = modes.value.findIndex((mode) => mode === selectedMode.value)
  const newIndex = (currentIndex - 1 + modes.value.length) % modes.value.length
  selectedMode.value = modes.value[newIndex]
}

// Method to switch to the next game mode
const nextMode = () => {
  const currentIndex = modes.value.findIndex((mode) => mode === selectedMode.value)
  const newIndex = (currentIndex + 1) % modes.value.length
  selectedMode.value = modes.value[newIndex]
}

const charRange = ref<number>(0)
if(JSON.parse(sessionStorage.getItem('selectCharater')!)){
  charRange.value = JSON.parse(sessionStorage.getItem('selectCharater')!).id - 1
  charStore.selectedCharacter = charStore.chars[charRange.value]
}
// sessionStorage.setItem("selectCharater", JSON.stringify(charStore.chars[0]));

// Method to switch to previous character
const prevChar = () => {
  if(charRange.value == 0){
    charRange.value = 2
  }else{
    charRange.value--
  }

  charStore.selectedCharacter = charStore.chars[charRange.value]
  sessionStorage.setItem("selectCharater", JSON.stringify(charStore.selectedCharacter));
}

// Method to switch to next character
const nextChar = () => {
  if(charRange.value == 2){
    charRange.value = 0
  }else{
    charRange.value++
  }

  charStore.selectedCharacter = charStore.chars[charRange.value]
  sessionStorage.setItem("selectCharater", JSON.stringify(charStore.selectedCharacter));
}

/* actions buttons */
const startGame = () => {
  // router.push('/character-select')
  // router.push('/play')
  sessionStorage.setItem('players', JSON.stringify(players.value))
  const params = useUrlSearchParams('history')
  if (params.id) {
    socket.emit('startGame', currentRoom.value)
  }
}

socket.on('gameStarted', (roomId: string) => {
  console.log(roomId)
  console.log('game started')
  //console.log(player.value.id)
  const params = useUrlSearchParams('history')
  sessionStorage.setItem('players', JSON.stringify(players.value))
  if (params.id && roomId && player.value) {
    if (roomId === params.id) {
      if (creator) {
        sessionStorage.setItem('crt', 'true')
      }
      router.push('/play?id=' + roomId + '&playerId=' + player.value.id)
    }
  }
})

watchEffect(() => {
  selectedMap.value = maps.value[0]
  selectedMode.value = modes.value[0]
  console.log('watchEffect ')
})

watchEffect(() => {
  const params = useUrlSearchParams('history')
  currentRoom.value = {
    id: params.id + '',
    name: 'test room',
    map: selectedMap.value ? selectedMap.value : maps.value[0],
    mode: selectedMode.value ? selectedMode.value : modes.value[0],
    players: players.value,
    ping: 0
  }

  if (creator) {
    socket.emit('settingsChanged', currentRoom.value)
  }
})

//throttling error is hier
socket.on('settingsChanged', (room: Room) => {
  if (room.id === currentRoom.value?.id) {
    console.log('how many')
    selectedMap.value = room.map
    selectedMode.value = room.mode
  }
})

const leaveGame = async () => {
  await socket.emit('leaveRoom', socket.id, params.id)
  router.push('/')
}

// before leaving the page even if the user closes the tab or goes to previous page run socket.emit('leaveRoom')

// Chat functionality
const messages = ref<{ playerName: string; message: string }[]>([])
const chatMessage = ref('')

// Listen for incoming chat messages
socket.on('receiveMessage', (message: string, playerName: string, roomId: string) => {
  //if the player is in the lobby
  if (roomId === currentRoom.value?.id) {
    messages.value.push({ playerName, message })
  }
})

// Send a chat message
const sendMessage = () => {
  const params = useUrlSearchParams('history')
  if (chatMessage.value.trim() !== '' && player.value && params.id) {
    socket.emit('sendMessage', chatMessage.value, params.id, player.value.username)
    chatMessage.value = ''
  }
}

onBeforeUnmount(() => {
  socket.off('evacuateRoom')
  socket.off('gameBusy')
  socket.off('joinedRoom')
  socket.off('newCreator')
  socket.off('playerLeft')
  socket.off('players')
  socket.off('settingsChanged')
})
</script>

<template>
  <section class="create-room">
    <div class="create">
      <div>
        <SgToast v-if="showToast" :content="'Game link copied!'" :duration="5000"></SgToast>
      </div>

      <div class="settings">
        <div class="bg-gray players">
          <h2>Players</h2>
          <ul class="player-list">
            <li v-for="player in players" :key="player.id">
              {{ player.username }} (lvl. <span>{{ player.level }}</span
              >)
            </li>
          </ul>
          <div>
            <SgButton @click="invite">Invite</SgButton>
          </div>
        </div>

        <div class="bg-gray options">
          <h2>Game options</h2>
          <div class="game-options">
            <div>
              <h3>Map</h3>
              <div class="map-select">
                <SgButton v-if="creator" @click="prevMap" class="select-btn"
                  ><i class="fa-solid fa-chevron-left"></i
                ></SgButton>
                <div class="maps">
                  <div>
                    <p>{{ selectedMap?.name }}</p>
                    <img :src="selectedMap?.image" alt="map image" />
                  </div>
                </div>
                <SgButton v-if="creator" @click="nextMap" class="select-btn"
                  ><i class="fa-solid fa-chevron-right"></i
                ></SgButton>
              </div>
            </div>
            <div>
              <h3>Gamemode</h3>
              <div class="gamemode-select">
                <SgButton v-if="creator" @click="prevMode" class="select-btn"
                  ><i class="fa-solid fa-chevron-left"></i
                ></SgButton>
                <div class="gamemodes">
                  <div>
                    <p>{{ selectedMode?.name }}</p>
                    <img :src="selectedMode?.image" alt="mode image" />
                  </div>
                </div>
                <SgButton v-if="creator" @click="nextMode" class="select-btn"
                  ><i class="fa-solid fa-chevron-right"></i
                ></SgButton>
              </div>
            </div>

            <div>
              <h3>Character</h3>
              <div class="gamemode-select">
                <SgButton @click="prevChar" class="select-btn"
                  ><i class="fa-solid fa-chevron-left"></i
                ></SgButton>
                <div class="gamemodes">
                  <div>
                    <p>{{ charStore.selectedCharacter.name }}</p>
                  </div>
                </div>
                <SgButton @click="nextChar" class="select-btn"
                  ><i class="fa-solid fa-chevron-right"></i
                ></SgButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="controls">
        <SgSoundRange class="sound-range" v-model:modelValue="volume"></SgSoundRange>
        <SgButton v-if="creator" @click="startGame">Start game</SgButton>
        <SgButton @click="leaveGame">Leave game</SgButton>
      </div>
    </div>
    <div class="chatroom">
      <div class="chat-container">
        <div class="chat">
          <p v-for="(message, index) in messages" :key="index">
            {{ message.playerName }}: {{ message.message }}
          </p>
        </div>
      </div>
      <form class="chat-form" @submit.prevent="sendMessage">
        <div class="form-div">
          <label for="chat">Send chat message</label>
          <input type="text" id="chat" v-model="chatMessage" />
        </div>
        <SgButton type="submit">Send chat</SgButton>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.create-room {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}

.create {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  width: 80%;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 10px;
  color: var(--default-text-dark);
  background-color: var(--bg2-dark);

  .settings {
    display: flex;
    flex-flow: column;
    gap: 1rem;

    .bg-gray {
      padding: 1rem;
      border-radius: 10px;
      background-color: var(--dark-gray);
    }

    .players {
      display: flex;
      flex-flow: column;
    }

    .options {
      .game-options {
        display: flex;
        flex-flow: column;
        gap: 1rem;
        margin: 1em 0em;
      }

      .gamemode-select,
      .map-select {
        display: flex;
        flex-flow: row;
        align-items: center;
        margin-top: 1rem;
        justify-content: space-between;

        .gamemodes,
        .maps {
          flex: 5;
          width: 100%;
          text-align: center;

          img {
            height: 10em;
            width: 100%;
            object-fit: contain;
          }
        }

        .select-btn {
          flex: 1;
        }
      }
    }
  }

  .sound-range {
    width: 60%;
  }

  .controls {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }
}

.chatroom {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  width: 80%;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 10px;
  color: var(--default-text-dark);
  background-color: var(--bg2-dark);

  .chat-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--dark-gray);
    min-height: 5rem;
    max-height: 15rem;
    border-radius: 10px;

    .chat {
      padding: 0.5rem;
      width: 100%;
      max-width: max-content;
    }
  }

  .chat-form {
    display: flex;
    flex-flow: column;
    gap: 1rem;

    .form-div {
      display: flex;
      flex-flow: column;

      input[type='text'] {
        padding: 0.5rem;
        border-radius: 10px;
        border: none;
      }
    }
  }
}

/* BREAKPOINTS */
@media (width >=65em) {
  .create-room {
    display: flex;
    flex-flow: row;
    gap: 2rem;
    width: 90%;
    margin: auto;
  }

  .create {
    margin: 2rem auto;

    .settings {
      flex-flow: row;

      .bg-gray {
        flex: 1;
        width: 100%;
      }

      .players {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
      }
    }

    .sound-range {
      width: 30%;
    }
  }

  .chatroom {
    display: flex;
    flex-flow: column;
    max-width: 15rem;
    margin: 2rem auto;
    justify-content: space-between;

    .chat-container {
      height: 100%;
      max-height: 100%;
    }
  }
}
</style>
