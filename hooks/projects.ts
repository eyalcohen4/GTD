import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Project, ProjectInput, UpdateProjectInput } from "@/types/project"
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

export function useGetProject(id: string): {
  isLoading: boolean
  project: Project
} {
  const { isLoading, data } = useQuery(
    ["project", id],
    async () => {
      const request = await fetch(`/api/project/${id}`)

      return request.json()
    },
    {
      refetchOnMount: false,
    }
  )

  return {
    isLoading,
    project: data?.project,
  }
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  const {
    mutate: updateProject,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async ({ id, input }: { id: string; input: UpdateProjectInput }) => {
      const request = await fetch(`/api/project`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, input }),
      })

      return request.json()
    },
    {
      onMutate: async (updated) => {
        if (!updated) {
          return
        }

        await queryClient.cancelQueries({ queryKey: ["project", updated.id] })
        const previousProject = queryClient.getQueryData([
          "project",
          updated.id,
        ])
        queryClient.setQueryData(
          ["project", updated.id],
          (old?: { project: Project }) => {
            if (!old) {
              return
            }

            return {
              project: {
                ...old.project,
                ...updated.input,
              },
            }
          }
        )

        return { previousProject, updated }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          ["project", context?.updated.id],
          context?.previousProject
        )
      },
      onSettled: (data) => {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["project", data.id] })
          queryClient.invalidateQueries({ queryKey: ["projects"] })
        }, 300)
      },
    }
  )

  return {
    updateProject,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}
