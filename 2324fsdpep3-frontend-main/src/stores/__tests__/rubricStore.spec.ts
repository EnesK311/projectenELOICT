import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRubricStore } from '@/stores/rubric'
import { getRubrics, postRubric } from '@/services/dataService'
import type { Rubric } from '@/types'

// Mock de API-aanroepen
vi.mock('@/services/dataService', () => ({
  getRubrics: vi.fn(),
  postRubric: vi.fn()
}))

describe('rubricStore', () => {
  let rubricStore: ReturnType<typeof useRubricStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    rubricStore = useRubricStore()
  })

  it('should fetch rubrics correctly', async () => {
    // Mock de response van getRubrics
    const mockRubrics: Rubric[] = [
      { id: 1, name: 'Rubric 1', is_fixed: false },
      { id: 2, name: 'Rubric 2', is_fixed: true }
    ]
    ;(getRubrics as Mock).mockResolvedValueOnce({ data: mockRubrics })

    const result = await rubricStore.fetchRubrics()

    expect(result).toBe(true)
    expect(getRubrics).toHaveBeenCalled()
    expect(rubricStore.rubrics).toEqual(mockRubrics)
  })

  it('should create a new rubric correctly', async () => {
    // Mock de response van postRubric
    const newRubric: Rubric = { id: 3, name: 'New Rubric', is_fixed: false }
    ;(postRubric as Mock).mockResolvedValueOnce({ data: newRubric })

    const createdRubric = await rubricStore.createRubric(newRubric)

    expect(postRubric).toHaveBeenCalledWith(newRubric)
    expect(createdRubric).toEqual(newRubric)
    expect(rubricStore.rubrics).toContainEqual(newRubric)
  })

  it('should handle errors when creating a rubric', async () => {
    ;(postRubric as Mock).mockRejectedValueOnce(new Error('Failed to create rubric'))

    await expect(
      rubricStore.createRubric({ id: 0, name: 'Invalid Rubric', is_fixed: false })
    ).rejects.toThrow('Failed to create rubric')
    expect(rubricStore.rubrics).not.toContainEqual({
      id: 0,
      name: 'Invalid Rubric',
      is_fixed: false
    })
  })
})
