import type { Keybinds } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
    const keybinds = ref<Keybinds>({
        left: 'ArrowLeft',
        right: 'ArrowRight',
        up: 'ArrowUp',
        down: 'ArrowDown'
    })
    const volume = ref<number>(50)
    const darkMode = ref<boolean>(true)

    // keybinds actions
    const saveData = () => {
        localStorage.setItem('keybinds', JSON.stringify(keybinds))
        localStorage.setItem('volume', JSON.stringify(volume))
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
    }

    const loadData = () => {
        const savedKeybinds = localStorage.getItem('keybinds')
        if (savedKeybinds) {
            const parsedKeybinds = JSON.parse(savedKeybinds)
            keybinds.value = parsedKeybinds._value || {}
        }

        const savedVolume = localStorage.getItem('volume')
        if (savedVolume) {
            const parsedvolume = JSON.parse(savedVolume)
            volume.value = parsedvolume._value || {}
        }

        const savedColorMode = localStorage.getItem('darkMode')
        if (savedColorMode) {
            const parsedColorMode = JSON.parse(savedColorMode)
            darkMode.value = parsedColorMode._value || {}
        }
    }

    return { keybinds, volume, darkMode, saveData, loadData }
})