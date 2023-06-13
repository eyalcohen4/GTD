"use client"

import { useContext, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { updateProject } from "@/backend/project"
import { StatusConfig, statuses } from "@/constants/statuses"
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

import { Project, ProjectInput, UpdateProjectInput } from "@/types/project"
import { TaskPreview } from "@/types/task"
import {
  useDeleteProject,
  useGetProject,
  useUpdateProject,
} from "@/hooks/projects"
import { useGetTasks } from "@/hooks/tasks"
import useDebounce from "@/hooks/use-debounce"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { SelectSeparator } from "@/components/ui/select"
import { Separator } from "@/components/ui/seperator"
import { Skeleton } from "@/components/ui/skeleton"
import { Color, ColorPicker } from "@/components/color-picker"
import { ComboboxPopover, Option } from "@/components/combobox"
import { DatePicker } from "@/components/date-picker"
import { Editor } from "@/components/editor"
import { Filter } from "@/components/filter"
import {
  FormProperty,
  FormPropertyLabel,
  FormPropertyValue,
} from "@/components/form-properties"
import { useContexts } from "@/components/providers/contexts-provider"
import { useProjects } from "@/components/providers/projects-provider"
import { TaskListItem } from "@/components/task-list-item"
import { TasksList } from "@/components/tasks-list"

export default function ProjectPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { isLoading, project } = useGetProject(id)

  return (
    <div className="flex flex-col gap-12">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8" />
        </div>
      ) : (
        <>
          <ProjectHeader project={project} />
          <div className="flex flex-col gap-4">
            <ProjectTasks project={project} />
          </div>
        </>
      )}
    </div>
  )
}

const ProjectTasks = ({ project }: { project: Project }) => {
  const { contexts } = useContexts()
  const defaultStatusFilter = useMemo(
    () =>
      statuses
        .map(({ color, ...rest }) => rest)
        .filter(({ value }) => value !== "ARCHIVE"),
    []
  )
  const [statusFilter, setStatusFilter] =
    useState<Option[]>(defaultStatusFilter)
  const [contextFilter, setContextFilter] = useState<Option[]>([])

  const contextsOptions = useMemo(
    () =>
      contexts?.map((context) => ({
        value: context.id,
        label: context.title,
        color: context.color,
      })),
    [contexts]
  )

  const handleChangeStatusFilter = (values: Option[]) => {
    setStatusFilter(values)
  }

  const handleChangeContextFilter = (values: Option[]) => {
    setContextFilter(values)
  }

  const statusOptions = statuses.map(({ color, ...rest }) => rest)

  return (
    <div>
      <div className="md:px-8 px-4 flex gap-4 items-center mb-2 overflow-scroll">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Tasks
        </h3>
        <Filter
          title="Status"
          selectedOptions={statusFilter}
          options={statusOptions}
          onChange={handleChangeStatusFilter}
        />
        {/*
        <Filter
          title="Context"
          selectedOptions={contextFilter}
          options={contextsOptions}
          onChange={handleChangeContextFilter}
        /> */}
        {statusFilter?.length || contextFilter?.length ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter([])
              setContextFilter([])
            }}
          >
            <X />
            <span>Reset</span>
          </Button>
        ) : null}
      </div>
      <div>
        <ProjectTasksList
          id={project?.id}
          statuses={statusFilter?.map((status) => status.value)}
          contexts={contextFilter?.map((context) => context.value)}
        />
      </div>
    </div>
  )
}

