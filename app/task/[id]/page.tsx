"use client"

import { useGetTask } from "@/hooks/tasks"
import { AppLayout } from "@/components/layouts/app-layout"
import { TaskForm } from "@/components/task-form"

const TaskPage = ({ params: { id } }: { params: { id: string } }) => {
  const { task, isLoading } = useGetTask(id)
  return (
    <AppLayout>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="h-full md:px-24">
          <TaskForm task={task} />
        </div>
      )}
    </AppLayout>
  )
}

export default TaskPage
