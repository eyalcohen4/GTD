import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { Goals } from "@/components/goals"
import { Greeting } from "@/components/greeting"
import { HomeTasks } from "@/components/home-tasks"
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
        </div>
        <Projects />
        <div className="grid-cols-3 hidden md:grid">
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
        </div>
      </div>
    </AppLayout>
  )
}