const ProjectTasksList = ({
  id,
  statuses: statusesFilter,
  contexts,
}: {
  id: string
  statuses?: string[]
  contexts?: string[]
}) => {
  const { isLoading, tasks } = useGetTasks({
    projectId: id,
    statuses: statusesFilter,
  })

  const tasksGroupedByStatus = useMemo(() => {
    if (!tasks) {
      return []
    }

    const grouped = tasks.reduce((acc, task) => {
      const status = task.status || "INBOX"
      const statusOption = statuses.find(
        ({ value }) => value === status
      ) as StatusConfig
      const statusGroup = acc.find(
        (item) => item?.status?.label === statusOption?.label
      )

      if (!statusGroup) {
        acc.push({
          status: statusOption,
          tasks: [task],
        })
      }

      statusGroup?.tasks?.push(task)

      return acc
    }, [] as Array<{ status: StatusConfig; tasks: TaskPreview[] }>)

    return grouped
  }, [tasks])

  const sortedTasksGroupedByStatus = useMemo(() => {
    if (!tasksGroupedByStatus) {
      return []
    }

    return tasksGroupedByStatus.sort((a, b) => {
      const aOrder = a.status.order
      const bOrder = b.status.order

      if (aOrder && bOrder) {
        return aOrder - bOrder
      }

      return 0
    })
  }, [tasksGroupedByStatus])

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <Loader className="h-12 w-12" />
      </div>
    )
  }

  if (!isLoading && !tasks?.length) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="w-3/4 m-auto text-center">
          No tasks for the current filter. <br />
          try change filter or add a task from the top bar
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {sortedTasksGroupedByStatus?.map(({ status, tasks }) => (
        <TaskGroup status={status} tasks={tasks} />
      ))}
    </div>
  )
}

const TaskGroup = ({
  status,
  tasks,
}: {
  status: StatusConfig
  tasks: TaskPreview[]
}) => {
  return (
    <div key={status.label} className="flex flex-col">
      <Collapsible>
        <CollapsibleTrigger className="h-[40px] w-full">
          <div className="flex h-[40px] px-4 md:px-8 items-center justify-between bg-secondary w-full">
            <div className="flex gap-2 items-center">
              {status?.icon ? <status.icon /> : null}
              <h3 className="text-md font-semibold tracking-tight">
                {status.label}
              </h3>
            </div>
            <ChevronDown />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="h-full">
          {tasks.map((task) => (
            <TaskListItem task={task} key={task.id} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

const ProjectHeader = ({ project }: { project: Project }) => {
  const { updateProject } = useUpdateProject()
  const { deleteProject } = useDeleteProject()
  const [title, setTitle] = useState(project?.title || "")
  const router = useRouter()

  const debouncedUpdateProject = useDebounce((input: UpdateProjectInput) => {
    handleUpdateProject(input)
  }, 1000)

  const handleUpdateProject = (input: Omit<UpdateProjectInput, "id">) => {
    updateProject({ id: project.id || "", input })
  }

  const handleDeleteProject = async () => {
    await deleteProject({ id: project.id })
    toast({
      title: "Project deleted",
      description: `Project ${project.title} has been deleted`,
    })
    router.push(`/`)
  }

  const progressPercentage = useMemo(() => {
    if (project?.progress?.all && project?.progress?.completed) {
      const num = (project.progress.completed / project.progress.all) * 100
      return Math.round(num)
    }
    return 0 // or any other default value you want
  }, [project])

  return (
    <div className="md:px-8 px-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <ColorPicker
              color={project?.color || ""}
              onChange={(value) => {
                handleUpdateProject({
                  color: value,
                })
              }}
            />
            <Input
              className="md:text-3xl font-bold tracking-tight border-none w-full"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                debouncedUpdateProject({ title: event.target.value })
              }}
            />
          </div>
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

        <div className="w-1/2">
          <Editor
            className="p-0"
            content={project?.content ? JSON.parse(project.content) : ""}
            onChange={(content) => {
              debouncedUpdateProject({
                content: JSON.stringify(content),
              })
            }}
          />
        </div>
        <Separator />
      </div>
      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* <div className="flex flex-col gap-2">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Goal
          </h3>
          <div className="flex flex-col gap-2">
            <ComboboxPopover />
          </div>
        </div> */}
        <div className="flex flex-col gap-2">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Due Date
          </h3>
          <div className="w-48">
            <DatePicker
              value={project?.dueDate ? new Date(project?.dueDate) : undefined}
              onChange={(value) => {
                handleUpdateProject({
                  dueDate: value?.toISOString(),
                })
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Progress
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <Progress value={progressPercentage} />
              <span className="text-lg font-medium">
                {isNaN(progressPercentage) ? 0 : progressPercentage}%
              </span>
            </div>
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
    </div>
  )
}
