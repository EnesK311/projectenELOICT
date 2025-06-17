import { defineStore } from "pinia"
import { ref } from "vue"

export const useAccessibilityStore = defineStore("accessibility", () => {
  const isDarkMode = ref<boolean>(false)
  const isHighContrast = ref<boolean>(false)

  const setHighContrast = (value: boolean) => {
    isHighContrast.value = value
    isDarkMode.value = false
    applyTheme()
  }

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value
    isHighContrast.value = false
    applyTheme()
  }

  const applyTheme = () => {
    const root = document.documentElement

    if (isHighContrast.value) {
        root.style.setProperty("--black", "var(--hc-black)")
        root.style.setProperty("--white", "var(--hc-white)")
        root.style.setProperty("--bg", "var(--hc-bg)")
        root.style.setProperty("--text", "var(--hc-text)")
        root.style.setProperty("--gray", "var(--hc-gray)")

        root.style.setProperty("--dark-blue", "var(--hc-dark-blue)")
        root.style.setProperty("--dark-blue-5", "var(--hc-dark-blue-5)")
        root.style.setProperty("--dark-blue-05", "var(--hc-dark-blue-05)")
        root.style.setProperty("--dark-blue-25", "var(--hc-dark-blue-25)")
        root.style.setProperty("--dark-blue-7", "var(--hc-dark-blue-7)")

        root.style.setProperty("--blue", "var(--hc-blue)")
        root.style.setProperty("--blue-5", "var(--hc-blue-5)")
        root.style.setProperty("--blue-25", "var(--hc-blue-25)")

        root.style.setProperty("--light-blue", "var(--hc-light-blue)")
        root.style.setProperty("--light-blue-5", "var(--hc-light-blue-5)")
        root.style.setProperty("--light-blue-25", "var(--hc-light-blue-25)")

        root.style.setProperty("--green", "var(--hc-green)")
        root.style.setProperty("--green-5", "var(--hc-green-5)")
        root.style.setProperty("--green-25", "var(--hc-green-25)")
        root.style.setProperty("--green-7", "var(--hc-green-7)")

        root.style.setProperty("--red", "var(--hc-red)")
        root.style.setProperty("--red-4", "var(--hc-red-4)")
        root.style.setProperty("--red-5", "var(--hc-red-5)")
        root.style.setProperty("--red-7", "var(--hc-red-7)")

        root.style.setProperty("--yellow", "var(--hc-yellow)")
        root.style.setProperty("--yellow-25", "var(--hc-yellow-25)")

        root.style.setProperty("--label", "var(--hc-label)")
    } else if (isDarkMode.value) {
        root.style.setProperty("--black", "var(--dark-black)")
        root.style.setProperty("--white", "var(--dark-white)")
        root.style.setProperty("--bg", "var(--dark-bg)")
        root.style.setProperty("--text", "var(--dark-text)")
        root.style.setProperty("--gray", "var(--dark-gray)")

        root.style.setProperty("--dark-blue", "var(--dark-dark-blue)")
        root.style.setProperty("--dark-blue-5", "var(--dark-dark-blue-5)")
        root.style.setProperty("--dark-blue-05", "var(--dark-dark-blue-05)")
        root.style.setProperty("--dark-blue-25", "var(--dark-dark-blue-25)")
        root.style.setProperty("--dark-blue-7", "var(--dark-dark-blue-7)")

        root.style.setProperty("--blue", "var(--dark-blue)")
        root.style.setProperty("--blue-5", "var(--dark-blue-5)")
        root.style.setProperty("--blue-25", "var(--dark-blue-25)")

        root.style.setProperty("--light-blue", "var(--dark-light-blue)")
        root.style.setProperty("--light-blue-5", "var(--dark-light-blue-5)")
        root.style.setProperty("--light-blue-25", "var(--dark-light-blue-25)")

        root.style.setProperty("--green", "var(--dark-green)")
        root.style.setProperty("--green-5", "var(--dark-green-5)")
        root.style.setProperty("--green-25", "var(--dark-green-25)")
        root.style.setProperty("--green-7", "var(--dark-green-7)")

        root.style.setProperty("--red", "var(--dark-red)")
        root.style.setProperty("--red-4", "var(--dark-red-4)")
        root.style.setProperty("--red-5", "var(--dark-red-5)")
        root.style.setProperty("--red-7", "var(--dark-red-7)")

        root.style.setProperty("--yellow", "var(--dark-yellow)")
        root.style.setProperty("--yellow-25", "var(--dark-yellow-25)")

        root.style.setProperty("--label", "var(--dark-label)")
    } else {
        root.style.setProperty("--black", "var(--default-black)")
        root.style.setProperty("--white", "var(--default-white)")
        root.style.setProperty("--bg", "var(--default-bg)")
        root.style.setProperty("--text", "var(--default-text)")
        root.style.setProperty("--gray", "var(--default-gray)")

        root.style.setProperty("--dark-blue", "var(--default-dark-blue)")
        root.style.setProperty("--dark-blue-5", "var(--default-dark-blue-5)")
        root.style.setProperty("--dark-blue-05", "var(--default-dark-blue-05)")
        root.style.setProperty("--dark-blue-25", "var(--default-dark-blue-25)")
        root.style.setProperty("--dark-blue-7", "var(--default-dark-blue-7)")

        root.style.setProperty("--blue", "var(--default-blue)")
        root.style.setProperty("--blue-5", "var(--default-blue-5)")
        root.style.setProperty("--blue-25", "var(--default-blue-25)")

        root.style.setProperty("--light-blue", "var(--default-light-blue)")
        root.style.setProperty("--light-blue-5", "var(--default-light-blue-5)")
        root.style.setProperty("--light-blue-25", "var(--default-light-blue-25)")

        root.style.setProperty("--green", "var(--default-green)")
        root.style.setProperty("--green-5", "var(--default-green-5)")
        root.style.setProperty("--green-25", "var(--default-green-25)")
        root.style.setProperty("--green-7", "var(--default-green-7)")

        root.style.setProperty("--red", "var(--default-red)")
        root.style.setProperty("--red-4", "var(--default-red-4)")
        root.style.setProperty("--red-5", "var(--default-red-5)")
        root.style.setProperty("--red-7", "var(--default-red-7)")

        root.style.setProperty("--yellow", "var(--default-yellow)")
        root.style.setProperty("--yellow-25", "var(--default-yellow-25)")

        root.style.setProperty("--label", "var(--default-label)")
        
    }
  }

  return { setHighContrast, isHighContrast, setDarkMode, isDarkMode, applyTheme }
},{
    persist: true
})