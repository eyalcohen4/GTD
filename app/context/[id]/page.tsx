"use client"

import { useState } from "react"

import { Context, UpdateContextInput } from "@/types/context"
import { useUpdateContext } from "@/hooks/contexts"
import useDebounce from "@/hooks/use-debounce"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/seperator"
import { ColorPicker } from "@/components/color-picker"
import { useContexts } from "@/components/providers/contexts-provider"
import { TasksList } from "@/components/tasks-list"

export default function ContextPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { contexts } = useContexts()

  const context = contexts?.find(({ id: contextId }) => id === contextId)

  return (
    <div className="flex flex-col gap-12">
      {context ? <ContextHeader context={context} /> : null}
      <TasksList contextId={context?.id} />
    </div>
  )
}

const ContextHeader = ({ context }: { context: Context }) => {
  const { updateContext } = useUpdateContext()
  const [title, setTitle] = useState(context?.title || "")

  const debouncedUpdateProject = useDebounce((input: UpdateContextInput) => {
    handleUpdateContext(input)
  }, 1000)

  const handleUpdateContext = (input: Omit<UpdateContextInput, "id">) => {
    updateContext({ id: context.id || "", input })
  }

  return (
    <div className="md:px-8 px-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <ColorPicker
              color={context?.color || ""}
              onChange={(value) => {
                handleUpdateContext({
                  color: value,
                })
              }}
            />
            <Input
              className="md:text-3xl font-bold tracking-tight border-none w-full"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                debouncedUpdateProject({ title: event.target.value })
              }}
            />
          </div>
        </div>
        <Separator />
      </div>
    </div>
  )
}
