<script lang="ts" setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import type { Assessment, AssessmentDash } from '@/types'
import PeerButton from '../atoms/PeerButton.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authstore = useAuthStore()
const { isTeacher, isAdmin } = storeToRefs(useAuthStore())

const props = defineProps<{
  assessment: Assessment
}>()

const router = useRouter()

const navigateToAssessment = () => {
  router.push(`/assessment/${props.assessment.id}`)
}
</script>

<template>
  <div
    class="peer-assessment"
    :class="{
      'bg-green': assessment.state === 'green',
      'bg-orange': assessment.state === 'orange',
      'bg-red': assessment.state === 'red'
    }"
  >
    <h3>{{ assessment.title }}</h3>
    <p>{{ assessment.description }}</p>
    <div><strong>Due Date: </strong> {{ assessment.end_date }}</div>
    <div><strong>OPO: </strong> {{ assessment.opo.name }}</div>
    <div>Assigned by: {{ assessment.teacher.name }}</div>

    <PeerButton @click="navigateToAssessment" v-if="!isTeacher && !isAdmin">Fill in</PeerButton>
    <PeerButton @click="navigateToAssessment" v-else>See Results</PeerButton>
  </div>
</template>

<style scoped lang="scss">
.peer-assessment {
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
  transition: background-color 0.3s ease;

  &.bg-green {
    background-color: var(--color-card-green);
  }

  &.bg-orange {
    background-color: var(--color-accent-yellow);
  }

  &.bg-red {
    background-color: var(--color-card-brown);
  }
}
</style>
