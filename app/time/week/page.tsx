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
        title="Week"
        timeRange={{
          to: dayjs().startOf("week").toISOString(),
        }}
        status={status}
      />
    </div>
  )
}
