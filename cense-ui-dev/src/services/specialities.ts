import { myAxios } from '@/instances/myAxios'
import type { APIResponse } from '@/types/type'
import type { AxiosResponse } from 'axios'

export const getAllSpecialities = (): Promise<AxiosResponse> => {
  return myAxios.get<APIResponse>('/specialities')
}
