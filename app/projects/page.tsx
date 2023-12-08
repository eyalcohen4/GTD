"use client"

import { useMemo } from "react"
import { goalsStatuses, statuses } from "@/constants/statuses"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/seperator"
import { Color } from "@/components/color-picker"
import { ProjectsList } from "@/components/projects-list"
import { useProjects } from "@/components/providers/projects-provider"
import { TaskBadge } from "@/components/task-list-item"

export default function Projects({ children }: { children: React.ReactNode }) {
  const { projects } = useProjects()
  const groupedProjectsByStatus = useMemo(() => {
    return projects?.reduce((acc, project) => {
      const status = project.status || "No Status"
      // @ts-ignore
      if (!acc[status]) acc[status] = []
      // @ts-ignore
      acc[status].push(project)
      return acc
    }, {})
  }, [projects])

  return (
    <div>
      <h1 className="scroll-m-20 text-lg font-medium lg:text-3xl mb-4 p-8">
        Projects
      </h1>

      <div className="mt-4">
        <ProjectsList />
      </div>
    </div>
  )
}
const StatusGroup = ({ status }: { status: string }) => {
  const instance = goalsStatuses.find((s) => s.value === status)

  if (status === "No Status") {
    return (
      <div className="flex items-center gap-2 md:px-8 px-4 dark:bg-gray-800 bg-gray-100">
        <div className={`h-2 w-2 rounded-full bg-gray-400`} />
        <span className="font-semibold py-1">{status}</span>
      </div>
    )
  }

  if (!instance) {
    return null
  }

  return (
    <div className="flex items-center gap-2 md:px-8 px-4 dark:bg-gray-800 bg-gray-100">
      {instance.icon ? (
        <instance.icon
          className={"h-4 w-4"}
          style={
            instance.color
              ? {
                  color: instance.color,
                }
              : {}
          }
        />
      ) : null}
      <span className="font-semibold py-1">{instance.label}</span>
    </div>
  )
}
