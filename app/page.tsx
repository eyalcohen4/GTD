import { statuses } from "@/constants/statuses"
import dayjs from "dayjs"

import { Goals } from "@/components/goals"
import { Greeting } from "@/components/greeting"
import { HomeTasks } from "@/components/home-tasks"
import { AppLayout } from "@/components/layouts/app-layout"
import { Onboarding } from "@/components/onboarding"
import { Projects } from "@/components/projects"

export default async function IndexPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12 w-full justify-between">
        <div className="px-8 flex flex-col gap-6">
          <Greeting />
          <Onboarding />
          <Goals />
        </div>
        <div className="flex flex-col gap-4">
          <HomeTasks />
        </div>
        <Projects />
      </div>
    </AppLayout>
  )
}
