import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { CreateViewInput, UpdateViewInput, Views } from "@/types/view"

export const useCreateView = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (view: CreateViewInput) => {
      const response = await fetch(`/api/views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(view),
      })
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["views"] })
      },
    }
  )

  return {
    createView: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}

export const useGetViews = () => {
  const query = useQuery<{ views: Views[] }, Error>(["views"], async () => {
    const response = await fetch(`/api/views`)
    return response.json()
  })

  return {
    views: query.data?.views || [],
    isLoading: query.isLoading,
  }
}

export const useGetView = (id: string) => {
  const query = useQuery(["view", id], async () => {
    const response = await fetch(`/api/views/${id}`)
    return response.json()
  })

  return {
    view: query.data,
    isLoading: query.isLoading,
  }
}

export const useUpdateView = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (input: { id: string; input: UpdateViewInput }) => {
      const { id, input: updatedView } = input
      const response = await fetch(`/api/views/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedView),
      })
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["views"] })
      },
    }
  )

  return {
    updateView: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}

export const useDeleteView = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (id: string) => {
      const response = await fetch(`/api/views/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["views"] })
      },
    }
  )

  return {
    deleteView: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}
