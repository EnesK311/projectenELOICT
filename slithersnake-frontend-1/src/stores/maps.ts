import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Room, Map, GameMode, Player, ApiResponse } from '@/types/'
import { getMaps } from '@/services/dataService'

export const useMapsStore = defineStore('maps', () => {
  const maps = ref<Map[]>([])
  const selectedMap = ref<Map>()

  const loadMaps = () => {
    getMaps<ApiResponse>().then((response) => {
      const loadedMaps: Map[] = response.data.data.map((record: any) => {
        return {
          id: record.id,
          name: record.name,
          image: import.meta.env.VITE_BASE_URL + record.image,
        }
      })
      maps.value?.push(...loadedMaps)
      selectedMap.value = maps.value[0]
    })
    .catch((error) => console.error(error))
  }

  return { selectedMap, maps, loadMaps }
})