import { statuses } from "@/constants/statuses"

import { TasksList } from "@/components/tasks-list"

export default function ProjectPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <div>
      <TasksList projectId={id} />
    </div>
  )
}
