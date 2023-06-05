"use client"

import { useMemo, useState } from "react"
import { statuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"
import { CalendarIcon } from "lucide-react"

import { Task } from "@/types/task"
import { useGetInbox } from "@/hooks/tasks"

import { Color } from "./color-picker"
import { TaskDialog } from "./task-dialog"
import { DataTable } from "./ui/data-table"
import { Skeleton } from "./ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

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
    header: () => "Due Date",
  },
]

const inboxStatus = statuses.find((status) => status.value === "INBOX")
export const Inbox = () => {
  const { inbox, isLoading } = useGetInbox()
  const [open, setOpen] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<>("")

  const currentTask = useMemo(() => {
    if (!currentTaskId) return null
    return inbox?.find((task) => task.id === currentTaskId)
  }, [currentTaskId, inbox])

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Color color={inboxStatus?.color || ""} />
        <p className="text-lg font-semibold leading-none tracking-tight">
          Inbox
        </p>
      </div>

      <>
        <DataTable
          className="text-lg"
          columns={columns}
          data={inbox || []}
          onCellClick={(task) => {
            setOpen(true)
            setCurrentTaskId(task.id)
          }}
        />
        <TaskDialog
          open={open}
          task={currentTask}
          onOpenChange={() => {
            setOpen(false)
            setCurrentTaskId("")
          }}
        />
      </>
    </div>
  )
}
