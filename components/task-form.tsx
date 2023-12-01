"use client"

import { useMemo, useState } from "react"
import { statuses } from "@/constants/statuses"
import { Box, Calendar, Flower2, Locate } from "lucide-react"

import { Task, TaskInput, UpdateTaskInput } from "@/types/task"
import useDebounce from "@/hooks/use-debounce"
import { Separator } from "@/components/ui/seperator"

import "remirror/styles/all.css"
import { useSession } from "next-auth/react"

import { Checkbox } from "@/components/ui/checkbox"
import { useTasks } from "@/components/providers/tasks-provider"

import { ComboboxPopover, Option } from "./combobox"
import { DatePicker } from "./date-picker"
import { Editor } from "./editor"
import {
  FormProperty,
  FormPropertyLabel,
  FormPropertyValue,
} from "./form-properties"
import { useContexts } from "./providers/contexts-provider"
import { useProjects } from "./providers/projects-provider"
import { Button } from "./ui/button"

export const TaskForm = ({
  task,
  create,
}: {
  task?: Task
  create?: boolean
}) => {
  const { data: user } = useSession()
  const { updateTask, createTask } = useTasks()
  const { projects } = useProjects()
  const { contexts } = useContexts()
  const [newTask, setNewTask] = useState<Partial<TaskInput> | null>(null)
  const [title, setTitle] = useState(task?.title || "")

  const handleChangeContent = (
    content: Record<string, unknown> | null | undefined
  ) => {
    debouncedUpdateTask({
      content: JSON.stringify(content),
    })
  }

  const debouncedUpdateTask = useDebounce((input: TaskInput) => {
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

  const handleUpdateTask = async (input: UpdateTaskInput) => {
    if (task?.id) {
      await updateTask({ id: task.id || "", input })
    }
  }

  const handleCreateTask = async () => {
    if (newTask) {
      await createTask({ ...newTask, title, userId: user?.user?.id })
    }
  }

  const getSelectedStatus = () => {
    const status = statuses.find(({ value }) => {
      return value === task?.status
    })

    return {
      value: status?.value || "",
      label: status?.label || "",
      color: status?.color || "",
      icon: status?.icon || undefined,
    }
  }

  const selectedStatus = useMemo(
    () => getSelectedStatus(),
    [statuses, task?.status]
  )

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
          {create ? null : (
            <Checkbox
              className="h-6 w-6"
              circle
              onCheckedChange={(value) => {
                handleUpdateTask({ completed: value as boolean })
              }}
              checked={task?.completed}
            />
          )}
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
          <FormProperty>
            <FormPropertyLabel label="Status" icon={<Box />} />
            <FormPropertyValue>
              <ComboboxPopover
                matchContainerSize
                type="status"
                items={statuses}
                value={selectedStatus}
                name="Status"
                onChange={(option) => {
                  if (Array.isArray(option)) {
                    return
                  }

                  handleUpdateTask({ status: option?.value })
                }}
              />
            </FormPropertyValue>
          </FormProperty>
          <FormProperty>
            <FormPropertyLabel label="Project" icon={<Flower2 />} />
            <FormPropertyValue>
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

                  if (create) {
                    setNewTask({
                      projectId: (value?.value as string) || "",
                    })
                    return
                  }

                  handleUpdateTask({
                    projectId: (value?.value as string) || "",
                  })
                }}
              />
            </FormPropertyValue>
          </FormProperty>
          <FormProperty>
            <FormPropertyLabel label="Context" icon={<Locate />} />
            <FormPropertyValue>
              <ComboboxPopover
                matchContainerSize
                multiple
                type="context"
                items={contextsOptions}
                name="Context"
                value={selectedContext}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    if (create) {
                      setNewTask({
                        contexts: value?.map(({ value }) => value),
                      })
                      return
                    }

                    handleUpdateTask({
                      contexts: value?.map(({ value }) => value),
                    })
                  }
                }}
              />
            </FormPropertyValue>
          </FormProperty>
          <FormProperty>
            <FormPropertyLabel label="Due Date" icon={<Calendar />} />
            <FormPropertyValue>
              <DatePicker
                value={task?.dueDate ? new Date(task?.dueDate) : undefined}
                onChange={(date) => {
                  if (create) {
                    setNewTask({ dueDate: date?.toISOString() || "" })
                    return
                  }

                  handleUpdateTask({ dueDate: date?.toISOString() || "" })
                }}
              />
            </FormPropertyValue>
          </FormProperty>
        </div>
      </div>
      {create ? null : (
        <div>
          <Separator />
          <div className="flex flex-col gap-8 py-2 outline-none mt-4">
            <Editor
              content={task?.content ? JSON.parse(task.content) : ""}
              onChange={handleChangeContent}
            />
          </div>
        </div>
      )}
      {create ? <Button onClick={handleCreateTask}>Create</Button> : null}
    </div>
  )
}
