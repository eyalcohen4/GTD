"use client"

import { useRouter } from "next/navigation"
import { Loader, LoaderIcon } from "lucide-react"

import { useGetTask } from "@/hooks/tasks"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TaskForm } from "@/components/task-form"

const Task = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter()

  return (
    <TaskDialog
      open
      taskId={id}
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
    />
  )
}

export default Task

const TaskDialog = ({
  taskId,
  open,
  onOpenChange,
}: {
  taskId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const { task, isLoading } = useGetTask(taskId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-4">
        {isLoading ? <Loader /> : <TaskForm task={task} />}
      </SheetContent>
    </Sheet>
  )
}
