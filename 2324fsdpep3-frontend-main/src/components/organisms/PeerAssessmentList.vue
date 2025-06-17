<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAssesmentStore } from '@/stores/assessment'
import PeerAssessment from '@/components/molecules/PeerAssessment.vue'
import { storeToRefs } from 'pinia'
import type { AssessmentDash } from '@/types'
import { useAuthStore } from '@/stores/auth'

const assessmentStore = useAssesmentStore()

//const assessments = computed(() => assessmentStore.assessments)
const { assessments } = storeToRefs(useAssesmentStore())

const hasAssessments = computed(() => assessments.value.length > 0)
</script>
<template>
  <div class="peer-assessment-list">
    <template v-if="hasAssessments">
      <PeerAssessment
        v-for="assessment in assessments"
        :key="assessment.id"
        :assessment="assessment"
      />
    </template>
    <template v-else>
      <div class="no-assessments-message">Lucky you! You don't have any assessments yet.</div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.peer-assessment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
