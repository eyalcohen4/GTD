import { ReactNode, useState } from "react"
import Link from "next/link"
import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"
import { Box, Calendar, Flower2, Locate } from "lucide-react"

import { TaskPreview } from "@/types/task"
import { useUpdateTask } from "@/hooks/tasks"

import { Checkbox } from "./ui/checkbox"

export const TaskListItem = ({ task }: { task: TaskPreview }) => {
  return (
    <Link href={`/task/${task.id}`} className="h-[50px] task-list-item">
      <TaskListItemContainer>
        <TaskLead task={task} />
        <div className="w-full flex-1 justify-end hidden md:flex">
          <TaskBadges task={task} />
        </div>
      </TaskListItemContainer>
    </Link>
  )
}

const TaskListItemContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-b hover:bg-slate-200 dark:hover:bg-slate-900 h-full">
      <div className="px-8 flex items-center justify-between h-full">
        {children}
      </div>
    </div>
  )
}
const TaskTitle = ({ children }: { children: ReactNode }) => {
  return (
    <p className="font-medium leading-none tracking-tight text-left">
      {children}
    </p>
  )
}

const TaskBadges = ({ task }: { task: TaskPreview }) => {
  const statusOption = statuses.find(({ value, slug }) => value === task.status)

  return (
    <div className="flex gap-4 items-center text-sm">
      <TaskBadge>
        <Box className="h-4 w-4" />
        <p>{statusOption?.label}</p>
      </TaskBadge>
      {task.contexts?.length ? (
        <TaskBadge>
          <Locate className="h-4 w-4" />
          {task?.contexts?.map((context) => (
            <>
              <div
                className="flex items-center gap-2 rounded"
                key={context.title}
                style={{
                  color: `${context.color}`,
                }}
              >
                <span className="">{context.title}</span>
              </div>
            </>
          ))}
        </TaskBadge>
      ) : null}
      {task.project ? (
        <TaskBadge>
          <Flower2 className="h-4 w-4" />
          <p>{task.project?.title}</p>
        </TaskBadge>
      ) : null}
      {task.dueDate ? (
        <TaskBadge>
          <Calendar className="h-4 w-4" />
          <p>{dayjs(task.dueDate).format("D MMM")}</p>
        </TaskBadge>
      ) : null}
      <p>{dayjs(task.createdAt).format("D MMM")}</p>
    </div>
  )
}

const TaskLead = ({ task }: { task: TaskPreview }) => {
  const { updateTask } = useUpdateTask()

  const [checked, setChecked] = useState(task.completed)

  const onCheck = async (event: any) => {
    event.preventDefault()
    event.stopPropagation()

    setChecked(!checked)
    await updateTask({ id: task.id, input: { completed: !task.completed } })
  }

  return (
    <div className="flex gap-4 items-center">
      <Checkbox
        circle
        className="h-6 w-6"
        checked={checked}
        onClick={onCheck}
      />
      <TaskTitle>{task.title}</TaskTitle>
    </div>
  )
}

const TaskBadge = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border rounded-md h-full flex items-center gap-2 px-2 py-1 text-xs">
      {children}
    </div>
  )
}
