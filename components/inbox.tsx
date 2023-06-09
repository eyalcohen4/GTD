"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { statuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { Task } from "@/types/task"
import { useGetTasks, useUpdateTask } from "@/hooks/tasks"

import { useContexts } from "./providers/contexts-provider"
import { useProjects } from "./providers/projects-provider"
import { DataTable } from "./ui/data-table"

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

const inboxStatus = statuses.find((status) => status.value === "INBOX")
export const Inbox = () => {
  const router = useRouter()
  // const { inbox, updateTask } = useTasks()
  const { tasks, isLoading: loadingGetTasks } = useGetTasks({
    status: "INBOX",
  })
  const { updateTask } = useUpdateTask()
  const { contexts } = useContexts()
  const { projects } = useProjects()

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
    [tasks, projects, contexts]
  )

  const handleCellClick = (task: Task) => {
    router.push(`/task/${task.id}`)
  }

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
        rowCta="Process"
      />
    </div>
  )
}
