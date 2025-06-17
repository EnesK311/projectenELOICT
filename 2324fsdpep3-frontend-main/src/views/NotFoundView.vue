<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import type { User } from '@/types'
import PeerAnalytics from '@/components/organisms/PeerAnalytics.vue'
import { useTitle } from '@vueuse/core'
import { RouterLink } from 'vue-router'
import PeerButton from '@/components/atoms/PeerButton.vue'

const title = useTitle()
title.value = 'NotFound | Peer'

const { user } = storeToRefs(useAuthStore())
</script>

<template>
  <main class="not-found-page">
    <div class="not-found-content">
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <RouterLink to="/">
        <PeerButton class="return-home-button">Go Back Home</PeerButton>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped lang="scss">
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.not-found-content {
  text-align: center;
  background: linear-gradient(120deg, #6e45e2, #88d3ce);
  padding: 3rem;
  border-radius: 10px;
}

.not-found-content h1 {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.not-found-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.not-found-content a {
  text-decoration: none;
}
</style>
