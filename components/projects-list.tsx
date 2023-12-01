"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { updateProject } from "@/backend/project"
import { goalsStatuses } from "@/constants/statuses"
import dayjs from "dayjs"
import {
  Calendar,
  Check,
  FastForward,
  Hourglass,
  Inbox,
  Loader,
  MoreHorizontal,
} from "lucide-react"

import { GoalPreview, UpdateGoalInput } from "@/types/goal"
import { Project, UpdateProjectInput } from "@/types/project"
import { cn } from "@/lib/utils"
import { useDeleteGoal } from "@/hooks/goals"
import { useDeleteProject, useUpdateProject } from "@/hooks/projects"
import { toast } from "@/hooks/use-toast"

import { ComboboxPopover } from "./combobox"
import { DatePicker } from "./date-picker"
import { useGoals } from "./providers/goals-provider"
import { useProjects } from "./providers/projects-provider"
import { Card, CardTitle } from "./ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export const ProjectsList = () => {
  const { projects, loadingGetProjects } = useProjects()

  const sorted = projects?.sort((a, b) => {
    const statusA = goalsStatuses.find((status) => status.value === a.status)
    const statusB = goalsStatuses.find((status) => status.value === b.status)

    if (statusA?.order && statusB?.order) {
      return statusA.order > statusB.order ? 1 : -1
    }

    return 0
  })

  return (
    <ul role="list" className="flex flex-col">
      {loadingGetProjects ? (
        <Loader className="animate-spin" />
      ) : (
        sorted?.map((project) => <ProjectListItem project={project} />)
      )}
    </ul>
  )
}

const ProjectListItem = ({ project }: { project: Project }) => {
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

  const handleUpdateProject = async (input: UpdateProjectInput) => {
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
    <Link
      href={`/project/${project.id}`}
      className="h-[50px] task-list-item block"
    >
      <div className="border-b hover:bg-slate-200 dark:hover:bg-slate-900 h-full px-8">
        <div className={cn("flex items-center justify-between h-full gap-4")}>
          <div className="flex gap-4 items-center max-w-full">
            {project.title}
          </div>

          <div className="w-full flex-1 justify-end hidden md:flex">
            <div className="flex gap-4 items-center text-sm">
              {project?.status ? (
                <Badge>
                  <span
                    className="flex items-center gap"
                    style={{
                      color: selectedStatus?.color || "",
                    }}
                  >
                    {selectedStatus?.icon ? (
                      <selectedStatus.icon className={cn("mr-2 h-4 w-4")} />
                    ) : null}
                    {selectedStatus?.label || ""}
                  </span>
                </Badge>
              ) : null}
              {project.dueDate ? (
                <>
                  <Badge>
                    <Calendar className="h-4 w-4" />
                    <p>{dayjs(project.dueDate).format("D MMM")}</p>
                  </Badge>
                </>
              ) : null}
              <Badge>
                <div className="flex items-center gap-2">
                  {project?.progress?.completed}
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  {project?.progress?.inbox}
                  <Inbox className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  {project?.progress?.nextAction}
                  <FastForward className="h-4 w-4" />
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const Badge = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border rounded-md h-full flex items-center gap-2 px-2 py-1 text-xs">
      {children}
    </div>
  )
}

const ProjectListItemDates = ({ project }: { project: Project }) => {
  const { updateProject } = useUpdateProject()
  const difference = dayjs(project.dueDate).diff(dayjs(), "day")
  const diffCopy =
    difference > 0
      ? `${difference} days left`
      : `${Math.abs(difference)} days overdue`
  const color = difference > 0 ? "text-green-800" : "text-red-800"

  const handleUpdateProject = async (input: UpdateProjectInput) => {
    await updateProject({ id: project.id, input })
    toast({
      title: "Project updated",
      description: "Your project has been updated",
      variant: "success",
    })
  }

  return (
    <div className="flex md:items-center justify-between flex-col md:flex-row">
      <div>
        <DatePicker
          value={project?.dueDate ? new Date(project?.dueDate) : undefined}
          onChange={(value) => {
            handleUpdateProject({
              dueDate: value?.toISOString(),
            })
          }}
        />
      </div>
      <p className={cn(color, "mt-1")}>{diffCopy}</p>
    </div>
  )
}

/** 
 * 
 * <div
      key={project.title}
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
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
        <div className="my-2">
          <ProjectListItemDates project={project} />
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
 * 
*/
