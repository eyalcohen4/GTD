import { statuses } from "@/constants/statuses"

import { useProjects } from "@/components/providers/projects-provider"
import { TasksList } from "@/components/tasks-list"

export default function ProjectPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { projects } = useProjects()

  const project = projects?.find(({ id: projectId }) => projectId === id)

  return (
    <div className="flex flex-col gap-32">
      <h1 className="text-4xl font-bold">{project?.title}</h1>
      <TasksList projectId={id} status="inbox" />
      <TasksList projectId={id} status="next-action" />
      <TasksList projectId={id} status="waiting-for" />
      <TasksList projectId={id} status="someday-maybe" />
    </div>
  )
}
