"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { CalendarIcon } from "lucide-react"

import { Task } from "@/types/task"
import { useGetInbox } from "@/hooks/tasks"

import { TaskDialog } from "./task-dialog"
import { DataTable } from "./ui/data-table"
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

export const Inbox = () => {
  const { inbox, isLoading } = useGetInbox()
  const [open, setOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  return isLoading ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>title</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>loading...</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : (
    <>
      <DataTable
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
  )
}
