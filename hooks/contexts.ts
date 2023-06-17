import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Context, ContextInput, UpdateContextInput } from "@/types/context"

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

export function useUpdateContext() {
  const queryClient = useQueryClient()

  const {
    mutate: updateContext,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async ({ id, input }: { id: string; input: UpdateContextInput }) => {
      const request = await fetch(`/api/context`, {
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

        await queryClient.cancelQueries({ queryKey: ["context", updated.id] })
        const previousContext = queryClient.getQueryData([
          "context",
          updated.id,
        ])
        queryClient.setQueryData(
          ["context", updated.id],
          (old?: { context: Context }) => {
            if (!old) {
              return
            }

            return {
              context: {
                ...old.context,
                ...updated.input,
              },
            }
          }
        )

        return { previousContext, updated }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          ["context", context?.updated.id],
          context?.previousContext
        )
      },
      onSettled: (data) => {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["context", data.id] })
          queryClient.invalidateQueries({ queryKey: ["contexts"] })
        }, 300)
      },
    }
  )

  return {
    updateContext,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}

export function useDeleteContext() {
  const queryClient = useQueryClient()

  const {
    mutate: deleteContext,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async ({ id }: { id: string }) => {
      const request = await fetch(`/api/context/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return request.json()
    },
    {
      onSettled: (data) => {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["context", data.id] })
          queryClient.invalidateQueries({ queryKey: ["contexts"] })
        }, 300)
      },
    }
  )

  return {
    deleteContext,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}
