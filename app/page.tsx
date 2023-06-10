import { Inbox } from "@/components/inbox"
import { AppLayout } from "@/components/layouts/app-layout"
import { TasksList } from "@/components/tasks-list"

export default async function IndexPage() {
  return (
    <AppLayout>
      <TasksList status="INBOX" />
    </AppLayout>
  )
}
