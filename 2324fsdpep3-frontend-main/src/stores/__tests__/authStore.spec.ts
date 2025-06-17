import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  getUser,
  postLogin,
  postLogout,
  getCsrfCookie,
  postRegister,
  postPasswordResetLink,
  postPasswordReset,
  postTeacher
} from '@/services/dataService'

// Mocking the router to prevent actual navigation during tests
vi.mock('@/router', () => ({
  default: {
    push: vi.fn()
  }
}))

// Mocking the dataService functions
vi.mock('@/services/dataService', () => ({
  getUser: vi.fn(),
  postLogin: vi.fn(),
  postLogout: vi.fn(),
  getCsrfCookie: vi.fn(),
  postRegister: vi.fn(),
  postPasswordResetLink: vi.fn(),
  postPasswordReset: vi.fn(),
  postTeacher: vi.fn()
}))

describe('useAuthStore', () => {
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.spyOn(authStore, 'rehydrateAuth').mockImplementation(async () => {})
  })

  it('should handle login correctly', async () => {
    ;(getCsrfCookie as Mock).mockResolvedValueOnce({})
    ;(postLogin as Mock).mockResolvedValueOnce({})
    ;(getUser as Mock).mockResolvedValueOnce({
      data: { data: { id: 1, firstname: 'John', lastname: 'Doe', role: 'teacher' } }
    })

    await authStore.login({ email: 'test@example.com', password: 'password' })

    expect(getCsrfCookie).toHaveBeenCalled()
    expect(postLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    })
    expect(getUser).toHaveBeenCalled()
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.user?.firstname).toBe('John')
    expect(authStore.user?.lastname).toBe('Doe')
    expect(authStore.isTeacher).toBe(true)
  })

  it('should send a password reset link', async () => {
    const mockResponse = { data: { message: 'Reset link sent' } }
    ;(postPasswordResetLink as Mock).mockResolvedValueOnce(mockResponse)

    const result = await authStore.sendPasswordResetLink({ email: 'test@example.com' })

    expect(postPasswordResetLink).toHaveBeenCalledWith({ email: 'test@example.com' })
    expect(result).toEqual({ success: true, message: 'Reset link sent' })
  })

  it('should handle errors during password reset link sending', async () => {
    ;(postPasswordResetLink as Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to send reset link' } }
    })

    const result = await authStore.sendPasswordResetLink({ email: 'test@example.com' })

    expect(postPasswordResetLink).toHaveBeenCalledWith({ email: 'test@example.com' })
    expect(result).toEqual({ success: false, message: 'Failed to send reset link' })
  })

  it('should reset password successfully', async () => {
    const mockResponse = { data: { message: 'Password reset successfully' } }
    ;(postPasswordReset as Mock).mockResolvedValueOnce(mockResponse)

    const result = await authStore.resetPassword({
      email: 'test@example.com',
      token: 'valid-token',
      password: 'newpassword',
      password_confirmation: 'newpassword'
    })

    expect(postPasswordReset).toHaveBeenCalledWith({
      email: 'test@example.com',
      token: 'valid-token',
      password: 'newpassword',
      password_confirmation: 'newpassword'
    })
    expect(result).toEqual({ success: true, message: 'Password reset successfully' })
  })

  it('should handle errors during password reset', async () => {
    ;(postPasswordReset as Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to reset password' } }
    })

    const result = await authStore.resetPassword({
      email: 'test@example.com',
      token: 'valid-token',
      password: 'newpassword',
      password_confirmation: 'newpassword'
    })

    expect(postPasswordReset).toHaveBeenCalledWith({
      email: 'test@example.com',
      token: 'valid-token',
      password: 'newpassword',
      password_confirmation: 'newpassword'
    })
    expect(result).toEqual({ success: false, message: 'Failed to reset password' })
  })

  it('should create a teacher successfully', async () => {
    const mockResponse = { data: { message: 'Teacher created successfully' } }
    ;(postTeacher as Mock).mockResolvedValueOnce(mockResponse)

    const result = await authStore.createTeacher({
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com'
    })

    expect(postTeacher).toHaveBeenCalledWith({
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com'
    })
    expect(result).toEqual({ success: true, message: 'Teacher created successfully' })
  })

  it('should handle errors during teacher creation', async () => {
    ;(postTeacher as Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to create teacher' } }
    })

    const result = await authStore.createTeacher({
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com'
    })

    expect(postTeacher).toHaveBeenCalledWith({
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com'
    })
    expect(result).toEqual({ success: false, message: 'Failed to create teacher' })
  })
})
