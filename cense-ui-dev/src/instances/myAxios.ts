import useAuthStore from '@/stores/auth'
import axios, { AxiosError } from 'axios'

const myAxios = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_PREFIX}/api/v1`,
  withCredentials: true,
})

myAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

myAxios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const originalRequest = error.config
      try {
        if (
          error.response &&
          error.response.data &&
          (error.response.data.detail === 'NotAllowed' ||
            error.response.data.detail === 'LockedOut' ||
            error.response.data.detail === 'Failed')
        ) {
          return axios(originalRequest)
        }
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          const err = new AxiosError('No refresh token')
          err.status = 401
          throw err
        }

        const response = await axios.post(
          `https://${import.meta.env.VITE_API_PREFIX}/refresh`,
          { refreshToken },
        )
        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        useAuthStore().logout()

        throw refreshError
      }
    }
    throw error
  },
)

export { myAxios }
