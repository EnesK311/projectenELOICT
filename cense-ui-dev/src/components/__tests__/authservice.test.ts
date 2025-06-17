import { describe, it, expect, vi, type Mock } from 'vitest'
import {
  login,
  register,
  refreshToken,
  getMe,
  updateMe,
  getMyId,
  resetPasswordWithCode,
  sendForgotPasswordEmail,
  verifyEmail,
  resendVerifyEmail,
} from '@/services/authService'
import { myAxios } from '@/instances/myAxios'
import type { PutPayload } from '@/types/type'

// Mock the myAxios instance
vi.mock('@/instances/myAxios', () => ({
  myAxios: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}))

describe('authService', () => {
  it('logs in a user', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.post as Mock).mockResolvedValue(mockResponse)

    const response = await login('test@example.com', 'password123')

    expect(myAxios.post).toHaveBeenCalledWith(
      '/login',
      { email: 'test@example.com', password: 'password123' },
      { baseURL: `https://${import.meta.env.VITE_API_PREFIX}` },
    )
    expect(response).toEqual(mockResponse)
  })

  it('registers a user', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.post as Mock).mockResolvedValue(mockResponse)

    const response = await register('newuser@example.com', 'securepassword')

    expect(myAxios.post).toHaveBeenCalledWith(
      '/register',
      { email: 'newuser@example.com', password: 'securepassword' },
      { baseURL: `https://${import.meta.env.VITE_API_PREFIX}` },
    )
    expect(response).toEqual(mockResponse)
  })

  it('refreshes a token', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.post as Mock).mockResolvedValue(mockResponse)

    const response = await refreshToken('refresh-token-123')

    expect(myAxios.post).toHaveBeenCalledWith(
      '/refresh',
      { refreshToken: 'refresh-token-123' },
      { baseURL: `https://${import.meta.env.VITE_API_PREFIX}` },
    )
    expect(response).toEqual(mockResponse)
  })

  it('fetches user info', async () => {
    const mockResponse = {
      data: { data: { firstname: 'John', lastname: 'Doe' } },
    }
    ;(myAxios.get as Mock).mockResolvedValue(mockResponse)

    const response = await getMe()

    expect(myAxios.get).toHaveBeenCalledWith('/users/info')
    expect(response).toEqual(mockResponse)
  })

  it('updates user info', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.put as Mock).mockResolvedValue(mockResponse)

    const payload: PutPayload = {
      firstname: 'John',
      lastname: 'Doe',
      bio: 'Updated bio',
      age: 30,
      company: {
        name: 'Tech Inc',
        street: 'Main St',
        houseNumber: '123',
        city: 'Techville',
        postalcode: '5789',
      },
      specialitiesJson: {
        Known: [{ Name: 'Speciality 1', Category: 1 }],
        Needed: [{ Name: 'Speciality 2', Category: 2 }],
      },
      profilePicture: new File(['picture'], 'profile.png'),
    }

    const response = await updateMe(payload)

    expect(myAxios.put).toHaveBeenCalledWith(
      '/users/info',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    expect(response).toEqual(mockResponse)
  })

  it('fetches user ID', async () => {
    const mockResponse = { data: { data: 'user-id-123' } }
    ;(myAxios.get as Mock).mockResolvedValue(mockResponse)

    const response = await getMyId()

    expect(myAxios.get).toHaveBeenCalledWith('/users/id')
    expect(response).toEqual(mockResponse)
  })

  it('resets password with a code', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.post as Mock).mockResolvedValue(mockResponse)

    const response = await resetPasswordWithCode(
      'test@example.com',
      'resetCode123',
      'newPassword',
    )

    expect(myAxios.post).toHaveBeenCalledWith(
      '/resetPassword',
      {
        email: 'test@example.com',
        resetCode: 'resetCode123',
        newPassword: 'newPassword',
      },
      { baseURL: `https://${import.meta.env.VITE_API_PREFIX}` },
    )
    expect(response).toEqual(mockResponse)
  })

  it('sends forgot password email', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.post as Mock).mockResolvedValue(mockResponse)

    const response = await sendForgotPasswordEmail('test@example.com')

    expect(myAxios.post).toHaveBeenCalledWith(
      '/forgotPassword',
      { email: 'test@example.com' },
      { baseURL: `https://${import.meta.env.VITE_API_PREFIX}` },
    )
    expect(response).toEqual(mockResponse)
  })

  it('verifies email', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.get as Mock).mockResolvedValue(mockResponse)

    const response = await verifyEmail('user-id-123', 'verifyCode123')

    expect(myAxios.get).toHaveBeenCalledWith('/confirmEmail', {
      params: { userId: 'user-id-123', code: 'verifyCode123' },
      baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
    })
    expect(response).toEqual(mockResponse)
  })

  it('resends verification email', async () => {
    const mockResponse = { data: { success: true } }
    ;(myAxios.post as Mock).mockResolvedValue(mockResponse)

    const response = await resendVerifyEmail('test@example.com')

    expect(myAxios.post).toHaveBeenCalledWith(
      '/resendConfirmationEmail',
      { email: 'test@example.com' },
      { baseURL: `https://${import.meta.env.VITE_API_PREFIX}` },
    )
    expect(response).toEqual(mockResponse)
  })
})
