"use client"

import { useState } from "react"
import { statuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"

import { Task } from "@/types/task"

import { useTasks } from "./providers/tasks-provider"
import { TaskDialog } from "./task-dialog"
import { DataTable } from "./ui/data-table"

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
  const { inbox } = useTasks()
  const [open, setOpen] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState("")

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {inboxStatus ? (
          <inboxStatus.icon className="text-slate-950 dark:text-white h-5 w-5" />
        ) : null}
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
        {open ? (
          <TaskDialog
            open={open}
            taskId={currentTaskId}
            onOpenChange={() => {
              setOpen(false)
              setCurrentTaskId(null)
            }}
          />
        ) : null}
      </>
    </div>
  )
}
