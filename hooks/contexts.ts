import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Context, ContextInput } from "@/types/context"

export function useCreateContext() {
  const queryClient = useQueryClient()

  const {
    mutate: createContext,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async (input: ContextInput) => {
      const request = await fetch(`/api/context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      return request.json()
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["contexts"])
      },
    }
  )

  return {
    createContext,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}

export function useGetContexts(): {
  isLoading: boolean
  contexts: Array<Context>
} {
  const { isLoading, data } = useQuery(
    ["contexts"],
    async () => {
      const request = await fetch(`/api/context`)

      return request.json()
    },
    {
      refetchOnMount: false,
    }
  )

  return {
    isLoading,
    contexts: data?.contexts,
  }
}
