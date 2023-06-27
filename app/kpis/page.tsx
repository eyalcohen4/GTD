import { Button } from "@/components/ui/button"
import { CreateKpi } from "@/components/create-kpi"
import { AppLayout } from "@/components/layouts/app-layout"
import { KpiList } from "@/components/kpi-list"

export default async function IndexPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12 w-full justify-between">
        <div className="w-full flex items-center justify-between px-8">
          <h1 className="text-3xl font-bold tracking-tight">KPIs</h1>
          <CreateKpi />
        </div>
        <KpiList />
      </div>
    </AppLayout>
  )
}
