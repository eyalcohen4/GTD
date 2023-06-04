import { ReactNode, useMemo, useState } from "react"
import { statuses } from "@/constants/statuses"
import {
  BoxIcon,
  CalendarIcon,
  Flower2Icon,
  FlowerIcon,
  HomeIcon,
  Loader,
  LocateIcon,
} from "lucide-react"
import { useSession } from "next-auth/react"
import TextareaAutosize from "react-textarea-autosize"

import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { useCreateContext, useGetContexts } from "@/hooks/contexts"
import { useCreateProjects, useGetProjects } from "@/hooks/projects"
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
import { Sheet, SheetContent, SheetDescription } from "./ui/sheet"

export const TaskDialog = ({
  task,
  open,
  onOpenChange,
}: {
  task?: Task | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const { projects } = useGetProjects()
  const { contexts } = useGetContexts()

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetDescription className="text-slate-950">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Checkbox className="h-6 w-6" circle />
              <TextareaAutosize
                className="w-full border-0 bg-transparent border-transparent text-2xl text-slate-900 dark:text-slate-100 font-medium"
                placeholder={task?.title || "Task Title"}
                value={task?.title}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-8 dark:text-white">
              <TaskProperty>
                <TaskPropertyLabel label="Status" icon={<BoxIcon />} />
                <TaskPropertyValue>
                  <ComboboxPopover
                    matchContainerSize
                    type="status"
                    items={statuses}
                    name="Status"
                    onChange={() => {}}
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
                    onChange={() => {}}
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
                    createType="Context"
                    onChange={() => {}}
                  />
                </TaskPropertyValue>
              </TaskProperty>

              <TaskProperty>
                <TaskPropertyLabel label="Due Date" icon={<CalendarIcon />} />
                <TaskPropertyValue>
                  <DatePicker />
                </TaskPropertyValue>
              </TaskProperty>
            </div>
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  )
}

const TaskProperty = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-start gap-4 px-24">
      {children}
    </div>
  )
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
