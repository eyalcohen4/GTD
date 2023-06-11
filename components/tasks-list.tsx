"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { statuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { ChevronDown, Loader } from "lucide-react"

import { Task } from "@/types/task"
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
  status,
  projectId,
  contextId,
}: {
  status?: string
  projectId?: string
  contextId?: string
}) => {
  const { projects } = useProjects()
  const { contexts } = useContexts()

  const statusOptions = useMemo(
    () =>
      statuses.find(({ value, slug }) => value === status || slug === status),
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
    status: statusOptions?.value || "",
    projectId: projectId || "",
    contextId: contextId || "",
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
    <div>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full">
          <div className="mb-4 flex gap-2 w-full justify-between px-8">
            <div className="flex-col gap-2 justify-center flex">
              <div className="flex items-center justify-start gap-2">
                {statusOptions ? (
                  <statusOptions.icon className="text-slate-950 dark:text-white h-5 w-5" />
                ) : null}
                <p className="text-lg font-semibold leading-none tracking-tight text-left">
                  {statusOptions?.label || projectOptions?.title}
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                {statusOptions?.description}
              </p>
            </div>
            <div>
              <ChevronDown />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {loadingGetTasks ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <Loader className="h-12 w-12" />
            </div>
          ) : (
            <div className="flex flex-col">
              {sortedTasks?.map((task) => (
                <TaskListItem task={task} key={task.id} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
