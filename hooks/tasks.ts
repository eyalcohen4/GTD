import { useMutation, useQuery } from "@tanstack/react-query"

import { TaskInput } from "@/types/task"

export function useCreateTask() {
  const {
    mutate: createTask,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(async (input: TaskInput) => {
    const request = await fetch(`/api/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    })

    return request.json()
  })

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
