import type { User, RegisterPayload, ReceiveUser } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import {
  postLogin,
  postLogout,
  postRegister,
  getUser,
  getCsrfCookie,
  postPasswordReset,
  postPasswordResetLink,
  postTeacher
} from '@/services/dataService'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const isAuthenticated = ref<boolean>(false)
    const isTeacher = ref<boolean>(false)
    const isAdmin = ref<boolean>(false)
    const checkingLogin = ref<boolean>(true)
    const hasRehydrated = ref<boolean>(false)

    const rehydrateAuth = async function () {
      console.log('rehydrate')
      const storedUser = localStorage.getItem('auth')
      if (storedUser) {
        await getUserDetails()
      } else {
        user.value = null
        isAuthenticated.value = false
        isTeacher.value = false
      }
      checkingLogin.value = false
      hasRehydrated.value = true
    }

    const getUserDetails = async function () {
      try {
        const { data } = await getUser<ReceiveUser>()
        user.value = data.data
        isAuthenticated.value = true
        isTeacher.value = user.value?.role === 'teacher'
        isAdmin.value = user.value?.role === 'admin'
        return true
      } catch {
        user.value = null
        isAuthenticated.value = false
        isTeacher.value = false
        return false
      }
    }

    const login = async function (payload: { email: string; password: string }) {
      try {
        user.value = null
        await getCsrfCookie()
        await postLogin(payload)
        await createUser()
        router.push({ name: 'dashboard' })
      } catch (err: any) {
        return err.response.data.message
      }
    }

    const logout = async function () {
      user.value = null
      isAuthenticated.value = false
      isTeacher.value = false
      //reset all the stores

      await postLogout().catch(() => {})
      router.push({ name: 'home' })
    }

    const register = async function (payload: RegisterPayload) {
      try {
        await postRegister(payload)
        await login({ email: payload.email, password: payload.password })
      } catch (err: any) {
        // Handle registration error
        console.log(err)
      }
    }

    const createUser = async function () {
      const authenticated = await getUserDetails()
      console.log('value of is auth inside createUser:', authenticated)
    }

    // password reset logic
    const sendPasswordResetLink = async function (payload: { email: string }) {
      try {
        const response = await postPasswordResetLink(payload)
        return { success: true, message: response.data.message }
      } catch (err: any) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to send reset link.'
        }
      }
    }

    const resetPassword = async function (payload: {
      email: string
      token: string
      password: string
      password_confirmation: string
    }) {
      try {
        const response = await postPasswordReset(payload)
        return { success: true, message: response.data.message }
      } catch (err: any) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to reset password.'
        }
      }
    }

    const createTeacher = async function (payload: {
      firstname: string
      lastname: string
      email: string
    }) {
      try {
        const response = await postTeacher(payload)
        return { success: true, message: response.data.message }
      } catch (err: any) {
        return { success: false, message: err.response.data.message }
      }
    }

    rehydrateAuth()

    return {
      user,
      isAuthenticated,
      isTeacher,
      getUserDetails,
      login,
      logout,
      register,
      checkingLogin,
      rehydrateAuth,
      hasRehydrated,
      isAdmin,
      sendPasswordResetLink,
      resetPassword,
      createTeacher
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['user']
    }
  }
)
