import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Project, ProjectInput } from "@/types/project"
import { Task, TaskInput } from "@/types/task"

export function useCreateProject() {
  const queryClient = useQueryClient()

  const {
    mutate: createProject,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async (input: ProjectInput) => {
      const request = await fetch(`/api/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      return request.json()
    },
    {
      onSuccess: (data) => {
        if (!data?.project) {
          return
        }

        queryClient.invalidateQueries(["projects"])
      },
    }
  )

  return {
    createProject,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}

export function useGetProjects(): {
  isLoading: boolean
  projects: Array<Project>
} {
  const { isLoading, data } = useQuery(
    ["projects"],
    async () => {
      const request = await fetch(`/api/project`)

      return request.json()
    },
    {
      refetchOnMount: false,
    }
  )

  return {
    isLoading,
    projects: data?.projects,
  }
}
