import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { Goals } from "@/components/goals"
import { Greeting } from "@/components/greeting"
import { AppLayout } from "@/components/layouts/app-layout"
import { TasksList } from "@/components/tasks-list"

export default async function IndexPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12 px-8 w-full justify-between">
        <Greeting />
        <Goals />
        <div className="flex w-full gap-8">
          <TasksList
            fullWidth
            statuses={statuses
              .filter(({ value }) => value !== "COMPLETED")
              .map(({ value }) => value)}
            title="Today"
            timeRange={{
              to: dayjs().startOf("day").toISOString(),
            }}
          />
          <TasksList fullWidth statuses={["INBOX"]} title="Inbox" />
        </div>
      </div>
    </AppLayout>
  )
}
