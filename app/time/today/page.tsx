import dayjs from "dayjs"

import { TasksList } from "@/components/tasks-list"

export default function TodayPage({
  params: { status },
}: {
  params: { status: string }
}) {
  return (
    <div>
      <TasksList
        title="Today"
        timeRange={{
          to: dayjs().startOf("day").toISOString(),
        }}
        status={status}
      />
    </div>
  )
}
