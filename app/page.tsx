import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Inbox } from "@/components/inbox"
import { AppLayout } from "@/components/layouts/app-layout"

const widgets = [
  { name: "Inbox", href: "/inbox" },
  {
    name: "Goal",
    href: "/goal",
  },
  {
    name: "Money",
    href: "/money",
  },
  {
    name: "Experiments",
    href: "/experiments",
  },
]

export default function IndexPage() {
  return (
    <AppLayout>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Inbox />
      </section>
    </AppLayout>
  )
}
