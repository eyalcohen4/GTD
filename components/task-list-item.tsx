import { ReactNode, useState } from "react"
import Link from "next/link"
import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"
import { Box, Calendar, Flower2, Locate } from "lucide-react"

import { TaskPreview } from "@/types/task"
import { cn } from "@/lib/utils"
import { useUpdateTask } from "@/hooks/tasks"

import { Checkbox } from "./ui/checkbox"
import { Skeleton } from "./ui/skeleton"

export const TaskListItem = ({
  task,
  fullWidth,
  hideComplete,
  onClick,
}: {
  task: TaskPreview
  fullWidth?: boolean
  hideComplete?: boolean
  onClick?: () => void
}) => {
  return onClick ? (
    <div
      onClick={onClick}
      className="h-[50px] task-list-item block cursor-pointer"
    >
      <TaskListItemContainer fullWidth={fullWidth}>
        <TaskLead task={task} hideComplete={hideComplete} />
        <div className="w-full flex-1 justify-end hidden md:flex">
          <TaskBadges task={task} />
        </div>
      </TaskListItemContainer>
    </div>
  ) : (
    <Link href={`/task/${task.id}`} className="h-[50px] task-list-item block">
      <TaskListItemContainer fullWidth={fullWidth}>
        <TaskLead task={task} hideComplete={hideComplete} />
        <div className="w-full flex-1 justify-end hidden md:flex">
          <TaskBadges task={task} />
        </div>
      </TaskListItemContainer>
    </Link>
  )
}

const TaskListItemContainer = ({
  children,
  fullWidth,
}: {
  children: ReactNode
  fullWidth?: boolean
}) => {
  return (
    <div className="border-b hover:bg-slate-200 dark:hover:bg-slate-900 h-full">
      <div
        className={cn("px-8 flex items-center justify-between h-full gap-4", {
          "px-0": fullWidth,
        })}
      >
        {children}
      </div>
    </div>
  )
}
const TaskTitle = ({ children }: { children: ReactNode }) => {
  return (
    <p className="font-medium leading-none tracking-tight text-left truncate text-sm md:text-md md:max-w-lg max-w-full">
      {children}
    </p>
  )
}

export const TaskBadges = ({
  task,
  hideContext,
}: {
  task: TaskPreview
  hideContext?: boolean
}) => {
  const statusOption = statuses.find(({ value, slug }) => value === task.status)

  return (
    <div className="flex gap-4 items-center text-sm flex-wrap">
      <TaskBadge>
        {statusOption?.icon ? (
          <statusOption.icon
            className={cn("h-4 w-4")}
            style={{
              color: statusOption?.color,
            }}
          />
        ) : null}
        <p
          style={{
            color: statusOption?.color,
          }}
        >
          {statusOption?.label}
        </p>
      </TaskBadge>
      {task.contexts?.length && !hideContext ? (
        <TaskBadge>
          <Locate
            className="h-4 w-4"
            style={{
              color: task.contexts[0].color,
            }}
          />
          {task?.contexts?.map((context) => (
            <div
              className="flex items-center gap-2 rounded"
              key={context.title}
              style={{
                color: context.color,
              }}
            >
              <span className="">{context.title}</span>
            </div>
          ))}
        </TaskBadge>
      ) : null}
      {task.project ? (
        <TaskBadge>
          <Flower2
            className="h-4 w-4"
            style={{
              color: task.project?.color,
            }}
          />
          <p
            style={{
              color: task.project?.color,
            }}
          >
            {task.project?.title}
          </p>
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

const TaskLead = ({
  task,
  hideComplete,
}: {
  task: TaskPreview
  hideComplete?: boolean
}) => {
  const { updateTask } = useUpdateTask()

  const [checked, setChecked] = useState(task.completed)

  const onCheck = async (event: any) => {
    event.preventDefault()
    event.stopPropagation()

    setChecked(!checked)
    await updateTask({ id: task.id, input: { completed: !task.completed } })
  }

  return (
    <div className="flex gap-4 items-center max-w-full">
      {!hideComplete ? (
        <Checkbox
          circle
          className="h-5 w-5"
          checked={checked}
          onClick={onCheck}
        />
      ) : null}
      <TaskTitle>{task.title}</TaskTitle>
    </div>
  )
}

export const TaskBadge = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "border rounded-md h-full flex items-center gap-2 px-2 py-1 text-xs",
        className
      )}
    >
      {children}
    </div>
  )
}

export const TaskListItemSkeleton = ({
  fullWidth,
}: {
  fullWidth?: boolean
}) => {
  return (
    <div className="h-[50px] task-list-item block cursor-pointer">
      <TaskListItemContainer fullWidth={fullWidth}>
        <Skeleton />
        <div className="w-full flex-1 justify-end hidden md:flex">
          <Skeleton />
        </div>
      </TaskListItemContainer>
    </div>
  )
}
