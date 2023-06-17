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
        title="Month"
        timeRange={{
          to: dayjs().add(30, "day").toISOString(),
        }}
        status={status}
      />
    </div>
  )
}
