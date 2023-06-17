import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { TasksList } from "@/components/tasks-list"

export default function MonthPage() {
  return (
    <div>
      <TasksList
        title="Month"
        timeRange={{
          to: dayjs().add(30, "day").toISOString(),
        }}
        statuses={statuses
          .filter(({ value }) => value !== "COMPLETED")
          .map(({ value }) => value)}
      />
    </div>
  )
}
