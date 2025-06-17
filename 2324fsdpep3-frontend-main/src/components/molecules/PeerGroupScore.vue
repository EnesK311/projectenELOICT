<script setup lang="ts">
import type { Score } from '@/types'

const props = defineProps<{
  scores: Score[]
}>()
</script>

<template>
  <div class="score-grid">
    <div v-for="score in props.scores" :key="score.id">
      <p>User: {{ score.user }}</p>
      <p>Given by: {{ score.given_by_name }}</p>
      <p>Rubric: {{ score.rubric_name }}</p>
      <p>Score: {{ score.score }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.score-card {
  padding: 1rem;
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.score-card h3 {
  margin: 0 0 10px;
}

.score-card p {
  margin: 5px 0;
}
</style>
