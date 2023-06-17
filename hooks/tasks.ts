import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { Task, TaskInput, TaskPreview, UpdateTaskInput } from "@/types/task"

export function useGetTasks(params?: {
  status?: string
  projectId?: string
  contextId?: string
  statuses?: string[]
  contexts?: string[]
  includeCompleted?: boolean
  timeRange?: {
    from?: string
    to?: string
  }
}): {
  isLoading: boolean
  tasks: TaskPreview[]
  refetch: Function
} {
  const buildUrl = () => {
    const url = new URL(`${global?.window?.location.origin}/api/task`)

    if (!params) {
      return url.href
    }

    if (params?.status) {
      url.searchParams.append("status", params?.status || "")
    }

    if (params?.projectId) {
      url.searchParams.append("projectId", params?.projectId || "")
    }

    if (params?.contextId) {
      url.searchParams.append("contextId", params?.contextId || "")
    }

    if (params?.statuses?.length) {
      url.searchParams.append("statuses", params?.statuses.join(",") || "")
    }

    if (params?.contexts?.length) {
      url.searchParams.append("contexts", params?.contexts.join(",") || "")
    }

    if (params?.timeRange?.from) {
      url.searchParams.append("from", params?.timeRange?.from)
    }

    if (params?.timeRange?.to) {
      url.searchParams.append("from", params?.timeRange?.to)
    }

    if (!params?.includeCompleted) {
      url.searchParams.append("completed", "false")
    }

    return url.href
  }

  const { isLoading, data, refetch } = useQuery(["tasks", params], async () => {
    const url = buildUrl()
    const request = await fetch(url)

    return request.json()
  })

  return {
    isLoading,
    tasks: data?.tasks,
    refetch,
  }
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const {
    mutate: createTask,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async (input: TaskInput) => {
      const request = await fetch(`/api/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      return request.json()
    },
    {
      onMutate: async (newTask) => {
        if (!newTask) {
          return
        }

        await queryClient.cancelQueries({ queryKey: ["tasks"] })

        const previousTasks = queryClient.getQueryData(["tasks"])

        const newTaskWithId: Task = {
          ...newTask,
          id: Math.random().toString(36),
          completed: false,
          createdAt: new Date().toISOString(),
        }

        queryClient.setQueryData(
          ["tasks"],
          (old: { tasks: Task[] } | undefined) => ({
            tasks: old?.tasks ? [newTaskWithId, ...old.tasks] : [newTaskWithId],
          })
        )

        return { previousTasks }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(["tasks"], context?.previousTasks)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
        queryClient.invalidateQueries({ queryKey: ["project"] })
      },
    }
  )

  return {
    createTask,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  const {
    mutate: updateTask,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async ({ id, input }: { id: string; input: UpdateTaskInput }) => {
      const request = await fetch(`/api/task`, {
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

        await queryClient.cancelQueries({ queryKey: ["task", updated.id] })
        const previousTask = queryClient.getQueryData(["task", updated.id])
        queryClient.setQueryData(
          ["task", updated.id],
          (old?: { task: Task }) => {
            if (!old) {
              return
            }

            return {
              task: {
                ...old.task,
                ...updated.input,
              },
            }
          }
        )

        return { previousTask, updated }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          ["task", context?.updated.id],
          context?.previousTask
        )
      },
      onSettled: (data) => {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["task", data.id] })
          queryClient.invalidateQueries({ queryKey: ["tasks"] })
          queryClient.invalidateQueries({ queryKey: ["project"] })
        }, 300)
      },
    }
  )

  return {
    updateTask,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}

export function useGetTask(id: string): {
  isLoading: boolean
  task: Task
} {
  const { isLoading, data } = useQuery(["task", id], async () => {
    const request = await fetch(`/api/task/${id}`)

    return request.json()
  })

  return {
    isLoading,
    task: data?.task,
  }
}
