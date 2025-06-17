import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type {
  HttpValidationProblemDetails,
  LoginRequest,
  PutPayload,
  RegisterRequest,
  User,
} from '@/types/type'
import {
  login,
  register,
  getMe,
  updateMe,
  getMyId,
  resetPasswordWithCode,
  sendForgotPasswordEmail,
  verifyEmail,
  resendVerifyEmail,
} from '@/services/authService'
import type { AxiosError } from 'axios'
import { useChatStore } from './chat'
import { useSocket } from '@/composables/socket'

const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const profileComplete = computed(
      () =>
        !!(user.value?.company && user.value.bio && user.value.specialities),
    )
    const error = ref<HttpValidationProblemDetails | string | null>(null)
    const { getChats } = useChatStore()

    const { setSocket } = useSocket()

    watch(user, () => {
      const url = 'https://' + import.meta.env.VITE_API_PREFIX
      setSocket(new WebSocket(url + '/ws?token=' + user.value?.id))
      console.log('socket set')
    })

    const setTokens = (
      accessToken: string | undefined,
      refreshToken: string | undefined,
    ) => {
      if (!accessToken || !refreshToken) return
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    }

    const clearTokens = () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }

    const setError = (e: AxiosError) => {
      console.log(e)
      console.log(e.response)
      if (e.status === 401 && e.response) {
        const err = e.response.data as HttpValidationProblemDetails
        console.log(err)

        if (err && err.detail === 'NotAllowed') {
          error.value = { title: 'Email is nog niet geverifieerd' }
          return
        }
        if (err && err.detail === 'LockedOut') {
          error.value = {
            title:
              'Je hebt 5 foute pogingen gedaan. Probeer opnieuw binnen 3 minuten.',
          }
          return
        }
        error.value = { title: 'Wachtwoord of email is onjuist' }
        return
      }
      if (e.status === 400 && e.response) {
        const err = e.response.data as HttpValidationProblemDetails
        if (err && err.errors && err.errors.DuplicateEmail) {
          const email = err.errors.DuplicateEmail[0].split(' ')[1]

          error.value = { title: 'Email ' + email + ' is al in gebruik' }
          return
        }

        if (err && err.errors && err.errors.NotAllowed) {
          error.value = { title: 'Email is nog niet geverifieerd' }
          return
        }
      }
      error.value = e instanceof Error ? e.message : String(e)
    }

    const handleAuthRequest = async (request: () => Promise<void>) => {
      loading.value = true
      error.value = null
      try {
        await request()
      } catch (e) {
        const error = e as AxiosError
        setError(error)
      } finally {
        loading.value = false
      }
    }

    const loginUser = (loginRequest: LoginRequest) =>
      handleAuthRequest(async () => {
        const res = await login(loginRequest.email, loginRequest.password)
        setTokens(res.data.accessToken, res.data.refreshToken)
        await getMeInfo()
        isAuthenticated.value = true
      })

    const registerUser = (registerRequest: RegisterRequest) =>
      handleAuthRequest(async () => {
        await register(
          registerRequest.email as string,
          registerRequest.password as string,
        )
      })

    const getMeInfo = async () => {
      loading.value = true
      try {
        const response = await getMe()
        const data = response.data.data as User
        await getChats()
        user.value = { ...data, id: (await getMyId()).data.data }
      } catch (e) {
        const error = e as AxiosError
        setError(error)
      } finally {
        loading.value = false
      }
    }

    const logout = () => {
      isAuthenticated.value = false
      user.value = null
      error.value = null
      clearTokens()
      setSocket(null)
    }

    const updateUser = async (payload: PutPayload) => {
      const res = await updateMe(payload)
      if (res.data.success) await getMeInfo()
    }

    const resetPassword = async (
      email: string,
      code: string,
      password: string,
    ) => {
      await resetPasswordWithCode(email, code, password)
    }

    const sendForgotPasswordMail = async (email: string) => {
      await sendForgotPasswordEmail(email)
    }

    const confirmEmail = async (userId: string, code: string) => {
      await verifyEmail(userId, code)
    }

    const resendEmail = async (email: string) => {
      await resendVerifyEmail(email)
    }

    return {
      user,
      isAuthenticated,
      loading,
      error,
      loginUser,
      registerUser,
      getMeInfo,
      logout,
      profileComplete,
      updateUser,
      resetPassword,
      sendForgotPasswordMail,
      confirmEmail,
      resendEmail,
    }
  },
  {
    persist: true,
  },
)

export default useAuthStore
