import type { Player, RegisterPayload } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { getCsrfCookie, getUser, patchUser, postLogin, postLogout, postRegister } from '@/services/dataService'


export const useAuthStore = defineStore('auth', () => {
  const user = ref<Player | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const isAdmin = ref<boolean>(false)

  const tryAutoLogin = async () => {
    try {
      if (user.value !== null || user.value !== undefined) {
        await initUser().catch(() => {
          user.value = null
          isAuthenticated.value = false
          isAdmin.value = false
        })
      } else {
        user.value = null
        isAuthenticated.value = false
        isAdmin.value = false
      }
    } catch (err) {
      //console.log(err)
    }
  }

  const getUserDetails = async () => {
    const user = await getUser<{data: Player}>().then((res) => {
      return {
        id: res.data.data.id,
        username: res.data.data.username,
        email: res.data.data.email,
        level: res.data.data.level,
        highscore: res.data.data.highscore,
        games_played: res.data.data.games_played,
        games_won: res.data.data.games_won,
        players_killed: res.data.data.players_killed,
        skins: [],
        role: '',
        duels: res.data.data.duels,
      }
    })
    return user
  }
  
  const initUser = async () => {
    user.value = await getUserDetails().catch()

    if (user.value !== null) {
      isAuthenticated.value = true
      if (user.value?.role == 'admin') isAdmin.value = true
    } else {
      user.value = null
      isAuthenticated.value = false
      isAdmin.value = false
    }
  }
  
  const login = async (payload: { email: string; password: string }) => {
    try {
      user.value = null
      await getCsrfCookie()
      await postLogin(payload)
      await initUser()
      router.push({ name: 'profile' })
    } catch(err: any) {
      return err.response.data.message
    }
  }
  
  const logout = async () => {
    await postLogout().catch(() => {})

    user.value = null
    isAuthenticated.value = false
    isAdmin.value = false
    
    router.push({ name: 'login' })
  }
  
  const register = async (payload: RegisterPayload) => {
    try {
      await postRegister(payload)
      await login({ email: payload.email, password: payload.password })
    } catch (err: any) {
      return err.response.data.message
    }
  }

  const patch = async (username: string) => {
    try {
      await patchUser(username)
    } catch(err: any) {
      console.log(err.response.data.message)
      return err.response.data.message
    }
  }
  
  return { user, isAuthenticated, isAdmin, tryAutoLogin, getUserDetails, login, logout, register, patch }
}, 
{ persist: {
  storage: localStorage,
  paths: ['user']
}
})
