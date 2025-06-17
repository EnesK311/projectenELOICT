import { ref } from 'vue'

export const useLoading = () => {
  const isLoading = ref<boolean>(false)

  const startLoading = () => (isLoading.value = true)
  const stopLoading = () => (isLoading.value = false)

  return { startLoading, stopLoading, isLoading }
}
