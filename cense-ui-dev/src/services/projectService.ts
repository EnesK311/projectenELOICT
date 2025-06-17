import { myAxios } from '@/instances/myAxios'
import type { AxiosResponse } from 'axios'
import type { Project } from '@/types/type'

// Create a new project
export const postProject = (project: Omit<Project, 'id'>): Promise<AxiosResponse<Project>> => {
  return myAxios.post('/projects', project)
}

// Update an existing project
export const updateProject = (id: string, project: Partial<Project>): Promise<AxiosResponse<Project>> => {
  return myAxios.put(`/projects/${id}`, project)
}

// Delete a project
export const deleteProject = (id: number): Promise<AxiosResponse<void>> => {
  return myAxios.delete(`/projects/${id}`)
}
