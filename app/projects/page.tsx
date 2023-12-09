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

export default function Projects() {
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
