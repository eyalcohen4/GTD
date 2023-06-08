"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { statuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { ChevronDownIcon } from "lucide-react"

import { Task } from "@/types/task"
import { useGetTasks, useUpdateTask } from "@/hooks/tasks"
import { DataTable } from "@/components/ui/data-table"

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
}: {
  status?: string
  projectId?: string
}) => {
  const router = useRouter()
  const statusOptions = useMemo(
    () =>
      statuses.find(({ value, slug }) => value === status || slug === status),
    [status]
  )
  const {
    tasks,
    isLoading: loadingGetTasks,
    refetch,
  } = useGetTasks({
    status: statusOptions?.value || "",
    projectId: projectId || "",
  })

  useEffect(() => {
    refetch()
  }, [status])
  const { updateTask } = useUpdateTask()

  const formattedInbox = useMemo(
    () =>
      tasks?.map((task) => {
        return {
          ...task,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : undefined,
          createdAt: dayjs(task.createdAt).fromNow(),
        }
      }),
    [tasks]
  )

  const handleCellClick = (task: Task) => {
    router.push(`/task/${task.id}`)
  }

  return (
    <div>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full">
          <div className="mb-4 flex gap-2 w-full justify-between">
            <div className="flex-col gap-2 justify-center flex">
              <div className="flex items-center justify-start gap-2">
                {statusOptions ? (
                  <statusOptions.icon className="text-slate-950 dark:text-white h-5 w-5" />
                ) : null}
                <p className="text-lg font-semibold leading-none tracking-tight text-left">
                  {statusOptions?.label}
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                {statusOptions?.description}
              </p>
            </div>
            <div>
              <ChevronDownIcon />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <DataTable
            className="text-lg"
            columns={columns}
            data={formattedInbox || []}
            onCheck={(task) => {
              updateTask({
                id: task.id,
                input: {
                  completed: true,
                },
              })
            }}
            onCellClick={handleCellClick}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
