"use client"

import Link from "next/link"
import { goalsStatuses } from "@/constants/statuses"
import dayjs from "dayjs"
import { Loader, MoreHorizontal } from "lucide-react"

import { GoalPreview, UpdateGoalInput } from "@/types/goal"
import { Kpi } from "@/types/kpi"
import { cn } from "@/lib/utils"
import { useDeleteGoal } from "@/hooks/goals"
import { useGetKpis } from "@/hooks/kpis"
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

export const KpiList = () => {
  const query = useGetKpis()

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {query.isLoading ? (
        <Loader />
      ) : (
        query.data?.kpis?.map((kpi) => (
          <KpiListItem key={kpi.title} kpi={kpi} />
        ))
      )}
    </ul>
  )
}

const KpiListItem = ({ kpi }: { kpi: Kpi }) => {
  const { projects } = useProjects()

  // const handleDeleteGoal = async () => {
  //   await deleteGoal({ id: goal.id })
  //   toast({
  //     title: "Goal deleted",
  //     description: "Your goal has been deleted",
  //     variant: "success",
  //   })
  // }

  // const handleUpdateGoal = async (input: UpdateGoalInput) => {
  //   await updateGoal({ id: goal.id, input })
  //   toast({
  //     title: "Goal updated",
  //     description: "Your goal has been updated",
  //     variant: "success",
  //   })
  // }

  return (
    <div
      key={kpi.title}
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">{kpi.title}</div>
      <div className="flex gap-4 flex-col mt-4">{kpi.entries[0]?.value}</div>
    </div>
  )
}
