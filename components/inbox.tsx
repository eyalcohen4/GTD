"use client"

import { useMemo, useState } from "react"
import { statuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"
import { format, formatRelative, subDays } from "date-fns"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { Task } from "@/types/task"

import { useContexts } from "./providers/contexts-provider"
import { useProjects } from "./providers/projects-provider"
import { useTasks } from "./providers/tasks-provider"
import { TaskDialog } from "./task-dialog"
import { DataTable } from "./ui/data-table"

dayjs.extend(relativeTime)

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "contexts",
    header: "Contexts",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
]

const inboxStatus = statuses.find((status) => status.value === "INBOX")
export const Inbox = () => {
  const { inbox } = useTasks()
  const [open, setOpen] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState("")
  const { contexts } = useContexts()
  const { projects } = useProjects()

  const formattedInbox = useMemo(
    () =>
      inbox?.map((task) => {
        const taskContextsIds = task.contexts?.map(
          (taskContext) => taskContext.id
        )

        const formattedContexts = contexts
          ?.filter(({ id }) => taskContextsIds?.includes(id))
          .map(({ title }) => title)

        const project = projects?.find(({ id }) => task.projectId === id)
        return {
          ...task,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : null,
          contexts: formattedContexts,
          project: project?.title,
          createdAt: dayjs(task.createdAt).fromNow(),
        }
      }),
    [inbox]
  )

  return (
    <div>
      <div className="mb-4 flex justify-center gap-2 flex-col">
        <div className="flex items-center gap-2">
          {inboxStatus ? (
            <inboxStatus.icon className="text-slate-950 dark:text-white h-5 w-5" />
          ) : null}
          <p className="text-lg font-semibold leading-none tracking-tight">
            Inbox
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Here you can find everything you captured
        </p>
      </div>
      <>
        <DataTable
          className="text-lg"
          columns={columns}
          data={formattedInbox || []}
          onCellClick={(task) => {
            setOpen(true)
            setCurrentTaskId(task.id)
          }}
        />
        {open ? (
          <TaskDialog
            open={open}
            taskId={currentTaskId}
            onOpenChange={() => {
              setOpen(false)
              setCurrentTaskId("")
            }}
          />
        ) : null}
      </>
    </div>
  )
}
