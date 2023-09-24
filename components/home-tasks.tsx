"use client"

import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { TasksList } from "@/components/tasks-list"

export const HomeTasks = () => {
  return (
    <>
      <TasksList statuses={["INBOX"]} title="Inbox" />
      <TasksList
        title="Overdue"
        timeRange={{
          to: dayjs().endOf("day").subtract(1, "day").toISOString(),
        }}
      />
      <TasksList
        statuses={statuses
          .filter(({ value }) => value !== "COMPLETED")
          .map(({ value }) => value)}
        title="Today"
        timeRange={{
          to: dayjs().endOf("day").toISOString(),
        }}
      />
    </>
  )
}
