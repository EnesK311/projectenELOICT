import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { useOPOStore } from '@/stores/opo'
import {
  getOPO,
  postOPO,
  postOPOFile,
  getAllStudentsAndGroupsOPO,
  associateStudentOPO
} from '@/services/dataService'

// Mocking the dataService module
vi.mock('@/services/dataService', () => ({
  getOPO: vi.fn(),
  postOPO: vi.fn(),
  postOPOFile: vi.fn(),
  getAllStudentsAndGroupsOPO: vi.fn(),
  associateStudentOPO: vi.fn()
}))

describe('useOPOStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetches OPOs successfully', async () => {
    const mockOPOs = [
      { id: 1, name: 'OPO 1' },
      { id: 2, name: 'OPO 2' }
    ]
    ;(getOPO as Mock).mockResolvedValueOnce({ data: mockOPOs })

    const store = useOPOStore()
    const result = await store.fetchOPOs()

    expect(result).toBe(true)
    expect(store.opos).toEqual(mockOPOs)
  })

  it('handles fetchOPOs error', async () => {
    ;(getOPO as Mock).mockRejectedValueOnce(new Error('Failed to fetch OPOs'))

    const store = useOPOStore()

    await expect(store.fetchOPOs()).rejects.toThrow('Failed to fetch OPOs')
    expect(store.opos).toEqual([]) // Ensure the state remains unchanged
  })

  it('handles createOPO error', async () => {
    const mockOPO = { id: 1, name: 'New OPO' }
    const mockFile = new File(['file content'], 'test.csv', { type: 'text/csv' })

    ;(postOPO as Mock).mockRejectedValueOnce(new Error('Failed to create OPO'))

    const store = useOPOStore()

    await expect(store.createOPO(mockOPO, mockFile)).rejects.toThrow('Failed to create OPO')
    expect(store.opos).not.toContain(mockOPO)
  })

  it('fetches students and groups for a specific OPO', async () => {
    const mockData = { students: [], groups: [] }
    ;(getAllStudentsAndGroupsOPO as Mock).mockResolvedValueOnce({ data: mockData })

    const store = useOPOStore()
    const result = await store.fetchStudentsAndGroups(1)

    expect(result).toBe(true)
    expect(store.studentsAndGroups).toEqual(mockData)
  })

  it('handles fetchStudentsAndGroups error', async () => {
    ;(getAllStudentsAndGroupsOPO as Mock).mockRejectedValueOnce(
      new Error('Failed to fetch students and groups')
    )

    const store = useOPOStore()

    await expect(store.fetchStudentsAndGroups(1)).rejects.toThrow(
      'Failed to fetch students and groups'
    )
    expect(store.studentsAndGroups).toBeNull() // Ensure the state remains unchanged
  })

  it('associates a student with an OPO', async () => {
    ;(associateStudentOPO as Mock).mockResolvedValueOnce({
      data: 'Student associated successfully'
    })

    const store = useOPOStore()
    const result = await store.addStudentToOPO(1, 1)

    expect(result).toBe(true)
  })

  it('handles addStudentToOPO error', async () => {
    ;(associateStudentOPO as Mock).mockRejectedValueOnce(new Error('Failed to associate student'))

    const store = useOPOStore()

    await expect(store.addStudentToOPO(1, 1)).rejects.toThrow('Failed to associate student')
  })
})
