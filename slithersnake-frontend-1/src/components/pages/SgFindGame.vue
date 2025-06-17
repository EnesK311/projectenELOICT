<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import SgButton from '../atoms/SgButton.vue'
import type { Room } from '@/types/'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import { Socket } from 'socket.io-client'

const router = useRouter()

const socket: Socket = inject('socket') as Socket

const roomUrl = ref<string | null>(null)
const selectedRoom = ref<Room | null>(null)
let rooms = ref<Room[] | null>(null)
let ping = ref<number>(0)

const toggleSelectRoom = (room: Room) => {
  if (selectedRoom.value === room) {
    selectedRoom.value = null
  } else {
    selectedRoom.value = room
  }
}

function getRooms() {
  // emit only if the user is on this page
  if (router.currentRoute.value.path !== '/find-game') {
    return
  }
  socket.emit('getRooms')

  setTimeout(getRooms, 5000)
}

getRooms()

socket.on('rooms', (r: Room[]) => {
  console.log(r)
  rooms.value = r
})

socket.on('newRoom', (r: Room[]) => {
  rooms.value = r
})

function calculateRTT() {
  const startTime = Date.now()

  // Emit a ping event to the server
  socket.emit('ping')

  // Listen for the pong event from the server
  socket.once('pong', () => {
    const endTime = Date.now()
    const rtt = endTime - startTime

    // Display RTT
    ping.value = rtt

    // Schedule the next RTT calculation
    setTimeout(calculateRTT, 1000)
  })
}

// Start the RTT calculation
calculateRTT()

const joinRoom = () => {
  let roomId = null

  if (roomUrl.value !== null) {
    roomId = roomUrl.value.substring(roomUrl.value.indexOf('=') + 1)
  } else {
    roomId = selectedRoom.value?.id
  }

  if (roomId !== null) {
    router.push(`/create-room?id=${roomId}`)  
  }
}

function disabledBtn(): boolean {
  if (selectedRoom.value !== null || roomUrl.value !== null) {
    return false
  }

  return true
}

onBeforeUnmount(() => {
  socket.off('rooms')
  socket.off('newRoom')
  socket.off('ping')
  socket.off('pong')
  socket.off('getRooms')
})
</script>

<template>
  <section class="main-sec">
    <div class="table-container">
      <table class="room-table">
        <tr class="heading">
          <th class="id">Room id</th>
          <th class="name">Room name</th>
          <th>Map</th>
          <th>Mode</th>
          <th>Players</th>
          <th>Ping</th>
        </tr>
        <tr
          v-for="room in rooms"
          :key="room.id"
          :class="[{ selected: room === selectedRoom }, 'row']"
          @click="toggleSelectRoom(room)"
        >
          <td>{{ room.id }}</td>
          <td>{{ room.name }}</td>
          <td>{{ room.map.name }}</td>
          <td>{{ room.mode.name }}</td>
          <td>{{ room.players.length }}/4</td>
          <td>{{ ping }}</td>
        </tr>
        <tr v-if="rooms === null || rooms.length <= 0">
          <td colspan="6" class="not-found">No game rooms found!</td>
        </tr>
      </table>
    </div>
    <div class="join-custom">
      <form class="join-form">
        <div class="form-div">
          <label for="join">Join game</label>
          <input
            placeholder="Add game url..."
            type="text"
            id="join"
            name="join"
            class="input"
            v-model="roomUrl"
          />
        </div>
        <div class="form-button">
          <SgButton @click="joinRoom" :disabled="disabledBtn()">Join</SgButton>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.main-sec {
  margin: 2rem auto;
  width: 80%;

  .table-container {
    overflow-x: auto;
  }

  .room-table {
    width: 100%;
    min-width: max-content;
    border: 2px solid var(--default-text-dark);
    color: var(--default-text-dark);
    border-collapse: collapse;
    overflow-x: auto;

    .heading {
      background-color: var(--default-text-dark);
      color: var(--main-bg-dark);
      border-bottom: 2px solid var(--default-text-dark);

      th {
        height: 2rem;
      }
    }

    .not-found {
      text-align: center;
    }

    .selected {
      background-color: var(--accent);

      &:hover {
        cursor: pointer;
      }
    }

    .row {
      td {
        text-align: center;
        border-top: 2px solid var(--default-text-dark);
        height: 1.8rem;
        padding: 0 1rem;
      }

      &:not(.selected):hover {
        cursor: pointer;
        background-color: var(--dark-gray);
      }
    }
  }

  .button-div {
    display: flex;
    flex-flow: row;
    justify-content: end;

    .join-button {
      width: 20%;
      margin-top: 1rem;
    }
  }

  .input {
    padding: 5px;
    border-radius: 8px;
    border: 1.5px solid lightgrey;
    outline: none;
    //transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0px 0px 20px -18px;
  }

  /*.input:hover {
        border: 2px solid lightgrey;
        box-shadow: 0px 0px 20px -17px;
    }

    .input:active {
        transform: scale(0.95);
    }

    /*.input:focus {
        border: 2px solid grey;
    }*/

  .join-custom {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 1rem;

    .join-form {
      display: flex;
      flex-flow: column;
      align-items: stretch;
      gap: 0.5rem;
      width: 100%;

      .form-div {
        display: flex;
        flex-flow: column;
        color: var(--default-text-dark);
      }

      .form-button {
        button {
          padding: 0.5rem 2rem;
        }
      }
    }
  }
}

/* BREAKPOINTS */
@media (width >=65em) {
  .main-sec {
    .join-custom {
      .join-form {
        flex-flow: row;
        justify-content: end;
        align-items: end;
        gap: 1rem;
      }
    }
  }
}
</style>
