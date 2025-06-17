import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  createAllScores,
  getScoresTeachers,
  getScoresStudents,
  postScores,
  getAnalytics,
  getCalculated
} from '@/services/dataService'
import type {
  CreateScoresResponse,
  AllScores,
  ScoresR,
  TeacherResultsResponse,
  StudentResultsResponse,
  AssessmentResultsResponse,
  StudentResult,
  RubricResult
} from '@/types'

export const useScoreStore = defineStore('scores', () => {
  //for a teacher
  const scores = ref<StudentResult[]>([])

  const score = ref<StudentResultsResponse | null>(null)

  const createScores = async function (assessment: {
    assessment_id: number
  }): Promise<CreateScoresResponse> {
    try {
      const response = await createAllScores(assessment)
      return response as CreateScoresResponse // Assuming this contains the structure defined in CreateScoresResponse
    } catch (error) {
      console.error('Failed to fetch scores:', error)
      throw error
    }
  }

  const getScoresforTeachers = async function (assessment: {
    assessment_id: number
  }): Promise<AllScores> {
    try {
      const response = await getScoresTeachers(assessment)
      console.log('response ' + response)
      return response as AllScores
    } catch (error) {
      console.error('Failed to fetch scores:', error)
      throw error
    }
  }

  const getScoresForStudents = async function (
    assessment: { assessment_id: number },
    user: { user_id: number }
  ): Promise<ScoresR> {
    try {
      const response = await getScoresStudents(assessment, user)
      console.log('response', response)
      return response.data as ScoresR
    } catch (error) {
      console.error('Failed to fetch scores:', error)
      throw error
    }
  }

  //submitting scores
  const submitAllScores = async function (
    assessment: { assessment_id: number },
    scoresPayload: { id: number; score: number | null }[]
  ) {
    try {
      console.log('inside store to submit scores')
      const response = await postScores(assessment, scoresPayload)
      return response
    } catch (error) {
      console.error('Failed to submit scores:', error)
      throw error
    }
  }

  const updateScore = (studentName: string, rubricName: string, score: number) => {
    const student = scores.value.find((s) => s.student === studentName)
    if (student) {
      //idk how this got fixed
      const rubric = student.rubric_results.find((r) => r.rubric === rubricName) as RubricResult
      if (rubric) {
        rubric.score = score
      }
    }
  }

  const getScoresForAnalytics = async function (user: { user_id: number }): Promise<ScoresR> {
    try {
      const response = await getAnalytics(user)
      console.log('response', response)
      return response.data as ScoresR
    } catch (error) {
      console.error('Failed to fetch scores:', error)
      throw error
    }
  }

  const getCalculatedResults = async function (
    assessmentId: number
  ): Promise<AssessmentResultsResponse> {
    try {
      const response = await getCalculated(assessmentId)
      console.log('response', response)

      // Determine whether the response is for a teacher or a student
      if (Array.isArray(response.data)) {
        // If the response is an array, it’s for a teacher
        scores.value = response.data as TeacherResultsResponse
      } else {
        // Otherwise, it’s for a student
        score.value = response.data as StudentResultsResponse
      }

      return scores.value
    } catch (error) {
      console.error('Failed to fetch scores:', error)
      throw error
    }
  }

  return {
    scores,
    getCalculatedResults,
    getScoresForAnalytics,
    updateScore,
    submitAllScores,
    getScoresForStudents,
    getScoresforTeachers,
    createScores
  }
})
