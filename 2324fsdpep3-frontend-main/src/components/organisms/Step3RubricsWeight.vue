<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { useRubricStore } from '@/stores/rubric'
import { useRubricAssesmentStore } from '@/stores/rubricassessment'
import { storeToRefs } from 'pinia'
import PeerButton from '../atoms/PeerButton.vue'
import PeerSlider from '../atoms/PeerSlider.vue'
import PeerH2 from '../atoms/PeerH2.vue'
import PeerError from '../atoms/PeerError.vue'

const emit = defineEmits(['next', 'prev'])

const { pickedRubrics: selectedData, rubricWeights } = storeToRefs(useRubricStore())

selectedData.value.forEach((rubric) => {
  if (!rubricWeights.value[rubric.id]) {
    rubricWeights.value[rubric.id] = 0
  }
})

const totalWeight = computed(() => {
  return Object.values(rubricWeights.value).reduce((acc, weight) => acc + weight, 0)
})

const errorMessage = ref<string>('')

// Function to handle weight change
const handleWeightChange = (rubricId: number, newWeight: number) => {
  const currentTotal = totalWeight.value - rubricWeights.value[rubricId]
  const maxAllowableWeight = 100 - currentTotal
  if (newWeight <= maxAllowableWeight) {
    rubricWeights.value[rubricId] = newWeight
  } else {
    rubricWeights.value[rubricId] = maxAllowableWeight
  }
}

const rubricAssessmentStore = useRubricAssesmentStore()

const handleSubmit = async () => {
  if (totalWeight.value !== 100) {
    errorMessage.value = 'The total weight must be exactly 100% before proceeding.'
    return
  }
  try {
    await rubricAssessmentStore.createRubricAssessment()
    emit('next')
  } catch (error) {
    console.error('Failed to submit rubric assessments:', error)
  }
}
</script>

<template>
  <div class="wrapper">
    <PeerH2>Step 3: How much does each rubric have to weigh in the end score?</PeerH2>
    <p>Total should be: 100</p>
    <p>Total Weight: {{ totalWeight }}</p>
    <PeerError v-if="errorMessage">{{ errorMessage }}</PeerError>
    <div>
      <div v-for="rubric in selectedData" :key="rubric.id">
        <!-- Use the PeerSlider atom directly -->
        <PeerSlider
          :label="rubric.name"
          :value="rubricWeights[rubric.id]"
          @update:value="(newValue) => handleWeightChange(rubric.id, newValue)"
        />
      </div>
    </div>

    <PeerButton type="button" @click="$emit('prev')">Previous</PeerButton>
    <PeerButton type="button" @click="handleSubmit">Next</PeerButton>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  max-width: 30rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
