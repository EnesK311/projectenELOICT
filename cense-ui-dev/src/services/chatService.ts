import { myAxios } from '@/instances/myAxios'
import type { APIResponse } from '@/types/type'
import type { AxiosResponse } from 'axios'

export const getMyChats = async (): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/chats')
}

export const getMessages = async (chatId: string): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/chats/' + chatId + '/messages')
}

export const getAvailableUsers = async (): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/chats/available-users')
}

export const makeChatBetweenUsers = async (
  recipientId: string,
): Promise<AxiosResponse> => {
  return myAxios.post<APIResponse>('/chats', {
    recipientId,
  })
}

export const getUnreadMessageCount = async (): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/chats/unread-messages')
}
