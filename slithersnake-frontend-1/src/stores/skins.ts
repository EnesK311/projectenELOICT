import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse, Skin } from '@/types/'
import { getSkins } from '@/services/dataService'

export const useSkinsStore = defineStore('skins', () => {
    const skins = ref<Skin[]>([])
    const selectedSkin = ref<Skin>({
      id: 1,
      name: 'Skin 1',
      imgHead: '',
      imgBody: ''
    })

    const loadSkins = () => {
      console.log('loading skins')
      getSkins<ApiResponse>().then((response) => {
        const loadedMaps: Skin[] = response.data.data.map((record: any) => {
          return {
            id: record.id,
            name: record.name,
            imgHead: import.meta.env.VITE_BASE_URL + record.image_head,
            imgBody: import.meta.env.VITE_BASE_URL + record.image_body,
          }
        })
        skins.value?.push(...loadedMaps)

        selectedSkin.value = skins.value[0]
      })
      .catch((error) => console.error(error))
    }

    return { skins, selectedSkin, loadSkins }
})