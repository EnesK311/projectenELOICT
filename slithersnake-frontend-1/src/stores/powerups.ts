import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePowerUpStore = defineStore('powerUp', () => {
    const speedBoost = () => {
        console.log("speed boost")
    }

    return {speedBoost}
})