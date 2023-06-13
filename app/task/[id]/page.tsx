"use client"

import { useGetTask } from "@/hooks/tasks"
import { TaskForm } from "@/components/task-form"

const TaskPage = ({ params: { id } }: { params: { id: string } }) => {
  const { task, isLoading } = useGetTask(id)
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="h-full md:px-24 px-8">
      <TaskForm task={task} />
    </div>
  )
}

export default TaskPage
