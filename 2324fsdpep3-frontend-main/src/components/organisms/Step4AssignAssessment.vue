<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { useScoreStore } from '@/stores/scores'
import { useOPOStore } from '@/stores/opo'
import { useAssesmentStore } from '@/stores/assessment'

// Get selected assessment id

const scoreStore = useScoreStore()
const { selectedOpo } = storeToRefs(useOPOStore())

const { createdAssessment } = storeToRefs(useAssesmentStore())

const errors = ref<string[]>([])
// Define emits
const emit = defineEmits(['next', 'prev'])

// Create scores here and redirect when it's succeeded
async function scoresCreation() {
  try {
    // Sending only the assessment ID as expected by the backend
    //need to store assessment id that was created and use it here
    const response = await scoreStore.createScores({ assessment_id: createdAssessment.value })
    console.log(response.status)
    if (response.status === 201) {
      router.push('/opos/' + selectedOpo.value.id)
    } else {
      errors.value.push('Failed to create scores')
    }
  } catch (error) {
    errors.value.push('An error occurred while creating scores')
  }
}

// Redirect to OPO page after loading this in
onMounted(() => {
  scoresCreation()
})
</script>

<template>
  <div>
    <h2>Successfully added assessment, Redirecting to OPO page.</h2>
    <div v-if="errors.length">
      <p v-for="error in errors" :key="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error {
  color: red;
}
</style>
