import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { GoalPreview } from "@/types/goal"
import { Kpi, KpiInput, UpdateKpiInput } from "@/types/kpi"

export const useCreateKpi = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (kpi: KpiInput) => {
      const response = await fetch(`/api/kpi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: kpi }),
      })
      return response.json()
    },
    {
      onMutate: async (newKpi) => {
        if (!newKpi) {
          return
        }

        await queryClient.cancelQueries({ queryKey: ["kpis"] })

        const previousKpis = queryClient.getQueryData(["kpis"])

        const newKpiWithId: Kpi = {
          ...newKpi,
          id: Math.random().toString(36),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          targets: [],
          entries: [],
        }

        queryClient.setQueryData(
          ["kpis"],
          (old: { kpis: Kpi[] } | undefined) => ({
            kpis: old?.kpis ? [newKpiWithId, ...old.kpis] : [newKpiWithId],
          })
        )

        return { previousKpis }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(["kpis"], context?.previousKpis)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["kpis"] })
      },
    }
  )

  return mutation
}

export const useGetKpis = () => {
  const query = useQuery<{ kpis: Kpi[] }, Error>(["kpis"], async () => {
    const response = await fetch(`/api/kpi`)
    return response.json()
  })

  return query
}

export const useGetKpi = (id: string) => {
  const query = useQuery(["kpi", id], async () => {
    const response = await fetch(`/api/kpi/${id}`)
    return response.json()
  })

  return query
}

export const useUpdateKpi = () => {
  const mutation = useMutation(
    async (input: { id: string; input: UpdateKpiInput }) => {
      const { id, input: updatedKpi } = input
      const response = await fetch(`/api/kpi`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: updatedKpi }),
      })
      return response.json()
    }
  )

  return {
    updateGoal: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}

export function useDeleteKpi() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async ({ id }: { id: string }) => {
      const response = await fetch(`/api/kpi/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return response.json()
    },
    {
      onSettled: (data) => {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["kpi", data.id] })
          queryClient.invalidateQueries({ queryKey: ["kpis"] })
        }, 300)
      },
    }
  )

  return mutation
}
