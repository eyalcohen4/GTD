import { statuses } from "@/constants/statuses"

import { TasksList } from "@/components/tasks-list"

export default function StatusPage({
  params: { status },
}: {
  params: { status: string }
}) {
  return (
    <div>
      <TasksList status={status} groupBy="project" />
    </div>
  )
}
