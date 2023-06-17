import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Goal, GoalInput, GoalPreview, UpdateGoalInput } from "@/types/goal"
import { useCreateGoal, useGetGoals, useUpdateGoal } from "@/hooks/goals"

type GoalContextValue = {
  goals: GoalPreview[]
  loadingGetGoals: boolean
  loadingCreateGoal: boolean
  loadingUpdateGoal: boolean
  createGoal: (goal: GoalInput) => void
  updateGoal: (input: { id: string; input: UpdateGoalInput }) => void
}

const GoalContext = createContext<GoalContextValue>({
  goals: [],
  loadingGetGoals: false,
  loadingCreateGoal: false,
  loadingUpdateGoal: false,
  createGoal: (goal: GoalInput) => {},
  updateGoal: (input: { id: string; input: UpdateGoalInput }) => {},
})

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const { goals, isLoading: loadingGetGoals } = useGetGoals()
  const { updateGoal: updateGoalMutation, isLoading: loadingUpdateGoal } =
    useUpdateGoal()
  const { createGoal: createGoalMutation, isLoading: loadingCreateGoal } =
    useCreateGoal()

  const createGoal = async (goal: GoalInput) => {
    await createGoalMutation(goal)
  }

  const updateGoal = async (input: { id: string; input: UpdateGoalInput }) => {
    await updateGoalMutation(input)
  }

  const value = useMemo(
    () => ({
      goals,
      createGoal,
      loadingGetGoals,
      loadingCreateGoal,
      updateGoal,
      loadingUpdateGoal,
    }),
    [
      goals,
      createGoal,
      loadingCreateGoal,
      loadingGetGoals,
      updateGoal,
      loadingUpdateGoal,
    ]
  )

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>
}

export const useGoals = () => {
  const context = useContext(GoalContext)
  if (context === undefined) {
    throw new Error("useGoalContext must be used within a GoalProvider")
  }
  return context
}
