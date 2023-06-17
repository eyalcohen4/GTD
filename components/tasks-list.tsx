"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { statuses as defaultStatuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { ChevronDown, Loader } from "lucide-react"

import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { useGetTasks, useUpdateTask } from "@/hooks/tasks"

import { useContexts } from "./providers/contexts-provider"
import { useProjects } from "./providers/projects-provider"
import { TaskListItem } from "./task-list-item"
import { Checkbox } from "./ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"

dayjs.extend(relativeTime)

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
]

export const TasksList = ({
  fullWidth,
  title,
  status,
  statuses,
  projectId,
  contextId,
  timeRange,
  includeCompleted,
  showStatusDescription = true,
  groupBy,
}: {
  statuses?: string[]
  fullWidth?: boolean
  title?: string
  status?: string
  projectId?: string
  contextId?: string
  includeCompleted?: boolean
  timeRange?: {
    from?: string
    to?: string
  }
  showStatusDescription?: boolean
  groupBy?: "project" | "context"
}) => {
  const { projects } = useProjects()
  const { contexts } = useContexts()

  const statusOptions = useMemo(
    () =>
      defaultStatuses.find(
        ({ value, slug }) => value === status || slug === status
      ),
    [status]
  )
  const projectOptions = useMemo(
    () => projects?.find(({ id }) => id === projectId),
    [projects]
  )

  const contextOptions = useMemo(
    () => contexts?.find(({ id }) => id === contextId),
    [contexts]
  )

  // add here a view
  const {
    tasks,
    isLoading: loadingGetTasks,
    refetch,
  } = useGetTasks({
    statuses: statuses
      ? statuses
      : statusOptions?.value
      ? [statusOptions?.value]
      : [],
    includeCompleted,
    projectId: projectId || "",
    contexts: contextId ? [contextId] : [],
    timeRange,
  })

  const sortedTasks = useMemo(
    () =>
      tasks?.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return dayjs(a.dueDate).diff(dayjs(b.dueDate))
        }

        if (a.dueDate) {
          return -1
        }

        if (b.dueDate) {
          return 1
        }

        return dayjs(a.createdAt).diff(dayjs(b.createdAt))
      }),
    [tasks]
  )

  useEffect(() => {
    refetch()
  }, [status])

  return (
    <div className="w-full">
      <Collapsible defaultOpen className="w-full">
        <CollapsibleTrigger className="w-full mb-2">
          <div
            className={cn("flex gap-2 w-full justify-between px-8", {
              "px-0": fullWidth,
            })}
          >
            <div className="flex-col gap-2 justify-center flex">
              <div className="flex items-center justify-start gap-2">
                {statusOptions?.icon ? (
                  <statusOptions.icon className="text-slate-950 dark:text-white h-5 w-5" />
                ) : null}
                <p className="text-lg font-semibold leading-none tracking-tight text-left">
                  {title ||
                    statusOptions?.label ||
                    projectOptions?.title ||
                    contextOptions?.title}
                </p>
              </div>
              {showStatusDescription ? (
                <p className="text-sm text-muted-foreground text-left">
                  {statusOptions?.description}
                </p>
              ) : null}
            </div>
            <div>
              <ChevronDown />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="w-full">
          {loadingGetTasks ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <Loader className="h-12 w-12" />
            </div>
          ) : (
            <div className="flex flex-col">
              {sortedTasks?.map((task) => (
                <TaskListItem task={task} key={task.id} fullWidth={fullWidth} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
