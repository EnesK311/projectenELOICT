import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getOPO,
  postOPO,
  getAllStudentsAndGroupsOPO,
  associateStudentOPO,
  postOPOFile
} from '@/services/dataService'
import type { OPO } from '@/types'

export const useOPOStore = defineStore('opos', () => {
  const opos = ref<OPO[]>([])
  //opo that could be pushed to the database so no id needed
  const opo = ref(<OPO>{
    name: ''
  })
  //opo that is selected so need to store what the name is to be able to show it on the end of the form
  const selectedOpo = ref<{ id: number }>({
    id: -1
  })

  const studentsAndGroups = ref()

  // Fetch OPOs
  const fetchOPOs = async function () {
    try {
      const { data } = await getOPO<OPO[]>()
      console.log(data)
      opos.value = data
      console.log(opos.value)
      return true
    } catch (err) {
      console.error('Failed to get OPOs:', err)
      throw err
    }
  }

  // Fetch OPO
  console.log('fethcing opos')

  // Create OPO
  // Create OPO
  const createOPO = async function (opo: OPO, file: File) {
    try {
      // Step 1: Create the OPO by sending its name and other details
      const response = await postOPO(opo)
      const createdOPO: OPO = response.data as OPO
      console.log('createdOPO:', createdOPO)
      opos.value.push(createdOPO)

      // Step 2: If the OPO was created successfully, send the file to the backend
      if (createdOPO && createdOPO.id) {
        console.log('Posting file...')

        const responseFile = await postOPOFile(createdOPO.id, file)
        console.log('File uploaded successfully:', responseFile.data)
      } else {
        throw new Error('Failed to retrieve created OPO ID')
      }

      return createdOPO
    } catch (error: any) {
      console.error('Failed to create OPO or upload file:', error)
      throw error // Rethrow the error to be handled further up the call chain
    }
  }

  const fetchStudentsAndGroups = async function (opoID: number) {
    try {
      studentsAndGroups.value = null
      const { data } = await getAllStudentsAndGroupsOPO(opoID)
      studentsAndGroups.value = data
      console.log(data)
      return true
    } catch (err) {
      console.error('Failed to get OPOs:', err)
      throw err
    }
  }

  const addStudentToOPO = async function (opoID: number, studentID: number) {
    try {
      const { data } = await associateStudentOPO(opoID, studentID)
      console.log(data)
      return true
    } catch (err) {
      console.error('Failed to get OPOs:', err)
      throw err
    }
  }

  return {
    opos,
    createOPO,
    fetchOPOs,
    opo,
    selectedOpo,
    fetchStudentsAndGroups,
    studentsAndGroups,
    addStudentToOPO
  }
})
