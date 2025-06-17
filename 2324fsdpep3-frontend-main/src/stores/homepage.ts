import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getHomepageTexts, updateHomepageText } from '@/services/dataService'
import type { HomepageText } from '@/types'

export const useHomepageTextStore = defineStore('homepageTexts', () => {
  const homepageTexts = ref<HomepageText[]>([])
  const homepageData = ref({
    heroTitle: '',
    heroSubtitle: '',
    features: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ]
  })

  const loading = ref<boolean>(true)
  const dataLoaded = ref(false)

  const fetchHomepageTexts = async () => {
    try {
      const { data } = await getHomepageTexts<HomepageText[]>()
      homepageTexts.value = data

      homepageData.value.heroTitle = data[0]?.content || ''
      homepageData.value.heroSubtitle = data[1]?.content || ''
      homepageData.value.features = [
        { title: data[2]?.content || '', description: data[3]?.content || '' },
        { title: data[4]?.content || '', description: data[5]?.content || '' },
        { title: data[6]?.content || '', description: data[7]?.content || '' }
      ]

      dataLoaded.value = true
    } catch (err) {
      console.error('Failed to get homepage texts: ', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateText = async (id: number, newContent: string) => {
    try {
      await updateHomepageText(id, { content: newContent })
      const updatedText = homepageTexts.value.find((text) => text.id === id)
      if (updatedText) {
        updatedText.content = newContent
        if (updatedText.section === 'hero_title') {
          homepageData.value.heroTitle = newContent
        } else if (updatedText.section === 'hero_subtitle') {
          homepageData.value.heroSubtitle = newContent
        } else {
          const featureIndex = parseInt(updatedText.section.split('_')[1]) - 1
          if (updatedText.section.endsWith('title')) {
            homepageData.value.features[featureIndex].title = newContent
          } else {
            homepageData.value.features[featureIndex].description = newContent
          }
        }
      }
    } catch (error) {
      console.error('Failed to update homepage text:', error)
      throw error
    }
  }

  return {
    homepageTexts,
    homepageData,
    fetchHomepageTexts,
    updateText,
    loading,
    dataLoaded
  }
})
