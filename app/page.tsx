import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { Goals } from "@/components/goals"
import { Greeting } from "@/components/greeting"
import { AppLayout } from "@/components/layouts/app-layout"
import { Projects } from "@/components/projects"
import { TasksList } from "@/components/tasks-list"

export default async function IndexPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12 w-full justify-between">
        <div className="px-8 flex flex-col gap-6">
          <Greeting />
          <Goals />
          <Projects />
        </div>

        <TasksList
          title="Overdue"
          timeRange={{
            to: dayjs().startOf("day").add(-1, "day").toISOString(),
          }}
        />
        <TasksList
          statuses={statuses
            .filter(({ value }) => value !== "COMPLETED")
            .map(({ value }) => value)}
          title="Today"
          timeRange={{
            to: dayjs().startOf("day").toISOString(),
          }}
        />
        <TasksList statuses={["INBOX"]} title="Inbox" />
      </div>
    </AppLayout>
  )
}
