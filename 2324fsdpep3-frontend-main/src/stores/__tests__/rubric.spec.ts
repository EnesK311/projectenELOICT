import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { useRubricStore } from '@/stores/rubric'
import { getRubrics, postRubric } from '@/services/dataService'
import type { Rubric } from '@/types'

// Mocking the dataService functions
vi.mock('@/services/dataService', () => ({
  getRubrics: vi.fn(),
  postRubric: vi.fn()
}))

describe('useRubricStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('creates a rubric successfully', async () => {
    const mockRubric = { id: 3, name: 'New Rubric', is_fixed: false }

    ;(postRubric as Mock).mockResolvedValueOnce({ data: mockRubric })

    const store = useRubricStore()
    const result = await store.createRubric(mockRubric)

    expect(result).toEqual(mockRubric)
    expect(store.rubrics).toEqual(expect.arrayContaining([mockRubric]))
  })

  it('handles createRubric error', async () => {
    const mockRubric = { id: 3, name: 'New Rubric', is_fixed: false }

    ;(postRubric as Mock).mockRejectedValueOnce(new Error('Failed to create rubric'))

    const store = useRubricStore()

    await expect(store.createRubric(mockRubric)).rejects.toThrow('Failed to create rubric')
    expect(store.rubrics).not.toContainEqual(mockRubric) // Ensure the state is not updated
  })
})
