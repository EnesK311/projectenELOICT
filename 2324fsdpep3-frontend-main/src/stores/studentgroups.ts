import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getStudentGroups, postStudentGroup } from '@/services/dataService'
import type { StudentGroup, StudentGroups } from '@/types'

export const useStudentGroupStore = defineStore('studentGroup', () => {
  const studentGroups = ref<StudentGroups>()
  //storing the studentgroup that would be created here
  const studentGroup = ref<StudentGroup>({
    id: 0,
    created_at: '',
    updated_at: '',
    name: '',
    students: []
  })

  const fetchedStudentGroups = async function () {
    try {
      const response = await getStudentGroups<{ data: StudentGroup[] }>()
      console.log(response.data)
      const fetchedStudentGroups = response.data
      console.log('fetchedStudentGroups:', fetchedStudentGroups)
      studentGroups.value = fetchedStudentGroups
    } catch (error) {
      console.error('Failed to fetch student groups:', error)
      throw error
    }
  }

  const createStudentGroup = async function (newStudentGroup: string) {
    try {
      const response = await postStudentGroup<{ data: StudentGroup }>(newStudentGroup)
      const createdStudentGroup = response.data.data
      console.log('createdStudentGroup:', createdStudentGroup)
    } catch (error) {
      console.error('Failed to create student group:', error)
      throw error
    }
  }

  console.log('calling student groups')
  getStudentGroups()

  return { studentGroups, createStudentGroup, studentGroup }
})
