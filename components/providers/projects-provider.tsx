import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import { Project, ProjectInput } from "@/types/project"
import { useCreateProject, useGetProjects } from "@/hooks/projects"

type ProjectContextValue = {
  projects: Project[]
  loadingGetProjects: boolean
  loadingCreateProject: boolean
  createProject: (project: ProjectInput) => void
}

const ProjectContext = createContext<ProjectContextValue>({
  projects: [],
  loadingGetProjects: false,
  loadingCreateProject: false,
  createProject: (project: ProjectInput) => {},
})

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const { projects, isLoading: isLoadingProjects } = useGetProjects()
  const {
    createProject: createProjectMutation,
    isLoading: loadingCreateProject,
  } = useCreateProject()

  const createProject = async (project: ProjectInput) => {
    await createProjectMutation(project)
  }

  const value = useMemo(
    () => ({
      projects,
      createProject,
      loadingGetProjects: isLoadingProjects,
      loadingCreateProject,
    }),
    [projects, createProject]
  )

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider")
  }
  return context
}
