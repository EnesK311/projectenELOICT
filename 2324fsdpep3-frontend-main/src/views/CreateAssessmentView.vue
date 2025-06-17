<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Step1CreateAssessment from '@/components/organisms/Step1CreateAssessment.vue'
import Step2AddRubrics from '@/components/organisms/Step2AddRubrics.vue'
import Step3AssignToStudentGroup from '@/components/organisms/Step3RubricsWeight.vue'
import Step4AssignAssessment from '@/components/organisms/Step4AssignAssessment.vue'
import { useAssesmentStore } from '@/stores/assessment'
import { useRubricStore } from '@/stores/rubric'
import { useOPOStore } from '@/stores/opo'
import type { Assessment, Rubric, StudentGroup } from '@/types'
import { storeToRefs } from 'pinia'
import { useStudentGroupStore } from '@/stores/studentgroups'
import { useTitle } from '@vueuse/core'
import { onMounted } from 'vue'

const title = useTitle()
title.value = 'Add Assessment | Peer'

const currentStep = ref(1)

const nextStep = () => {
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const { assessment } = storeToRefs(useAssesmentStore())
const { rubrics } = storeToRefs(useRubricStore())
const { pickedRubrics } = storeToRefs(useRubricStore())
const { rubricWeights } = storeToRefs(useRubricStore())
const { opos } = storeToRefs(useOPOStore())
const { selectedOpo } = storeToRefs(useOPOStore())
const { opo } = storeToRefs(useOPOStore())

const submit = () => {}
</script>

<template>
  <div v-if="currentStep === 1">
    <Step1CreateAssessment @next="nextStep" :opos="opos" />
  </div>
  <div v-if="currentStep === 2">
    <Step2AddRubrics :rubrics="rubrics" @next="nextStep" @prev="prevStep" />
  </div>
  <div v-if="currentStep === 3">
    <Step3AssignToStudentGroup @next="nextStep" @prev="prevStep" @submit="submit" />
  </div>
  <div v-if="currentStep === 4">
    <Step4AssignAssessment @prev="prevStep" />
  </div>
</template>

<style scoped lang="scss">
/* Add your styles here */
</style>
