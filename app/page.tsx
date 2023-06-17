import dayjs from "dayjs"

import { Goals } from "@/components/goals"
import { Greeting } from "@/components/greeting"
import { AppLayout } from "@/components/layouts/app-layout"
import { TasksList } from "@/components/tasks-list"

export default async function IndexPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12 px-8">
        <Greeting />
        <Goals />
        <TasksList
          fullWidth
          title="Today"
          timeRange={{
            to: dayjs().startOf("day").toISOString(),
          }}
        />
      </div>
    </AppLayout>
  )
}
