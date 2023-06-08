import { Inbox } from "@/components/inbox"
import { AppLayout } from "@/components/layouts/app-layout"

export default async function IndexPage() {
  return (
    <AppLayout>
      <Inbox />
    </AppLayout>
  )
}
