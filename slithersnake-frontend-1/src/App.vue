<script setup lang="ts">
import { onMounted } from 'vue'
import SgHeader from './components/molecules/SgHeader.vue'
import { useSettingsStore } from './stores/settings'
import { provide } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useMapsStore } from './stores/maps'
import { useGamemodesStore } from './stores/gamemodes'
import { useSkinsStore } from './stores/skins'
import { useDark } from '@vueuse/core'
import { storeToRefs } from 'pinia'

/* Use stores */
const settingsStore = useSettingsStore()
const mapsStore = useMapsStore()
const modesStore = useGamemodesStore()
const skinStore = useSkinsStore()
skinStore.loadSkins()

// color mode
const { darkMode } = storeToRefs(settingsStore)
const isDark = useDark()
darkMode.value = isDark.value

onMounted(() => {
  settingsStore.loadData()
  modesStore.loadModes()
  mapsStore.loadMaps()
})

settingsStore.$subscribe(() => {
  settingsStore.saveData()
})

//online server
// const socket: Socket = io('https://slithersnake-server.onrender.com/')
//locale server
const socket: Socket = io(`${import.meta.env.VITE_SOCKET_URL}`)

socket.on('connect', () => {
  console.log('Connected to server')
})

if (socket) {
  provide('socket', socket)
}
</script>

<template>
  <header>
    <SgHeader></SgHeader>
  </header>

  <main>
    <RouterView />
  </main>

  <footer></footer>
</template>

<style scoped lang="scss">
main {
  flex: 1;
  position: relative;
  max-height: 90vh;
}
</style>
