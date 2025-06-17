<script setup lang="ts">
import { RouterView } from 'vue-router'
import PeerLoader from './components/atoms/PeerLoader.vue'
import PeerHeader from './components/molecules/PeerHeader.vue'

import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.checkingLogin" class="centered">
    <PeerLoader></PeerLoader>
  </div>
  <div v-if="!authStore.checkingLogin">
    <header>
      <PeerHeader> </PeerHeader>
    </header>

    <main>
      <RouterView></RouterView>
    </main>

    <footer>
      <p>© 2024 Enes Kahya</p>
    </footer>
  </div>
</template>

<style scope lang="scss">
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
