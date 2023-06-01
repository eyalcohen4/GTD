import { Flower2Icon, FlowerIcon, HomeIcon, LocateIcon } from "lucide-react"

import { Task } from "@/types/task"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import { ComboboxPopover } from "./combobox"
import { Checkbox } from "./ui/checkbox"
import { Dialog, DialogHeader } from "./ui/dialog"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const projects = [
  {
    value: "home",
    label: "Home",
    color: "red",
  },
  {
    value: "desk",
    label: "Desk",
    color: "blue",
  },
]

const contexts = [
  {
    value: "home",
    label: "Home",
  },
  {
    value: "desk",
    label: "Desk",
  },
]

export const TaskDialog = ({
  task,
  open,
  onOpenChange,
}: {
  task?: Task | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[600px] min-h-[400px] shadow-lg dark:bg-zinc-950/90 backdrop-blur-sm border-0 border-transparent pb-8">
        <DialogDescription>
          <div className="flex items-center gap-4">
            <Checkbox className="h-10 w-10" />
            <Input
              className="border-0 border-transparent dark:bg-slate-800/90 bg-slate-100/90 text-slate-900 dark:text-slate-100 font-medium"
              placeholder={task?.title || "Task Title"}
              value={task?.title}
            />
          </div>
          <div className="mt-8 flex flex-col gap-8">
            <div className="flex items-center justify-start gap-4">
              <div className="flex gap-2 w-24">
                <Flower2Icon />
                <p>Project</p>
              </div>
              <ComboboxPopover items={projects} cta="Select Project" />
            </div>
            <div className="flex items-center justify-start gap-4">
              <div className="flex gap-2 w-24">
                <LocateIcon />
                <p>Context</p>
              </div>
              <div>
                <ComboboxPopover items={contexts} cta="Select Context" />
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
