"use client"

import { useContext, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateGoal } from "@/backend/goal"
import { goalsStatuses } from "@/constants/statuses"
import dayjs from "dayjs"
import {
  Check,
  ChevronDown,
  FastForward,
  Hourglass,
  Inbox,
  Loader,
  MoreHorizontal,
  SeparatorVertical,
  X,
} from "lucide-react"

import { Goal, GoalInput, UpdateGoalInput } from "@/types/goal"
import { Project } from "@/types/project"
import { TaskPreview } from "@/types/task"
import { useDeleteGoal, useGetGoal, useUpdateGoal } from "@/hooks/goals"
import { useGetTasks } from "@/hooks/tasks"
import useDebounce from "@/hooks/use-debounce"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/seperator"
import { Skeleton } from "@/components/ui/skeleton"
import { Color, ColorPicker } from "@/components/color-picker"
import { ComboboxPopover } from "@/components/combobox"
import { DatePicker } from "@/components/date-picker"
import { Editor } from "@/components/editor"
import { FormProperty } from "@/components/form-properties"
import { useProjects } from "@/components/providers/projects-provider"
import { TaskListItem } from "@/components/task-list-item"
import { TasksList } from "@/components/tasks-list"
import { TimeLeft } from "@/components/time-left"

export default function GoalPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { isLoading, goal } = useGetGoal(id)

  return (
    <div className="flex flex-col gap-12">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8" />
        </div>
      ) : goal ? (
        <GoalHeader goal={goal} />
      ) : null}
      <div>
        <Projects />
      </div>
    </div>
  )
}

const Projects = () => {
  const { projects } = useProjects()
  const goalProjects = projects?.filter((project) => project.goalId)

  return (
    <div className="md:px-8 px-4 flex flex-col gap-4 mb-2 overflow-scroll">
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Projects
      </h3>

      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {goalProjects?.map((project) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <Link href={`/project/${project.id}`} className="text-lg">
              {project.title}
            </Link>
          </div>
        ))}
      </ul>
    </div>
  )
}

const GoalHeader = ({ goal }: { goal: Goal }) => {
  const { updateGoal } = useUpdateGoal()
  const { deleteGoal } = useDeleteGoal()
  const [title, setTitle] = useState(goal?.title || "")
  const router = useRouter()

  const debouncedUpdateGoal = useDebounce((input: UpdateGoalInput) => {
    handleUpdateGoal(input)
  }, 1000)

  const handleUpdateGoal = (input: Omit<UpdateGoalInput, "id">) => {
    updateGoal({ id: goal.id || "", input })
  }

  const handleDeleteProject = async () => {
    await deleteGoal({ id: goal.id })
    toast({
      title: "Project deleted",
      description: `Project ${goal.title} has been deleted`,
    })
    router.push(`/`)
  }

  const selectedStatus = useMemo(() => {
    return goalsStatuses.find((status) => status.value === goal?.status)
  }, [goal])

  return (
    <div className="md:px-8 px-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="md:text-3xl font-bold tracking-tight border-none w-full p-0"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              debouncedUpdateGoal({ title: event.target.value })
            }}
          />
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={handleDeleteProject}
                  className="cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />
      </div>
      <div className="w-full flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-2 w-full">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Due Date
          </h3>
          <div className="w-full">
            <DatePicker
              value={goal?.dueDate ? new Date(goal?.dueDate) : undefined}
              onChange={(value) => {
                handleUpdateGoal({
                  dueDate: value?.toISOString(),
                })
              }}
            />
            <TimeLeft date={goal?.dueDate} />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Status
          </h3>
          <div className="w-full">
            <ComboboxPopover
              matchContainerSize
              type="status"
              items={goalsStatuses}
              value={selectedStatus}
              name="Status"
              onChange={(option) => {
                if (Array.isArray(option)) {
                  return
                }

                // @ts-ignore
                handleUpdateGoal({ status: option?.value || "NOT_STARTED" })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
