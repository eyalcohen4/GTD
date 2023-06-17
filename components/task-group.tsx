"use client"

import { StatusConfig } from "@/constants/statuses"
import { ChevronDown } from "lucide-react"

import { TaskPreview } from "@/types/task"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { TaskListItem } from "@/components/task-list-item"

export const TaskGroup = ({
  status,
  tasks,
}: {
  status: StatusConfig
  tasks: TaskPreview[]
}) => {
  return (
    <div key={status.label} className="flex flex-col">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="h-[40px] w-full">
          <div className="flex h-[40px] px-4 md:px-8 items-center justify-between bg-secondary w-full">
            <div className="flex gap-2 items-center">
              {status?.icon ? <status.icon /> : null}
              <h3 className="text-md font-semibold tracking-tight">
                {status.label}
              </h3>
              <Badge className="ml-4">{tasks?.length}</Badge>
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
