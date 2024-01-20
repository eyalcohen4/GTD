"use client"

import { useMemo } from "react"
import Link from "next/link"
import { getProjects } from "@/backend/project"
import { goalsStatuses, statuses } from "@/constants/statuses"
import { ColumnDef } from "@tanstack/react-table"
import { id } from "date-fns/locale"
import dayjs from "dayjs"
import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Check,
  FastForward,
  Inbox,
} from "lucide-react"

import { Goal, GoalPreview } from "@/types/goal"
import { Project } from "@/types/project"
import { cn } from "@/lib/utils"
import { useUpdateGoal } from "@/hooks/goals"
import { useUpdateProject } from "@/hooks/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/seperator"
import { Color } from "@/components/color-picker"
import { ComboboxPopover } from "@/components/combobox"
import { CreateGoal } from "@/components/create-goal"
import { CreateProject } from "@/components/create-project"
import { DatePicker } from "@/components/date-picker"
import { ProjectsList } from "@/components/projects-list"
import { useGoals } from "@/components/providers/goals-provider"
import { useProjects } from "@/components/providers/projects-provider"
import { TaskBadge } from "@/components/task-list-item"

const desktopColumns: ColumnDef<GoalPreview>[] = [
  {
    id: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
        </Button>
      )
    },
    accessorKey: "title",
    cell: ({ row }) => {
      const { title, id } = row.original
      return (
        <Link href={`/goal/${id}`}>
          <div className="flex items-center">
            <span className="ml-2">{title}</span>
          </div>
        </Link>
      )
    },
  },
  {
    id: "status",
    accessorKey: "status",
    sortingFn: (rowA, rowB, columnId) => {
      const aStatusOrder =
        goalsStatuses.find(({ value }) => value === rowA.getValue(columnId))
          ?.order || 0
      const bStatusOrder =
        goalsStatuses.find(({ value }) => value === rowB.getValue(columnId))
          ?.order || 0

      return aStatusOrder < bStatusOrder
        ? 1
        : aStatusOrder > bStatusOrder
        ? -1
        : 0
    },
    header: ({ column }) => {
      console.log(column.getCanSort())
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
        </Button>
      )
    },
    cell: ({ row }) => <StatusCell goal={row.original} />,
  },

  {
    id: "due-date",
    cell: ({ row }) => <DueDateCell goal={row.original} />,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Target Date
        </Button>
      )
    },
    accessorKey: "dueDate",
  },
  {
    id: "time-left",
    cell: ({ row }) => {
      if (!row.original.dueDate) {
        return
      }

      const difference = dayjs(row.original.dueDate).diff(dayjs(), "day")
      const diffCopy =
        difference > 0
          ? `${difference} days left`
          : `${Math.abs(difference)} days overdue`
      const color = difference > 0 ? "text-green-800" : "text-red-800"

      return (
        <div className="flex flex-col gap-0.5 items-start text-left">
          {row.original.dueDate && (
            <p className={cn(color, "mt-1")}>{diffCopy}</p>
          )}
        </div>
      )
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Target Date
        </Button>
      )
    },
    accessorKey: "dueDate",
  },
]
const mobileColumns: ColumnDef<GoalPreview>[] = [
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => {
      const { title, status, dueDate, id } = row.original

      const selectedStatus = goalsStatuses.find(({ value }) => value === status)

      return (
        <Link href={`/project/${id}`} className="flex flex-col gap-2">
          <div className="flex items-center text-base font-semibold">
            <span className="ml-2">{title}</span>
          </div>
          {status ? (
            <span
              className="gap flex items-center"
              style={{
                color: selectedStatus?.color || "",
              }}
            >
              {selectedStatus?.icon ? (
                <selectedStatus.icon className={cn("mr-2 h-4 w-4")} />
              ) : null}
              {selectedStatus?.label || ""}
            </span>
          ) : null}
        </Link>
      )
    },
  },
]
export default function Projects() {
  const { goals } = useGoals()

  return (
    <div className="grid gap-4 pb-8">
      <div className="flex items-center justify-between px-4">
        <h1 className="scroll-m-20 text-lg font-medium lg:text-3xl mb-4">
          Goals
        </h1>
        <CreateGoal />
      </div>
      <div className="mt-4 hidden md:block">
        <Card className="mx-4 p-0">
          <CardContent className="p-0">
            {goals ? (
              <DataTable
                data={goals}
                columns={desktopColumns}
                defaultSort={[{ id: "status", desc: true }]}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 md:hidden block">
        {goals ? (
          <DataTable
            data={goals}
            columns={mobileColumns}
            defaultSort={[{ id: "status", desc: true }]}
          />
        ) : null}
      </div>
    </div>
  )
}

const DueDateCell = ({ goal }: { goal: GoalPreview }) => {
  const { updateGoal } = useUpdateGoal()

  const onChange = (value?: Date) => {
    updateGoal({
      id: goal.id,
      input: {
        dueDate: value?.toISOString(),
      },
    })
  }

  return (
    <div className="flex flex-col gap-0.5 items-start text-left">
      <DatePicker
        value={goal?.dueDate ? new Date(goal?.dueDate) : undefined}
        onChange={onChange}
        variant="ghost"
      />
    </div>
  )
}

export const StatusCell = ({ goal }: { goal: GoalPreview }) => {
  const { status, id } = goal
  const selectedStatus = goalsStatuses.find(({ value }) => value === status)
  const { updateGoal } = useUpdateGoal()

  return (
    <div className="flex items-center">
      <ComboboxPopover
        variant="ghost"
        matchContainerSize
        type="status"
        items={goalsStatuses}
        value={selectedStatus}
        name="Status"
        onChange={(option) => {
          if (Array.isArray(option)) {
            return
          }

          updateGoal({
            id,
            input: {
              // @ts-ignore
              status: option?.value || "NOT_STARTED",
            },
          })
        }}
      />
    </div>
  )
}
