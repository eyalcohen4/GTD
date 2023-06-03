"use client"

import { useState } from "react"
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
    header: "@ Contexts",
  },
  {
    accessorKey: "dueDate",
    header: () => <CalendarIcon />,
  },
]

const inboxStatus = statuses.find((status) => status.value === "INBOX")
export const Inbox = () => {
  const { inbox, isLoading } = useGetInbox()
  const [open, setOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Color color={inboxStatus?.color || ""} />
        <p className="text-lg font-semibold leading-none tracking-tight">
          Inbox
        </p>
      </div>
      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Contexts</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <>
          <DataTable
            className="text-lg"
            columns={columns}
            data={inbox || []}
            onCellClick={(task) => {
              setOpen(true)
              setCurrentTask(task)
            }}
          />
          <TaskDialog
            open={open}
            task={currentTask}
            onOpenChange={() => {
              setOpen(false)
              setCurrentTask(null)
            }}
          />
        </>
      )}
    </div>
  )
}
