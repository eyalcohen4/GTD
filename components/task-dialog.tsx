import { ReactNode, useMemo, useState } from "react"
import { statuses } from "@/constants/statuses"
import { BlockNoteView, useBlockNote } from "@blocknote/react"
import { BoxIcon, CalendarIcon, Flower2Icon, LocateIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import TextareaAutosize from "react-textarea-autosize"

import { Task, TaskInput, UpdateTaskInput } from "@/types/task"
import { cn } from "@/lib/utils"
import { useCreateContext, useGetContexts } from "@/hooks/contexts"
import { useCreateProjects, useGetProjects } from "@/hooks/projects"
import { useUpdateTask } from "@/hooks/tasks"
import { Separator } from "@/components/ui/seperator"

import { ColorPicker } from "./color-picker"
import { ComboboxPopover, Option } from "./combobox"
import { DatePicker } from "./date-picker"
import { MultipleSelect } from "./multiple-select"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Popover } from "./ui/popover"
import { Select } from "./ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

export const TaskDialog = ({
  task,
  open,
  onOpenChange,
}: {
  task?: Task | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const { updateTask } = useUpdateTask()
  const { projects } = useGetProjects()
  const { contexts } = useGetContexts()
  const editor = useBlockNote({
    onEditorContentChange: (editor) => {
      // Log the document to console on every update
      // console.log(editor.getJSON())
    },
  })

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
    updateTask({ id: task?.id || "", input })
  }

  const categoryOption = statuses.find(({ value }) => value === task?.category)
  const projectOption = projectsOptions?.find(
    ({ value }) => value === task?.projectId
  )
  const selectedContextsIds = task?.contexts?.map(({ id }) => id) || []
  const contextOptions = contextsOptions?.filter(({ value }) =>
    selectedContextsIds.includes(value)
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="px-24 flex flex-col gap-8">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-4">
              <Checkbox
                className="h-6 w-6"
                circle
                onCheckedChange={(value) => {
                  handleUpdateTask({ completed: value as boolean })
                }}
                checked={task?.completed}
              />
              <TextareaAutosize
                className="w-full border-0 bg-transparent border-transparent text-2xl text-slate-900 dark:text-slate-100 font-medium"
                placeholder={task?.title || "Task Title"}
                value={task?.title}
              />
            </div>
          </SheetTitle>
        </SheetHeader>
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
                  value={categoryOption}
                  name="Status"
                  onChange={(value) => {
                    handleUpdateTask({ category: value?.value })
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
                  value={projectOption}
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
                  value={contextOptions}
                  createType="Context"
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      handleUpdateTask({
                        contextIds: value?.map(({ value }) => value),
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
        <Separator />
        <div className="flex flex-col gap-8">
          <BlockNoteView editor={editor} />
        </div>
      </SheetContent>
    </Sheet>
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
