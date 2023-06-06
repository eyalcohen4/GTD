import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { Task, TaskInput, UpdateTaskInput } from "@/types/task"

export function useGetTasks(): {
  isLoading: boolean
  tasks: Task[]
} {
  const { isLoading, data } = useQuery(["tasks"], async () => {
    const request = await fetch(`/api/task`)

    return request.json()
  })

  return {
    isLoading,
    tasks: data?.tasks,
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
        await queryClient.cancelQueries({ queryKey: ["tasks", updated.id] })

        // Snapshot the previous value
        const previousTask = queryClient.getQueryData(["tasks", updated.id])

        // Optimistically update to the new value
        queryClient.setQueryData(["tasks", updated.id], updated)

        // Return a context with the previous and new todo
        return { previousTask, updated }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(["tasks"], context?.previousTask)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
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
