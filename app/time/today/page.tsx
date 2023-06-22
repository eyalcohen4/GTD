import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { TasksList } from "@/components/tasks-list"

export default function TodayPage() {
  return (
    <div>
      <TasksList
        title="Today"
        timeRange={{
          to: dayjs().endOf("day").toISOString(),
        }}
        statuses={statuses
          .filter(({ value }) => value !== "COMPLETED")
          .map(({ value }) => value)}
      />
    </div>
  )
}
