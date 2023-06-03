import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Task, TaskInput } from "@/types/task"

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
      onSuccess: (data) => {
        if (!data?.task) {
          return
        }
        queryClient.setQueryData(["inbox"], (old?: { inbox: Array<Task> }) => {
          if (!old?.inbox) {
            return { inbox: [data.task] }
          }

          return { inbox: [data.task, ...old?.inbox] }
        })
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

export function useGetInbox() {
  const { isLoading, data } = useQuery(["inbox"], async () => {
    const request = await fetch(`/api/task/inbox`)

    return request.json()
  })

  return {
    isLoading,
    inbox: data?.inbox,
  }
}
