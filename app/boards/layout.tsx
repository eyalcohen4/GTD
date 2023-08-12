import { AppLayout } from "@/components/layouts/app-layout"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
