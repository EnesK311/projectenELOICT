import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Map, GameMode, ApiResponse } from '@/types/'
import { getGamemodes } from '@/services/dataService'

export const useGamemodesStore = defineStore('gamemodes', () => {
    const modes = ref<GameMode[]>([])
    const selectedMode = ref<GameMode>()

    const loadModes = () => {
        getGamemodes<ApiResponse>().then((response) => {
          const loadedMaps: Map[] = response.data.data.map((record: any) => {
            return {
              id: record.id,
              name: record.name,
              image: import.meta.env.VITE_BASE_URL + record.image
            }
          })
          modes.value?.push(...loadedMaps)
          selectedMode.value = modes.value[0]
        })
        .catch((error) => console.error(error))
      }

    return { selectedMode, modes, loadModes }
})