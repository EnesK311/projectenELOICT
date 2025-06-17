<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScoreStore } from '@/stores/scores'
import { useAuthStore } from '@/stores/auth'
import type { Assessment, ScoresR } from '@/types'
import PeerButton from '../atoms/PeerButton.vue'

const scoreError = ref<string | null>(null)
const loadingScores = ref(false)

const { user } = storeToRefs(useAuthStore())

const validationError = ref<string | null>(null)

const props = defineProps<{
  assessment: Assessment
}>()

const scoreStore = useScoreStore()

const rubrics = ref<ScoresR>({})

// Track the validation state of each rubric
const rubricValidationStates = ref<{ [key: string]: boolean }>({})

const fetchScores = async () => {
  loadingScores.value = true
  try {
    const result = await scoreStore.getScoresForStudents(
      { assessment_id: props.assessment.id },
      { user_id: user.value?.id || 0 }
    )

    //fix types
    rubrics.value = result

    Object.keys(rubrics.value).forEach((rubricName) => {
      rubricValidationStates.value[rubricName] = false
    })
  } catch (error) {
    scoreError.value = 'Error fetching scores'
  } finally {
    loadingScores.value = false
  }
}

const validateScores = () => {
  validationError.value = null

  const allValid = Object.values(rubricValidationStates.value).every((isValid) => isValid)
  if (!allValid) {
    validationError.value = 'Please ensure all rubrics are correctly scored.'
    return false
  }

  return true
}

const submitScores = async () => {
  if (!validateScores()) return

  // Prepare the payload with only the id and score for each rubric item
  const payload = Object.values(rubrics.value)
    .flat()
    .map((item) => ({
      id: item.id, // The ID of the score
      score: item.score // The score itself
    }))

  try {
    // Sending only the payload with id and score to the backend
    console.log('submitting scores')
    await scoreStore.submitAllScores({ assessment_id: props.assessment.id }, payload)
    alert('Scores submitted successfully!')
  } catch (error) {
    scoreError.value = 'Error submitting scores. Please try again.'
  }
}

const updateRubricScore = (rubricName: string, index: number, score: number) => {
  rubrics.value[rubricName][index].score = score
  checkTotalScore(rubricName)
}

const checkTotalScore = (rubricName: string) => {
  const totalScore = rubrics.value[rubricName].reduce((sum, item) => sum + (item.score ?? 0), 0)
  if (totalScore > 100) {
    validationError.value = `Total score for ${rubricName} cannot exceed 100. Please adjust the scores.`
    rubricValidationStates.value[rubricName] = false
  } else if (totalScore === 0) {
    validationError.value = `You need to give a score for ${rubricName}.`
    rubricValidationStates.value[rubricName] = false
  } else {
    validationError.value = null
    rubricValidationStates.value[rubricName] = true
  }
}

onMounted(() => {
  fetchScores()
})
</script>

<template>
  <div class="wrapper">
    <h2>Assessment Scores</h2>
    <div v-if="loadingScores">Loading scores...</div>
    <div v-else-if="scoreError">{{ scoreError }}</div>
    <div v-else>
      <div v-for="(rubric, rubricName) in rubrics" :key="rubricName">
        <h3>{{ rubricName }}</h3>
        <ul>
          <li v-for="(item, index) in rubric" :key="item.id">
            <p>User: {{ item.user }}</p>
            <input
              type="range"
              v-model.number="rubric[index].score"
              min="0"
              max="100"
              @input="updateRubricScore(String(rubricName), index, rubric[index].score || 0)"
            />
            <p>Score: {{ rubric[index].score }}</p>
          </li>
        </ul>
        <p>Total Score: {{ rubric.reduce((sum, item) => sum + (item.score ?? 0), 0) }}</p>
        <p
          v-if="rubric.reduce((sum, item) => sum + (item.score ?? 0), 0) > 100"
          style="color: red"
        ></p>
        Total score exceeds the allowed limit of 100!
      </div>

      <!-- Validation error message -->
      <p v-if="validationError" style="color: red">{{ validationError }}</p>

      <!-- Submit Button -->
      <PeerButton @click="submitScores">Submit all scores</PeerButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
li {
  margin-bottom: 20px;
}

input[type='range'] {
  width: 100%;
}
.wrapper {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
