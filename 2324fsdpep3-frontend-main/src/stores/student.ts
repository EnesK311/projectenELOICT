import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Student } from '@/types'
import { getAllStudents } from '@/services/dataService'

export const useStudentStore = defineStore('student', () => {
  const students = ref<Student[]>([])
  const pickedStudents = ref<Student[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchStudents = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await getAllStudents<{ data: Student[] }>()
      console.log(data)
      students.value = data.data
    } catch (err) {
      error.value = 'Failed to fetch students'
    } finally {
      isLoading.value = false
    }
  }

  return { students, isLoading, error, fetchStudents, pickedStudents }
})
