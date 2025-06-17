<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import PeerTeacherAssessment from '@/components/organisms/PeerTeacherAssessment.vue'
import PeerStudentAssessment from '@/components/organisms/PeerStudentAssessment.vue'
import PeerStudentAssessmentResults from '@/components/organisms/PeerStudentAssessmentResults.vue'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { ref } from 'vue'
import { useAssesmentStore } from '@/stores/assessment'
import type { Assessment } from '@/types'
import { onMounted } from 'vue'

const loading = ref(false)
const error = ref<string | null>(null)
const id = ref<number | null>(null)

const route = useRoute()
//get id from route
id.value = Number(route.params.id)

const assessmentStore = useAssesmentStore()
const { user } = storeToRefs(useAuthStore())
const { assessments } = storeToRefs(assessmentStore)

const assessment = ref<Assessment | null>(null)
// Set the assessment data from the store
const setAssessmentData = () => {
  if (assessments.value.length > 0) {
    const foundAssessment = assessments.value.find((assessment) => assessment.id === id.value)
    if (foundAssessment) {
      assessment.value = foundAssessment
    }
  } else {
    //niet efficient om alles op te halen haal alleen de gene op die nodig is
    assessmentStore.getAssessments().then(() => {
      const foundAssessment = assessmentStore.assessments.find(
        (assessment) => assessment.id === id.value
      )
      if (foundAssessment) {
        assessment.value = foundAssessment
      }
    })
  }
}

const title = useTitle()

// Set the page title based on the assessment title once it is set
watch(assessment, (newValue) => {
  if (newValue) {
    title.value = newValue.title + ' | Peer'
  }
})

onMounted(() => {
  setAssessmentData()
})
</script>

<template>
  <div>
    <h2>{{ assessment?.title }}</h2>
    <p>{{ assessment?.description }}</p>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-if="user && (user.role === 'admin' || user.role === 'teacher') && assessment">
      <PeerTeacherAssessment :assessment="assessment" :id="id" />
    </div>

    <div v-else-if="user && user.role === 'student' && assessment">
      <!-- ALS RESULTS NOG NIET VISIBLE ZIJN-->
      <PeerStudentAssessment v-if="assessment.is_result_visible === 0" :assessment="assessment" />
      <!-- ALS RESULTS WEL VISIBLE ZIJN -->
      <PeerStudentAssessmentResults
        v-if="assessment.is_result_visible === 1"
        :assessment="assessment"
      ></PeerStudentAssessmentResults>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Add your styles here */
</style>
