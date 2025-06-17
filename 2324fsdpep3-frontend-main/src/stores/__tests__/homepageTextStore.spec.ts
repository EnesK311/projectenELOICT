import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHomepageTextStore } from '@/stores/homepage'
import { getHomepageTexts, updateHomepageText } from '@/services/dataService'

// Mock de dataService functies
vi.mock('@/services/dataService', () => ({
  getHomepageTexts: vi.fn(),
  updateHomepageText: vi.fn()
}))

describe('useHomepageTextStore', () => {
  let homepageTextStore: ReturnType<typeof useHomepageTextStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    homepageTextStore = useHomepageTextStore()
  })

  it('should initialize with the correct default values', () => {
    expect(homepageTextStore.homepageTexts).toEqual([])
    expect(homepageTextStore.homepageData).toEqual({
      heroTitle: '',
      heroSubtitle: '',
      features: [
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' }
      ]
    })
    expect(homepageTextStore.loading).toBe(true)
    expect(homepageTextStore.dataLoaded).toBe(false)
  })

  it('should fetch homepage texts and update state', async () => {
    const mockTexts = [
      { id: 1, content: 'Hero Title', section: 'hero_title' },
      { id: 2, content: 'Hero Subtitle', section: 'hero_subtitle' },
      { id: 3, content: 'Feature 1 Title', section: 'feature_1_title' },
      { id: 4, content: 'Feature 1 Description', section: 'feature_1_description' },
      { id: 5, content: 'Feature 2 Title', section: 'feature_2_title' },
      { id: 6, content: 'Feature 2 Description', section: 'feature_2_description' },
      { id: 7, content: 'Feature 3 Title', section: 'feature_3_title' },
      { id: 8, content: 'Feature 3 Description', section: 'feature_3_description' }
    ]

    ;(getHomepageTexts as Mock).mockResolvedValueOnce({ data: mockTexts })

    await homepageTextStore.fetchHomepageTexts()

    expect(getHomepageTexts).toHaveBeenCalled()
    expect(homepageTextStore.homepageTexts).toEqual(mockTexts)
    expect(homepageTextStore.homepageData).toEqual({
      heroTitle: 'Hero Title',
      heroSubtitle: 'Hero Subtitle',
      features: [
        { title: 'Feature 1 Title', description: 'Feature 1 Description' },
        { title: 'Feature 2 Title', description: 'Feature 2 Description' },
        { title: 'Feature 3 Title', description: 'Feature 3 Description' }
      ]
    })
    expect(homepageTextStore.dataLoaded).toBe(true)
    expect(homepageTextStore.loading).toBe(false)
  })

  it('should handle error when fetching homepage texts', async () => {
    ;(getHomepageTexts as Mock).mockRejectedValueOnce(new Error('Failed to fetch homepage texts'))

    await expect(homepageTextStore.fetchHomepageTexts()).rejects.toThrow(
      'Failed to fetch homepage texts'
    )

    expect(homepageTextStore.homepageTexts).toEqual([])
    expect(homepageTextStore.dataLoaded).toBe(false)
    expect(homepageTextStore.loading).toBe(false)
  })

  it('should update a specific homepage text', async () => {
    const mockTexts = [{ id: 1, content: 'Hero Title', section: 'hero_title' }]
    homepageTextStore.homepageTexts = mockTexts
    ;(updateHomepageText as Mock).mockResolvedValueOnce({})

    await homepageTextStore.updateText(1, 'Updated Hero Title')

    expect(updateHomepageText).toHaveBeenCalledWith(1, { content: 'Updated Hero Title' })
    expect(homepageTextStore.homepageTexts[0].content).toBe('Updated Hero Title')
    expect(homepageTextStore.homepageData.heroTitle).toBe('Updated Hero Title')
  })

  it('should handle error when updating homepage text', async () => {
    ;(updateHomepageText as Mock).mockRejectedValueOnce(new Error('Failed to update homepage text'))

    await expect(homepageTextStore.updateText(1, 'Updated Hero Title')).rejects.toThrow(
      'Failed to update homepage text'
    )
  })
})
