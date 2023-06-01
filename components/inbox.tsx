"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Task } from "@/types/task"
import { useGetInbox } from "@/hooks/tasks"

import { DataTable } from "./ui/data-table"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "title",
  },
]

export const Inbox = () => {
  const { inbox } = useGetInbox()
  console.log(inbox)
  return (
    <div>
      <h1>Inbox</h1>
      <div>{inbox ? <DataTable columns={columns} data={inbox} /> : null}</div>
    </div>
  )
}
