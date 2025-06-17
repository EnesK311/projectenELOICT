import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
  getAssessments as fetchAssessments,
  getAssessmentCSV,
  postAssessment
} from '@/services/dataService'
import type { Assessment, AssessmentDash, AssessmentSend } from '@/types'
import { useAuthStore } from './auth'
import { useOPOStore } from './opo'

export const useAssesmentStore = defineStore('assesment', () => {
  const assessments = ref<Assessment[]>([])
  //the assessment we fill in from the form will be stored here
  const { user } = storeToRefs(useAuthStore())
  const { selectedOpo } = storeToRefs(useOPOStore())
  const createdAssessment = ref<number>(-1)

  const assessment = ref(<Assessment>(<unknown>{
    id: -1,
    title: '',
    description: '',
    end_date: '',
    notification_days: 0,
    opo_id: selectedOpo.value?.id ?? -1,
    created_by: user.value?.id || -1,
    is_result_visible: false
  }))

  // get assessments from server
  const getAssessments = async function () {
    try {
      const response = await fetchAssessments<{ data: Assessment[] }>()
      const fetchedAssessments = response.data.data
      console.log('fetchedAssessments:', fetchedAssessments)
      assessments.value = fetchedAssessments
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
      throw error
    }
  }

  //fetch teacher Assessment
  const getTeacherAssessments = async function () {
    try {
      const response = await fetchAssessments<{ data: Assessment[] }>()
      const fetchedAssessments = response.data.data
      console.log('fetchedAssessments:', fetchedAssessments)
      assessments.value = fetchedAssessments
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
      throw error
    }
  }
  //fetch student assessment
  const getStudentAssessments = async function () {
    try {
      const response = await fetchAssessments<{ data: Assessment[] }>()
      const fetchedAssessments = response.data.data
      console.log('fetchedAssessments:', fetchedAssessments)
      assessments.value = fetchedAssessments
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
      throw error
    }
  }

  // create assessments
  const createAssessment = async (assessmentR: AssessmentSend) => {
    try {
      const response = await postAssessment<{ id: number }>(assessmentR)
      console.log('response:', response)
      createdAssessment.value = response.data.id
      console.log('createdAssessment:', createdAssessment)
      //old code might have to get rid
      //assessment.value.id = createdAssessment.id
      //assessments.value.push({ ...assessment.value, id: createdAssessment.id })
      return createdAssessment
    } catch (error) {
      console.error('Failed to create assessment:', error)
      throw error
    }
  }

  const getAssessmentFile = async (id: number | null) => {
    try {
      const response = await getAssessmentCSV(id)
      return response
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
      throw error
    }
  }

  console.log('calling assessments')
  getAssessments()

  return {
    assessments,
    getAssessments,
    createAssessment,
    assessment,
    getTeacherAssessments,
    getStudentAssessments,
    getAssessmentFile,
    createdAssessment
  }
})
