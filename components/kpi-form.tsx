import { useMemo, useState } from "react"
import { HashIcon, TrophyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import "remirror/styles/all.css"
import { useSession } from "next-auth/react"

import { KpiInput } from "@/types/kpi"
import { useCreateKpi } from "@/hooks/kpis"
import { Checkbox } from "@/components/ui/checkbox"
import { useGoals } from "@/components/providers/goals-provider"

import { ComboboxPopover, Option } from "./combobox"
import { DatePicker } from "./date-picker"
import { Editor } from "./editor"
import {
  FormProperty,
  FormPropertyLabel,
  FormPropertyValue,
} from "./form-properties"
import { useProjects } from "./providers/projects-provider"
import { DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"

export const KpiForm = ({ onCreated }: { onCreated: () => void }) => {
  const { data } = useSession()
  const { mutate: createKpi } = useCreateKpi()
  const { goals } = useGoals()

  const [kpi, setKpi] = useState<KpiInput>({
    title: "",
    userId: data?.user?.id,
    goalId: "",
    target: {
      value: "",
      targetDate: "",
    },
  })

  const handleCreate = async () => {
    await createKpi(kpi)
    onCreated?.()
  }

  const goalsOptions = useMemo(
    () =>
      goals
        ?.filter(
          (goal) => goal.status !== "FAILED" && goal.status !== "COMPLETED"
        )
        .map((goal) => ({
          value: goal.id,
          label: goal.title,
        })),
    [goals]
  )

  const selectedGoal = useMemo(
    () => goalsOptions?.find(({ value }) => value === kpi?.goalId),
    [goalsOptions, kpi?.goalId]
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-4">
          <textarea
            className="h-8 w-full border-0 border-transparent bg-transparent text-2xl font-medium text-slate-900 dark:text-slate-100"
            placeholder="Name"
            value={kpi?.title || ""}
            onChange={(e) => {
              setKpi({ ...kpi, title: e.target.value })
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 dark:text-white">
          <FormProperty>
            <FormPropertyLabel label="Goal" icon={<TrophyIcon />} />
            <FormPropertyValue>
              <FormPropertyValue>
                <ComboboxPopover
                  matchContainerSize
                  items={goalsOptions}
                  type="goal"
                  name="Goal"
                  value={selectedGoal}
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      return
                    }

                    setKpi({
                      ...kpi,
                      goalId: (value?.value as string) || "",
                    })
                  }}
                />
              </FormPropertyValue>
            </FormPropertyValue>
          </FormProperty>
        </div>
        <div className="flex flex-col gap-8 dark:text-white">
          <FormProperty>
            <FormPropertyLabel label="Target" icon={<HashIcon />} />
            <FormPropertyValue>
              <FormPropertyValue>
                <Input
                  placeholder="Name"
                  value={kpi?.target?.value || ""}
                  onChange={(e) => {
                    setKpi({
                      ...kpi,
                      target: {
                        value: e.target.value,
                        targetDate: kpi.target?.targetDate || undefined,
                      },
                    })
                  }}
                />
              </FormPropertyValue>
            </FormPropertyValue>
          </FormProperty>
        </div>
        <div className="flex flex-col gap-8 dark:text-white">
          <FormProperty>
            <FormPropertyLabel label="Target" icon={<HashIcon />} />
            <FormPropertyValue>
              <FormPropertyValue>
                <DatePicker
                  value={
                    kpi?.target?.targetDate
                      ? new Date(kpi.target.targetDate)
                      : undefined
                  }
                  onChange={(value) => {
                    setKpi({
                      ...kpi,
                      target: {
                        value: kpi.target?.value || "",
                        targetDate: value?.toISOString() || "",
                      },
                    })
                  }}
                />
              </FormPropertyValue>
            </FormPropertyValue>
          </FormProperty>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleCreate}>Create</Button>
      </DialogFooter>
    </div>
  )
}
