import type { AxiosResponse } from 'axios'
import { myAxios } from '../instances/myAxios'
import type { RegisterPayload, Rubric, OPO, RubricAssessment, AssessmentSend } from '@/types'

//add types later

// Users
const getCsrfCookie = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>('/sanctum/csrf-cookie', { baseURL: import.meta.env.VITE_BASE_URL })
}

const postLogin = async <T>(payload: {
  email: string
  password: string
}): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>(`api/login`, {
    email: payload.email,
    password: payload.password
  })
}

const postLogout = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>(`api/logout`)
}

const postRegister = async <T>(payload: RegisterPayload): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>(`api/register`, payload)
}

const getUser = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>(`api/user`)
}

//fetch all assesments
const getAssessments = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>(`api/assessments`)
}

const postAssessment = async <T>(assessment: AssessmentSend): Promise<AxiosResponse<T>> => {
  console.log('assessment trying to post: ' + assessment.title)
  return myAxios.post<T>('api/assessments', assessment)
}

const getStudentGroups = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>('api/student-groups')
}

const postStudentGroup = async <T>(studentGroup: string): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>('api/student-groups', JSON.stringify(studentGroup))
}
//get rubrics and post rubrics
const getRubrics = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>('api/rubrics')
}

const postRubric = async <T>(rubric: Rubric): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>('api/rubrics', rubric)
}

const getOPO = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>('api/opos')
}

const postOPO = async <T>(opo: OPO): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>('api/opos', opo)
}

//Sending the file after creating an opo, or an anlready created opo (later)
const postOPOFile = async <T>(opoid: number, file: File): Promise<AxiosResponse<T>> => {
  const formData = new FormData()

  // Append the opo ID and file to the form data
  formData.append('opo_id', opoid.toString()) // Convert number to string as FormData expects a string
  formData.append('file', file)

  // Make the POST request using FormData
  return myAxios.post<T>('api/opos/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const postRubricAssessment = async <T>(
  rubricAssessment: RubricAssessment
): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>('api/assessment-rubrics', rubricAssessment)
}

const getAllStudents = async <T>(): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>('api/students')
}

const getAllStudentsAndGroupsOPO = async <T>(opoId: number): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>(`api/opo/${opoId}`)
}

const associateStudentOPO = async <T>(
  opoId: number,
  studentId: number
): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>(`api/associate/${opoId}/${studentId}`)
}

//password reset logic
//CHANGE LAYOUT?
export const postPasswordResetLink = (payload: { email: string }) => {
  return myAxios.post('/api/password/email', payload)
}

export const postPasswordReset = (payload: {
  email: string
  token: string
  password: string
  password_confirmation: string
}) => {
  return myAxios.post('/api/password/reset', payload)
}

const createAllScores = async <T>(assessment: {
  assessment_id: number
}): Promise<AxiosResponse<T>> => {
  return myAxios.post<T>(`api/scores`, assessment)
}

const getScoresTeachers = async <T>(assessment: {
  assessment_id: number
}): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>(`api/scores/assessments/${assessment.assessment_id}`)
}

const getScoresStudents = async <T>(
  assessment: { assessment_id: number },
  user: { user_id: number }
): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>(`api/assessments/scores/${assessment.assessment_id}`, {
    params: {
      user_id: user.user_id
    }
  })
}

const postScores = async (
  assessment: { assessment_id: number },
  scores: { id: number; score: number | null }[]
) => {
  return await myAxios.post(`/api/assessments/${assessment.assessment_id}/submit-scores`, {
    scores
  })
}

const getAnalytics = async <T>(user: { user_id: number }): Promise<AxiosResponse<T>> => {
  return myAxios.get<T>(`api/scores/${user.user_id}`)
}

const postTeacher = async (payload: { firstname: string; lastname: string; email: string }) => {
  return myAxios.post('api/teachers', payload)
}

// Fetch all homepage texts
const getHomepageTexts = async <T>() => {
  return myAxios.get<T>('/api/homepage-texts')
}

// Update a specific homepage text
const updateHomepageText = async (id: number, payload: { content: string }) => {
  return myAxios.put(`/api/homepage-texts/${id}`, payload)
}

//get csv file from backend
const getAssessmentCSV = async (id: number | null) => {
  const response = await myAxios.get(`/api/assessments/${id}/csv`, {
    responseType: 'blob'
  })

  // Create a Blob from the response data
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  // Create a URL for the Blob and trigger the download
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `assessment_${id}.csv`) // Set the filename for download
  document.body.appendChild(link)
  link.click()

  // Clean up and remove the link
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

const getCalculated = async (assessmentid: number | null) => {
  return myAxios.get(`/api/assessments/${assessmentid}/calculated`)
}

export {
  getCsrfCookie,
  postLogin,
  postLogout,
  postRegister,
  getUser,
  getAssessments,
  postAssessment,
  postStudentGroup,
  getStudentGroups,
  getRubrics,
  postRubric,
  getOPO,
  postOPO,
  postRubricAssessment,
  getAllStudents,
  getAllStudentsAndGroupsOPO,
  associateStudentOPO,
  postOPOFile,
  createAllScores,
  getScoresTeachers,
  getScoresStudents,
  postScores,
  getAnalytics,
  postTeacher,
  getHomepageTexts,
  updateHomepageText,
  getAssessmentCSV,
  getCalculated
}
