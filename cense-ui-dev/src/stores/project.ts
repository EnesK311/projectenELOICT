import { defineStore } from 'pinia'
import { type NewProject} from '@/types/type'
import { postProject, deleteProject } from '@/services/projectService'

export const useProjectsStore = defineStore('project', () => {

  //posting a project as a user
  const createProject = async (project: NewProject) => {
    await postProject(project)
  }

  const removeProject = async (id: number) => {
    await deleteProject(id)
  }

  return {
    createProject,
    removeProject
  }

})
