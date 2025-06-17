import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { postRubricAssessment } from '@/services/dataService'
import type { RubricAssessment } from '@/types'
import { useAssesmentStore } from './assessment'
import { useRubricStore } from './rubric'

export const useRubricAssesmentStore = defineStore('rubricassessment', () => {
  const rubricassessments = ref<RubricAssessment[]>([])

  const { assessment, createdAssessment } = storeToRefs(useAssesmentStore())
  const { pickedRubrics, rubricWeights } = storeToRefs(useRubricStore())

  // create assessments
  const createRubricAssessment = async () => {
    console.log('inside creating rubric assessment')
    try {
      pickedRubrics.value.forEach((rubric) => {
        const newRubricAssessment: RubricAssessment = {
          id: -1,
          assessment_id: createdAssessment.value,
          rubric_id: rubric.id,
          weight: rubricWeights.value[rubric.id]
        }
        postRubricAssessment(newRubricAssessment)
        rubricassessments.value.push(newRubricAssessment)
      })
    } catch (error) {
      console.error('Failed to create assessment:', error)
      throw error
    }
  }

  return { createRubricAssessment }
})
