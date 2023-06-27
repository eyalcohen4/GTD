import { useMemo, useState } from "react"
import { Box, Calendar, Flower2, Locate, Shrub } from "lucide-react"

import { Goal, GoalInput, UpdateGoalInput } from "@/types/goal"
import useDebounce from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/seperator"

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
  const { projects } = useProjects()

  const [kpi, setKpi] = useState<KpiInput>({
    title: "",
    userId: data?.user?.id,
    projectId: "",
  })

  const handleCreate = async () => {
    await createKpi(kpi)
    onCreated?.()
  }

  const projectsOptions = useMemo(
    () =>
      projects?.map((project) => ({
        value: project.id,
        label: project.title,
        color: project.color,
      })),
    [projects]
  )

  const selectedProject = useMemo(
    () => projectsOptions?.find(({ value }) => value === kpi?.projectId),
    [projectsOptions, kpi?.projectId]
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-4">
          <textarea
            className="w-full border-0 h-8 bg-transparent border-transparent text-2xl text-slate-900 dark:text-slate-100 font-medium"
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
            <FormPropertyLabel label="Project" icon={<Flower2 />} />
            <FormPropertyValue>
              <FormPropertyValue>
                <ComboboxPopover
                  matchContainerSize
                  items={projectsOptions}
                  type="project"
                  name="Project"
                  value={selectedProject}
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      return
                    }

                    setKpi({
                      ...kpi,
                      projectId: (value?.value as string) || "",
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
