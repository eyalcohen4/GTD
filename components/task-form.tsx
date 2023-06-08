"use client"

import { ReactNode, useCallback, useMemo, useState } from "react"
import { statuses } from "@/constants/statuses"
import { OnChangeJSON, ThemeProvider } from "@remirror/react"
import { WysiwygEditor } from "@remirror/react-editors/wysiwyg"
import { BoxIcon, CalendarIcon, Flower2Icon, LocateIcon } from "lucide-react"

import { Task, UpdateTaskInput } from "@/types/task"
import useDebounce from "@/hooks/use-debounce"
import { Separator } from "@/components/ui/seperator"

import "remirror/styles/all.css"
import { useTheme } from "next-themes"
import { RemirrorJSON } from "remirror"

import { useGetTask } from "@/hooks/tasks"
import { Checkbox } from "@/components/ui/checkbox"
import { useTasks } from "@/components/providers/tasks-provider"

import { ComboboxPopover } from "./combobox"
import { DatePicker } from "./date-picker"
import { Editor } from "./editor"
import { useContexts } from "./providers/contexts-provider"
import { useProjects } from "./providers/projects-provider"

export const TaskForm = ({ task }: { task: Task }) => {
  const { updateTask } = useTasks()
  const { projects } = useProjects()
  const { contexts } = useContexts()

  const [title, setTitle] = useState(task?.title || "")

  const handleChangeContent = (content: Record<string, any>) => {
    debouncedUpdateTask({
      content: JSON.stringify(content),
    })
  }

  const debouncedUpdateTask = useDebounce((input) => {
    handleUpdateTask(input)
  }, 1000)

  const projectsOptions = useMemo(
    () =>
      projects?.map((project) => ({
        value: project.id,
        label: project.title,
        color: project.color,
      })),
    [projects]
  )

  const contextsOptions = useMemo(
    () =>
      contexts?.map((context) => ({
        value: context.id,
        label: context.title,
        color: context.color,
      })),
    [contexts]
  )

  const handleUpdateTask = (input: UpdateTaskInput) => {
    updateTask({ id: task.id || "", input })
  }

  const selectedStatus = () =>
    statuses.find(({ value }) => value === task?.status)

  const selectedProject = useMemo(
    () => projectsOptions?.find(({ value }) => value === task?.projectId),
    [projectsOptions, task]
  )
  const selectedContext = useMemo(() => {
    return contextsOptions?.filter(({ value }) => {
      return task?.contexts?.includes(value)
    })
  }, [contextsOptions, task])

  const handleChangeTitle = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value)
    debouncedUpdateTask({ title: e.target.value })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-4">
          <Checkbox
            className="h-6 w-6"
            circle
            onCheckedChange={(value) => {
              handleUpdateTask({ completed: value as boolean })
            }}
            checked={task?.completed}
          />
          <textarea
            className="w-full border-0 h-8 bg-transparent border-transparent text-2xl text-slate-900 dark:text-slate-100 font-medium"
            placeholder={title || "Task Title"}
            value={title}
            onChange={handleChangeTitle}
          />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 dark:text-white">
          <TaskProperty>
            <TaskPropertyLabel label="Status" icon={<BoxIcon />} />
            <TaskPropertyValue>
              <ComboboxPopover
                matchContainerSize
                type="status"
                items={statuses}
                value={selectedStatus}
                name="Status"
                onChange={(value) => {
                  handleUpdateTask({ status: value?.value })
                }}
              />
            </TaskPropertyValue>
          </TaskProperty>
          <TaskProperty>
            <TaskPropertyLabel label="Project" icon={<Flower2Icon />} />
            <TaskPropertyValue>
              <ComboboxPopover
                matchContainerSize
                items={projectsOptions}
                type="project"
                name="Project"
                value={selectedProject}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    return
                  }

                  handleUpdateTask({
                    projectId: (value?.value as string) || "",
                  })
                }}
              />
            </TaskPropertyValue>
          </TaskProperty>
          <TaskProperty>
            <TaskPropertyLabel label="Context" icon={<LocateIcon />} />
            <TaskPropertyValue>
              <ComboboxPopover
                matchContainerSize
                multiple
                type="context"
                items={contextsOptions}
                name="Context"
                value={selectedContext}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    handleUpdateTask({
                      contexts: value?.map(({ value }) => value),
                    })
                  }
                }}
              />
            </TaskPropertyValue>
          </TaskProperty>
          <TaskProperty>
            <TaskPropertyLabel label="Due Date" icon={<CalendarIcon />} />
            <TaskPropertyValue>
              <DatePicker
                value={task?.dueDate ? new Date(task?.dueDate) : undefined}
                onChange={(date) => {
                  handleUpdateTask({ dueDate: date?.toISOString() })
                }}
              />
            </TaskPropertyValue>
          </TaskProperty>
        </div>
      </div>
      <div>
        <Separator />
        <div className="flex flex-col gap-8 py-2 outline-none">
          <Editor
            content={task?.content ? JSON.parse(task.content) : ""}
            onChange={handleChangeContent}
          />
        </div>
      </div>
    </div>
  )
}

const TaskProperty = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center justify-start gap-4">{children}</div>
}

const TaskPropertyLabel = ({
  label,
  icon,
}: {
  label: string
  icon?: ReactNode
}) => {
  return (
    <div className="flex gap-2 w-[200px] items-center text-lg">
      <span>{icon}</span>
      <p>{label}</p>
    </div>
  )
}

const TaskPropertyValue = ({ children }: { children: ReactNode }) => {
  return <div className="w-full">{children}</div>
}
