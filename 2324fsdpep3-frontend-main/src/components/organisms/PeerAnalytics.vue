<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useScoreStore } from '@/stores/scores'
import type { User } from '@/types'
import { defineProps, onMounted, ref } from 'vue'
import PeerChart from '@/components/molecules/PeerChart.vue'

const scoreStore = useScoreStore()

// Receive user via props
const { user } = defineProps<{
  user: User | null
}>()

const result = ref<any | null>(null)
const error = ref<string | null>(null)

const fetchScores = async () => {
  try {
    result.value = await scoreStore.getScoresForAnalytics({ user_id: user?.id || 0 })
  } catch (e) {
    error.value = 'Error fetching scores'
  }
}

// Fetch data on mount
onMounted(() => {
  fetchScores()
})
</script>

<template>
  <div v-if="user">
    <h2>User Analytics for {{ user.firstname }}</h2>
    <div v-if="error">{{ error }}</div>
    <div v-if="result && Object.keys(result.scores).length === 0">No scores yet</div>
    <div v-else-if="result">
      <div v-for="(scores, category) in result.scores" :key="category" class="chart-container">
        <h3>{{ category }}</h3>
        <PeerChart :scores="scores" :category="category.toString()" />
      </div>
    </div>
    <div v-else>Loading scores...</div>
  </div>
</template>

<style scoped lang="scss">
.chart-container {
  margin-bottom: 2rem;
}
</style>
