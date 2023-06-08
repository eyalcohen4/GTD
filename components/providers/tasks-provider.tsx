import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import { Task, TaskInput, UpdateTaskInput } from "@/types/task"
import { useCreateTask, useGetTasks, useUpdateTask } from "@/hooks/tasks"

type TaskContextValue = {
  tasks: Task[]
  inbox: Task[]
  loadingGetTasks: boolean
  loadingCreateTask: boolean
  loadingUpdateTask: boolean
  createTask: (task: TaskInput) => void
  updateTask: (input: { id: string; input: UpdateTaskInput }) => void
}

const TaskContext = createContext<TaskContextValue>({
  tasks: [],
  inbox: [],
  loadingGetTasks: false,
  loadingCreateTask: false,
  loadingUpdateTask: false,
  createTask: (task: TaskInput) => {},
  updateTask: (input: { id: string; input: UpdateTaskInput }) => {},
})

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const { tasks, isLoading: loadingGetTasks } = useGetTasks()
  const { updateTask: updateTaskMutation, isLoading: loadingUpdateTask } =
    useUpdateTask()
  const { createTask: createTaskMutation, isLoading: loadingCreateTask } =
    useCreateTask()

  const createTask = async (task: TaskInput) => {
    await createTaskMutation(task)
  }

  const updateTask = async (input: { id: string; input: UpdateTaskInput }) => {
    await updateTaskMutation(input)
  }

  const inbox = useMemo(
    () => tasks?.filter((task) => task.status === "INBOX"),
    [tasks]
  )

  const value = useMemo(
    () => ({
      inbox,
      tasks,
      createTask,
      loadingGetTasks,
      loadingCreateTask,
      updateTask,
      loadingUpdateTask,
    }),
    [
      tasks,
      createTask,
      loadingCreateTask,
      loadingGetTasks,
      inbox,
      updateTask,
      loadingUpdateTask,
    ]
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
