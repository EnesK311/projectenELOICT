import { myAxios } from '@/instances/myAxios'
import type { APIResponse, GetFilters } from '@/types/type'
import type { AxiosResponse } from 'axios'
import qs from 'qs'

export const getAllUsers = (filters: GetFilters): Promise<AxiosResponse> => {
  return myAxios.get('/users', {
    params: {
      Term: filters.term,
      Distance: filters.distance,
      Knowledge: filters.knowledge,
      FunctionTitle: filters.functionTitle,
      Sort: filters.sort,
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
      // get param: "Knowledge=HVAC&Knowledge=C%23"
    },
  })
}

export const getUserById = async (id: string): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>(`/users/info/${id}`)
}

export const getAllSwipeUsers = (
  knowledge: string[],
): Promise<AxiosResponse> => {
  return myAxios.get('/users', {
    params: {
      Knowledge: knowledge,
      IsSwipe: true,
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
}

export const swipe = (targetUserId: string, isApproved: boolean): Promise<AxiosResponse> => {
  return myAxios.post('/swipe/add', {
    targetUserId,
    isApproved,
  })
}

export const getHistory = async (): Promise<AxiosResponse> => {
  return myAxios.get('/swipe/history')
}
