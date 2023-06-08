"use client"

import { ReactNode, useMemo, useState } from "react"
import { statuses } from "@/constants/statuses"
import { BlockNoteView, useBlockNote } from "@blocknote/react"
import { BoxIcon, CalendarIcon, Flower2Icon, LocateIcon } from "lucide-react"

import { UpdateTaskInput } from "@/types/task"
import useDebounce from "@/hooks/use-debounce"
import { Separator } from "@/components/ui/seperator"

import "@blocknote/core/style.css"
import { useTheme } from "next-themes"

import { useGetTask } from "@/hooks/tasks"

import { ComboboxPopover } from "./combobox"
import { DatePicker } from "./date-picker"
import { useContexts } from "./providers/contexts-provider"
import { useProjects } from "./providers/projects-provider"
import { useTasks } from "./providers/tasks-provider"
import { Checkbox } from "./ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

export const TaskDialog = ({
  taskId,
  open,
  onOpenChange,
}: {
  taskId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const { task, isLoading } = useGetTask(taskId)

  if (isLoading) {
    return null
  }

  const { updateTask } = useTasks()
  const { projects } = useProjects()
  const { contexts } = useContexts()

  const { theme } = useTheme()

  const [title, setTitle] = useState(task?.title || "")

  const editor = useBlockNote({
    // initialContent: task?.content ? JSON.parse(task?.content) : {},
    onEditorContentChange: (editor) => {
      // debouncedUpdateTask({ content: JSON.stringify(editor.topLevelBlocks) })
    },
    theme: theme as any,
  })

  const debouncedUpdateTask = useDebounce((task) => {
    handleUpdateTask(task)
  }, 300)

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
    updateTask({ id: taskId || "", input })
  }

  const categoryOption = useMemo(
    () => statuses.find(({ value }) => value === task?.category),
    [task]
  )
  const projectOption = useMemo(
    () => projectsOptions?.find(({ value }) => value === task?.projectId),
    [task]
  )
  const selectedContextsIds = useMemo(
    () => task?.contexts?.map(({ id }) => id) || [],
    [task]
  )
  const contextOptions = contextsOptions?.filter(({ value }) =>
    selectedContextsIds.includes(value)
  )

  const handleChangeTitle = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value)
    debouncedUpdateTask({ title: e.target.value })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="px-24 flex flex-col gap-8">
        <SheetHeader>
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
        <div>
          <Separator />
          <div className="flex flex-col gap-8 py-2 outline-none">
            <BlockNoteView editor={editor} />
          </div>
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
