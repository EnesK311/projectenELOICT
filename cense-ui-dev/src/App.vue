<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import useAuthStore from '@/stores/auth'
import FHeader from './components/molucules/FHeader.vue'
import FFooter from './components/molucules/FFooter.vue'
import AccessibilityButton from './components/molucules/AccessibilityButton.vue'

const route = useRoute()
const authStore = useAuthStore()

if (authStore.isAuthenticated) {
  authStore.getMeInfo()
}

const showHeader = computed(() => {
  return route.matched.some(record => record.meta.showHeader)
})

const showFooter = computed(() => {
  return route.matched.some(record => record.meta.showFooter)
})
</script>

<template>
  <FHeader v-if="showHeader" />
  <RouterView />
  <AccessibilityButton />
  <FFooter v-if="showFooter" />
</template>

<style scoped></style>
