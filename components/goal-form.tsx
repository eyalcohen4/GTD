import { useMemo, useState } from "react"
import { Box, Calendar, Flower2, Locate, Shrub } from "lucide-react"

import { Goal, GoalInput, UpdateGoalInput } from "@/types/goal"
import useDebounce from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/seperator"

import "remirror/styles/all.css"
import { useSession } from "next-auth/react"

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
import { DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"

export const GoalForm = ({ onCreated }: { onCreated: () => void }) => {
  const { data } = useSession()
  const { createGoal } = useGoals()
  const [goal, setGoal] = useState<GoalInput>({
    title: "",
    dueDate: undefined,
    motivation: "",
    userId: data?.user?.id,
  })

  const handleCreate = async () => {
    await createGoal(goal)
    onCreated()
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-4">
          <textarea
            className="w-full border-0 h-8 bg-transparent border-transparent text-2xl text-slate-900 dark:text-slate-100 font-medium"
            placeholder={"Goal Title"}
            value={goal?.title || ""}
            onChange={(e) => {
              setGoal({ ...goal, title: e.target.value })
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 dark:text-white">
          <FormProperty>
            <FormPropertyLabel label="Due Date" icon={<Calendar />} />
            <FormPropertyValue>
              <DatePicker
                value={goal?.dueDate ? new Date(goal?.dueDate) : undefined}
                onChange={(date) => {
                  setGoal({ ...goal, dueDate: date?.toISOString() })
                }}
              />
            </FormPropertyValue>
          </FormProperty>
          <FormProperty>
            <FormPropertyLabel label="Motivation" icon={<Shrub />} />
            <FormPropertyValue>
              <Input
                value={goal?.motivation || ""}
                onChange={(e) => {
                  setGoal({ ...goal, motivation: e.target.value })
                }}
              />
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
