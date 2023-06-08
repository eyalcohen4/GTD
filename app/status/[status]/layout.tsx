import { AppLayout } from "@/components/layouts/app-layout"

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
