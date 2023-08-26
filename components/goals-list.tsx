"use client"

import Link from "next/link"
import { goalsStatuses } from "@/constants/statuses"
import dayjs from "dayjs"
import { Loader, MoreHorizontal } from "lucide-react"

import { GoalPreview, UpdateGoalInput } from "@/types/goal"
import { cn } from "@/lib/utils"
import { useDeleteGoal } from "@/hooks/goals"
import { toast } from "@/hooks/use-toast"

import { ComboboxPopover } from "./combobox"
import { DatePicker } from "./date-picker"
import { useGoals } from "./providers/goals-provider"
import { useProjects } from "./providers/projects-provider"
import { Badge } from "./ui/badge"
import { Card, CardTitle } from "./ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Progress } from "./ui/progress"

export const GoalsList = () => {
  const { goals, loadingGetGoals } = useGoals()

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {loadingGetGoals ? (
        <Loader />
      ) : (
        goals?.map((goal) => <GoalListItem goal={goal} />)
      )}
    </ul>
  )
}

const GoalListItem = ({ goal }: { goal: GoalPreview }) => {
  const { projects } = useProjects()
  const { deleteGoal } = useDeleteGoal()
  const { updateGoal } = useGoals()

  const handleDeleteGoal = async () => {
    await deleteGoal({ id: goal.id })
    toast({
      title: "Goal deleted",
      description: "Your goal has been deleted",
      variant: "success",
    })
  }

  const handleUpdateGoal = async (input: UpdateGoalInput) => {
    await updateGoal({ id: goal.id, input })
    toast({
      title: "Goal updated",
      description: "Your goal has been updated",
      variant: "success",
    })
  }

  const selectedStatus = goalsStatuses.find(
    (status) => status.value === goal.status
  )

  return (
    <div
      key={goal.title}
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Link href={`/goal/${goal.id}`} className="text-lg">
          {goal.title}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={handleDeleteGoal}
              className="cursor-pointer"
            >
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-4 flex-col mt-4">
        <div onClick={(e) => e.preventDefault}>
          <ComboboxPopover
            matchContainerSize
            type="status"
            items={goalsStatuses}
            value={selectedStatus}
            name="Status"
            iconWithColor
            onChange={(option) => {
              if (Array.isArray(option)) {
                return
              }

              // @ts-ignore
              handleUpdateGoal({ status: option?.value || "NOT_STARTED" })
            }}
          />
        </div>
        <GoalListItemDates goal={goal} />
      </div>
      <div>
        <div className="flex gap-2">
          {goal.projects?.map((project) => {
            const projectData = projects?.find(
              (projectData) => projectData.id === project
            )

            return (
              <Card key={projectData?.id}>
                <CardTitle>{projectData?.title}</CardTitle>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const GoalListItemDates = ({ goal }: { goal: GoalPreview }) => {
  const { updateGoal } = useGoals()
  const difference = dayjs(goal.dueDate).diff(dayjs(), "day")
  const diffCopy =
    difference > 0
      ? `${difference} days left`
      : `${Math.abs(difference)} days overdue`
  const color = difference > 0 ? "text-green-800" : "text-red-800"

  const handleUpdateGoal = async (input: UpdateGoalInput) => {
    await updateGoal({ id: goal.id, input })
    toast({
      title: "Goal updated",
      description: "Your goal has been updated",
      variant: "success",
    })
  }

  return (
    <div className="flex md:items-center justify-between flex-col lg:flex-row">
      <div>
        <DatePicker
          value={goal?.dueDate ? new Date(goal?.dueDate) : undefined}
          onChange={(value) => {
            handleUpdateGoal({
              dueDate: value?.toISOString(),
            })
          }}
        />
      </div>
      {goal?.dueDate && <p className={cn(color, "mt-1")}>{diffCopy}</p>}
    </div>
  )
}
