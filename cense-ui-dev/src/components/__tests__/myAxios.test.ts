import { describe, it, expect, beforeEach } from 'vitest'
import { myAxios } from '@/instances/myAxios'

describe('myAxios', () => {
  beforeEach(() => {
    // Reset the environment variable before each test
    delete process.env.VITE_BASE_URL
  })

  it('should set withCredentials to true', () => {
    expect(myAxios.defaults.withCredentials).toBe(true)
  })
})
