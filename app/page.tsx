import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { Goals } from "@/components/goals"
import { Greeting } from "@/components/greeting"
import { AppLayout } from "@/components/layouts/app-layout"
import { TasksList } from "@/components/tasks-list"

export default async function IndexPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12 w-full justify-between">
        <div className="px-8">
          <Greeting />
          <Goals />
        </div>
        <TasksList
          fullWidth
          title="Today"
          timeRange={{
            to: dayjs().startOf("day").toISOString(),
          }}
        />
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
    </AppLayout>
  )
}
