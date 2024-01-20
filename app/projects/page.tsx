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

import { Project } from "@/types/project"
import { cn } from "@/lib/utils"
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
import { CreateProject } from "@/components/create-project"
import { DatePicker } from "@/components/date-picker"
import { ProjectsList } from "@/components/projects-list"
import { useGoals } from "@/components/providers/goals-provider"
import { useProjects } from "@/components/providers/projects-provider"
import { TaskBadge } from "@/components/task-list-item"

const desktopColumns: ColumnDef<Project>[] = [
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
      const { title, color, id } = row.original
      return (
        <Link href={`/project/${id}`}>
          <div className="flex items-center">
            <Color color={color || ""} />
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
    cell: ({ row }) => <StatusCell project={row.original} />,
  },
  {
    id: "goal",
    cell: ({ row }) => <GoalCell goalId={row.original.goalId || ""} />,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Goal
        </Button>
      )
    },
    accessorKey: "goalId",
  },
  {
    id: "due-date",

    cell: ({ row }) => <DueDateCell project={row.original} />,
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
    id: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const project = row.original

      const progressPercent =
        (project.progress.completed / project.progress.all) * 100

      return (
        <Badge className="rounded-full flex items-center justify-center text-xs">
          {progressPercent.toFixed(0)}%
        </Badge>
      )
    },
  },
]
const mobileColumns: ColumnDef<Project>[] = [
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => {
      const { title, status, color, dueDate, id } = row.original

      const selectedStatus = goalsStatuses.find(({ value }) => value === status)

      return (
        <Link href={`/project/${id}`} className="flex flex-col gap-2">
          <div className="flex items-center text-base font-semibold">
            <Color color={color || ""} />
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
  const { projects } = useProjects()

  return (
    <div className="grid gap-4 pb-8">
      <div className="flex items-center justify-between px-4">
        <h1 className="scroll-m-20 text-lg font-medium lg:text-3xl mb-4">
          Projects
        </h1>
        <CreateProject />
      </div>
      <div className="mt-4 hidden md:block">
        <Card className="mx-4 p-0">
          <CardContent className="p-0">
            {projects ? (
              <DataTable
                data={projects}
                columns={desktopColumns}
                defaultSort={[{ id: "status", desc: true }]}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 md:hidden block">
        {projects ? (
          <DataTable
            data={projects}
            columns={mobileColumns}
            defaultSort={[{ id: "status", desc: true }]}
          />
        ) : null}
      </div>
    </div>
  )
}

const GoalCell = ({ goalId }: { goalId: string }) => {
  const { goals } = useGoals()
  const goal = useMemo(
    () => goals.find((goal) => goal.id === goalId),
    [goalId, goals]
  )

  return goal ? <span className="text-md">{goal.title}</span> : null
}

const DueDateCell = ({ project }: { project: Project }) => {
  const { dueDate } = project
  const { updateProject } = useUpdateProject()

  const onChange = (value?: Date) => {
    updateProject({
      id: project.id,
      input: {
        dueDate: value?.toISOString(),
      },
    })
  }

  return (
    <div className="flex items-center justify-center">
      <DatePicker
        value={project?.dueDate ? new Date(project?.dueDate) : undefined}
        onChange={onChange}
        variant="ghost"
      />
    </div>
  )
}

const StatusCell = ({ project }: { project: Project }) => {
  const { status, id } = project
  const selectedStatus = goalsStatuses.find(({ value }) => value === status)
  const { updateProject } = useUpdateProject()

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

          updateProject({
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
