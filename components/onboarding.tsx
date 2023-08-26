"use client"

import { useTasks } from "./providers/tasks-provider"
import { TaskForm } from "./task-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Dialog, DialogContent } from "./ui/dialog"

export const Onboarding = () => {
  const { tasks, loadingGetTasks } = useTasks()

  return !loadingGetTasks && !tasks?.length ? (
    <Dialog open>
      <DialogContent>
        <CardHeader>
          <CardTitle>Create a task to get started</CardTitle>
          <CardDescription>
            Clear your mind by moving tasks from your head to Current.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm create />
        </CardContent>
      </DialogContent>
    </Dialog>
  ) : null
}
