import { Inbox } from "@/components/inbox"
import { AppLayout } from "@/components/layouts/app-layout"

export default async function IndexPage() {
  return (
    <AppLayout>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-col gap-8">
          <Inbox />
        </div>
      </section>
    </AppLayout>
  )
}
