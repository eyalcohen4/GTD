import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { TasksList } from "@/components/tasks-list"

export default function WeekPage() {
  return (
    <div>
      <TasksList
        title="Week"
        timeRange={{
          to: dayjs().endOf("week").toISOString(),
        }}
        statuses={statuses
          .filter(({ value }) => value !== "COMPLETED")
          .map(({ value }) => value)}
      />
    </div>
  )
}
