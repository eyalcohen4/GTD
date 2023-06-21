"use client"

import Link from "next/link"
import { updateProject } from "@/backend/project"
import { goalsStatuses } from "@/constants/statuses"
import dayjs from "dayjs"
import {
  Check,
  FastForward,
  Hourglass,
  Inbox,
  Loader,
  MoreHorizontal,
} from "lucide-react"

import { GoalPreview, UpdateGoalInput } from "@/types/goal"
import { Project } from "@/types/project"
import { cn } from "@/lib/utils"
import { useDeleteGoal } from "@/hooks/goals"
import { useDeleteProject, useUpdateProject } from "@/hooks/projects"
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

export const ProjectsList = () => {
  const { projects, loadingGetProjects } = useProjects()

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {loadingGetProjects ? (
        <Loader className="animate-spin" />
      ) : (
        projects?.map((project) => <GoalListItem project={project} />)
      )}
    </ul>
  )
}

const GoalListItem = ({ project }: { project: Project }) => {
  const { projects } = useProjects()
  const { deleteProject } = useDeleteProject()
  const { updateProject } = useUpdateProject()

  const handleDeleteProject = async () => {
    await deleteProject({ id: project.id })
    toast({
      title: "Project deleted",
      description: "Your project has been deleted",
      variant: "success",
    })
  }

  const handleUpdateProject = async (input: UpdateGoalInput) => {
    await updateProject({ id: project.id, input })
    toast({
      title: "Project updated",
      description: "Your goal has been updated",
      variant: "success",
    })
  }

  const selectedStatus = goalsStatuses.find(
    (status) => status.value === project.status
  )

  return (
    <div
      key={project.title}
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Link href={`/project/${project.id}`} className="text-lg">
          {project.title}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={handleDeleteProject}
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
              handleUpdateProject({ status: option?.value || "NOT_STARTED" })
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            <Badge className="flex gap-2">
              <span>Tasks</span>
              {project?.progress?.all}
            </Badge>
            <Badge className="flex gap-2">
              <Check className="h-4 w-4" />
              {project?.progress?.completed}
            </Badge>
            <Badge className="flex gap-2">
              <Inbox className="h-4 w-4" />
              {project?.progress?.inbox}
            </Badge>
            <Badge className="flex gap-2">
              <Hourglass className="h-4 w-4" />
              {project?.progress?.waitingFor}
            </Badge>
            <Badge className="flex gap-2">
              <FastForward className="h-4 w-4" />
              {project?.progress?.nextAction}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
