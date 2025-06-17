import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getRubrics, postRubric } from '@/services/dataService'
import type { Rubric } from '@/types'

export const useRubricStore = defineStore('rubrics', () => {
  const rubrics = ref<Rubric[]>([])
  const pickedRubrics = ref<Rubric[]>([])
  const newRubric = ref<Rubric>({
    id: 0,
    name: '',
    is_fixed: false
  })

  const rubricWeights = ref<{ [key: string]: number }>({})
  //get rubrics

  async function fetchRubrics() {
    try {
      const response = await getRubrics<Rubric[]>()
      const data = response?.data // Use optional chaining
      if (data) {
        rubrics.value = data
        console.log(rubrics.value)
        return true
      } else {
        throw new Error('No data received from API')
      }
    } catch (err) {
      console.error('Failed to get rubrics: ', err)
      return false
    }
  }

  fetchRubrics()

  const createRubric = async function (rubric: Rubric) {
    try {
      const response = await postRubric(rubric)
      const createdRubric: Rubric = response.data as Rubric
      console.log('createdRubric:', createdRubric)
      rubrics.value.push(createdRubric)
      return createdRubric
    } catch (error) {
      console.error('Failed to create rubric:', error)
      throw error
    }
  }

  return { rubrics, createRubric, fetchRubrics, pickedRubrics, newRubric, rubricWeights }
})
