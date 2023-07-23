import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Goal, GoalInput, GoalPreview, UpdateGoalInput } from "@/types/goal"

export const useCreateGoal = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (goal: GoalInput) => {
      const response = await fetch(`/api/goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: goal }),
      })
      return response.json()
    },
    {
      onMutate: async (newGoal) => {
        if (!newGoal) {
          return
        }

        await queryClient.cancelQueries({ queryKey: ["goals"] })

        const previousGoals = queryClient.getQueryData(["goals"])

        const newGoalWithId: Goal = {
          ...newGoal,
          id: Math.random().toString(36),
          status: "NOT_STARTED",
          content: "",
          progress: 0,
          dueDate: newGoal.dueDate as string,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          projectsCount: {
            all: 0,
            completed: 0,
          },
          tasksCount: {
            all: 0,
            completed: 0,
            inbox: 0,
            waitingFor: 0,
            nextAction: 0,
          },
        }

        queryClient.setQueryData(
          ["goals"],
          (old: { goals: Goal[] } | undefined) => ({
            goals: old?.goals ? [newGoalWithId, ...old.goals] : [newGoalWithId],
          })
        )

        return { previousGoals }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(["goals"], context?.previousGoals)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["goals"] })
      },
    }
  )

  return {
    createGoal: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}

export const useGetGoals = () => {
  const query = useQuery<{ goals: GoalPreview[] }, Error>(
    ["goals"],
    async () => {
      const response = await fetch(`/api/goal`)
      return response.json()
    }
  )

  return {
    goals: query.data?.goals || [],
    isLoading: query.isLoading,
  }
}

export const useGetGoal = (id: string) => {
  const query = useQuery(["goal", id], async () => {
    const response = await fetch(`/api/goal/${id}`)
    return response.json()
  })

  return {
    goal: query?.data?.goal,
    isLoading: query.isLoading,
  }
}

export const useUpdateGoal = () => {
  const mutation = useMutation(
    async (input: { id: string; input: UpdateGoalInput }) => {
      const { id, input: updatedGoal } = input
      const response = await fetch(`/api/goal`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: updatedGoal, id }),
      })
      return response.json()
    }
  )

  return {
    updateGoal: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  const {
    mutate: deleteGoal,
    isLoading,
    data,
    isSuccess,
    reset,
  } = useMutation(
    async ({ id }: { id: string }) => {
      const response = await fetch(`/api/goal/${id}`, {
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
          queryClient.invalidateQueries({ queryKey: ["goal", data.id] })
          queryClient.invalidateQueries({ queryKey: ["goals"] })
        }, 300)
      },
    }
  )

  return {
    deleteGoal,
    isSuccess,
    data,
    isLoading,
    reset,
  }
}
