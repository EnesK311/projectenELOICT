import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type Speciality } from '@/types/type'
import { getAllSpecialities } from '@/services/specialities'

export const useSpecialityStore = defineStore('speciality', () => {
  const specialities = ref<Speciality[]>([])

  const getSpecialities = async () => {
    const res = await getAllSpecialities()
    specialities.value = res.data.data as Speciality[]
  }

  getSpecialities().catch(err => err)

  return { specialities }
})
