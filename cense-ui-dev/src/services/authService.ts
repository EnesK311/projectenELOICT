import { myAxios } from '@/instances/myAxios'
import { fillFormData } from '@/utils/helper'
import type { APIResponse, PutPayload } from '@/types/type'
import type { AxiosResponse } from 'axios'

export const login = async (
  email: string,
  password: string,
): Promise<AxiosResponse> => {
  return myAxios.post<APIResponse>(
    '/login',
    {
      email,
      password,
    },
    {
      baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
    },
  )
}

export const register = async (
  email: string,
  password: string,
): Promise<AxiosResponse> => {
  return myAxios.post<APIResponse>(
    '/register',
    {
      email,
      password,
    },
    {
      baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
    },
  )
}

export const refreshToken = async (
  refreshToken: string,
): Promise<AxiosResponse> => {
  return myAxios.post<APIResponse>(
    '/refresh',
    {
      refreshToken,
    },
    {
      baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
    },
  )
}

export const getMe = async (): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/users/info')
}

export const updateMe = async (payload: PutPayload): Promise<AxiosResponse> => {
  const formData = fillFormData(payload)

  return myAxios.put<APIResponse>('/users/info', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getMyId = async (): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/users/id')
}

export const resetPasswordWithCode = async (
  email: string,
  resetCode: string,
  newPassword: string,
): Promise<AxiosResponse> => {
  return myAxios.post<APIResponse>(
    '/resetPassword',
    {
      email,
      resetCode,
      newPassword,
    },
    {
      baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
    },
  )
}

export const sendForgotPasswordEmail = async (
  email: string,
): Promise<AxiosResponse> => {
  return myAxios.post<APIResponse>(
    '/forgotPassword',
    {
      email,
    },
    {
      baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
    },
  )
}

export const verifyEmail = async (
  userId: string,
  code: string,
): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/confirmEmail', {
    params: { userId, code },
    baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
  })
}

export const resendVerifyEmail = async (
  email: string,
): Promise<AxiosResponse> => {
  return myAxios.post<APIResponse>(
    '/resendConfirmationEmail',
    {
      email,
    },
    {
      baseURL: `https://${import.meta.env.VITE_API_PREFIX}`,
    },
  )
}
