import { AppLayout } from "@/components/layouts/app-layout"

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
