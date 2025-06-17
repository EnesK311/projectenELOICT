<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScoreStore } from '@/stores/scores'
import type { Assessment, StudentResultsResponse, RubricResult } from '@/types'

const scoreError = ref<string | null>(null)
const loadingScores = ref(false)

const { scores } = storeToRefs(useScoreStore())

const props = defineProps<{
  assessment: Assessment
}>()

const scoreStore = useScoreStore()

onMounted(async () => {
  loadingScores.value = true
  try {
    await scoreStore.getCalculatedResults(props.assessment.id)
  } catch (error) {
    scoreError.value = (error as Error).message
  } finally {
    loadingScores.value = false
  }
})

//temporary fix for type issue
const rubricResults = computed<RubricResult[]>(
  () => (scores.value as unknown as StudentResultsResponse)?.rubric_results || []
)
const finalScore = computed<number | null>(
  () => (scores.value as unknown as StudentResultsResponse)?.final_score || null
)
</script>

<template>
  <div>
    <h2>Assessment Scores</h2>
    <div v-if="loadingScores">Loading scores...</div>
    <div v-else-if="scoreError">{{ scoreError }}</div>
    <div v-else>
      <ul>
        <li v-for="(rubric, index) in rubricResults" :key="index">
          <h3>{{ rubric.rubric }} (Weight: {{ rubric.weight }})</h3>
          <p>Average Score: {{ rubric.average_score }}</p>
          <p>Self-Assessment Score: {{ rubric.self_assessment_score }}</p>
          <p>Weighted Score: {{ rubric.weighted_score }}</p>
        </li>
      </ul>
      <div class="final-score">
        <strong>Total Final Score: {{ finalScore }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
ul {
  list-style-type: none;
  padding: 0;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
}

p {
  margin: 5px 0;
}

.final-score {
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.4rem;
  text-align: center;
}
</style>
