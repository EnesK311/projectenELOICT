import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GetFilters, User } from '@/types/type'
import { getAllSwipeUsers, getAllUsers, swipe, getHistory } from '@/services/userService'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const swipeUsers = ref<User[]>([])
  const history = ref<{isApproved: boolean, user: User}[]>([])

  function isValidUser(u: User) {
    if (!u || !u.id || !u.firstname || !u.lastname) return false
    return true
  }

  const getUsers = async (filters: GetFilters) => {
    const res = await getAllUsers(filters)
    users.value = res.data.data as User[]
  }

  const getSwipeUsers = async (needed: string[]) => {
    const res = await getAllSwipeUsers(needed)
    const allSwipe = res.data.data as User[]
    swipeUsers.value = allSwipe.filter(isValidUser)
    await getSwipeHistory()
    if (history.value.length === 0) return
    swipeUsers.value = swipeUsers.value.filter(user => {
      return !history.value.some(h => h.user.id === user.id)
    })
  }

  const swipeUser = async (targetUserId: string | undefined, isApproved: boolean) => {
    if (!targetUserId) return
    await swipe(targetUserId, isApproved)
  }

  const getSwipeHistory = async () => {
    const res = await getHistory()
    history.value = res.data.data as {isApproved: boolean, user: User}[]
  }

  getUsers({}).catch(err => err)

  return { users, getUsers, getSwipeUsers, swipeUsers, swipeUser, getSwipeHistory, history }
})
