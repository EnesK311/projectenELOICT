export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  role: 'student' | 'teacher' | 'admin'
}

export interface ReceiveUser {
  data: User
}

export interface RegisterPayload {
  firstname: string
  lastname: string
  email: string
  password: string
  passwordRepeat?: string
}

export interface OPO {
  id: number
  name: string
}

export interface Assessment {
  id: number
  title: string
  description: string
  teacher: { id: number; name: string }
  opo: OPO
  end_date: string
  is_result_visible: 1 | 0
  state: 'red' | 'orange' | 'green'
  created_at: string
  updated_at: string
}

export interface AssessmentSend {
  title: string
  description: string
  opo_id: number | null
  end_date: string
  notification_days: number
}

export interface AssessmentDash {
  id: number
  title: string
  description: string
  teacher: { id: number; name: string }
  opo: OPO
  end_date: string
  is_result_visible: boolean
  state: 'red' | 'orange' | 'green'
  created_at: string
  updated_at: string
}

export interface StudentGroup {
  id: number
  name: string
  students: User[]
  created_at: string
  updated_at: string
}

export interface StudentGroups {
  data: StudentGroup[]
}

export interface Rubric {
  id: number
  name: string
  is_fixed: boolean
}

export interface RubricAssessment {
  id: number
  rubric_id: number
  assessment_id: number
  weight: number
}

export interface Student {
  id: number
  firstname: string
  lastname: string
  email: string
}

export interface Scores {
  id: number
  student_id: number
  rubric_id: number
  assessment_id: number
  score: number
}

export interface CreateScoresResponse {
  status: number
  data: {
    message: string
  }
}

//trying something stupid is probably going to work
export interface assessment_id {
  id: number
}

export interface AllScores {
  data: Score[]
  status: number
  statusText: string
}

export interface Score {
  id: number
  assessment_id: number
  group_id: number
  group: string
  user: string
  rubric_name: string
  given_by_name: string
  score: number | null
}

export interface GroupedScores {
  [groupName: string]: Score[]
}

export type ScoresR = {
  [category: string]: {
    id: number
    user: string
    score: number | null
  }[]
}

export interface HomepageText {
  id: number
  section: string
  content: string
}

export interface CalculatedScore {
  totalscore: {
    assessment: number
    group: string
    user: string
    rubric_name: string
    calculatedscore: number | null
  }[]
  [rubric: string]: {
    assessment: number
    group: string
    user: string
    rubric_name: string
    calculatedscore: number | null
  }[]
}

export interface RubricResult {
  score: number
  rubric: string
  average_score: number | null
  self_assessment_score: number | null
  weight: number
  weighted_score: number
}

export interface StudentResult {
  student: string
  rubric_results: RubricResult[]
  final_score: number | null
}

export type AssessmentResultsResponse = TeacherResultsResponse | StudentResultsResponse

export type TeacherResultsResponse = StudentResult[]

export interface StudentResultsResponse {
  rubric_results: RubricResult[]
  final_score: number | null
}
