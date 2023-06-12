"use client"

import { useContexts } from "@/components/providers/contexts-provider"
import { useProjects } from "@/components/providers/projects-provider"
import { TasksList } from "@/components/tasks-list"

export default function ProjectPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { contexts } = useContexts()

  const context = contexts?.find(({ id: contextId }) => id === contextId)

  return (
    <div className="flex flex-col gap-32">
      <h1 className="text-4xl font-bold">{context?.title}</h1>
      <TasksList contextId={context?.id} />
    </div>
  )
}
