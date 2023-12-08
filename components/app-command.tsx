"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader, LoaderIcon, PlusCircle } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { useCreateTask } from "@/hooks/tasks"
import { usePageContext } from "@/hooks/use-page-context"
import { useToast } from "@/hooks/use-toast"

import { useTasks } from "./providers/tasks-provider"
import { Input } from "./ui/input"

export function AppCommand({ ...props }: any) {
  const ref = React.useRef<HTMLInputElement>(null)
  const { createTask, loadingCreateTask: isLoading } = useTasks()
  const pageContext = usePageContext()

  const session = useSession()
  const { toast } = useToast()

  const getPageBasedParams = (): {
    projectId?: string
    status?: string
    contexts?: string[]
  } => {
    const { type, id } = pageContext

    if (type === "project" && id) return { projectId: id }
    if (type === "status" && id) return { status: id }
    if (type === "context" && id) return { contexts: [id] }

    return {}
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = ref.current?.value
    if (!value) return

    const pageBasedParams = getPageBasedParams()

    await createTask({
      title: value,
      userId: session.data?.user?.id,
      status: "INBOX",
      ...pageBasedParams,
    })
    toast({
      variant: "success",
      title: "Task Created",
    })
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleCreate} className="w-full md:w-1/2 relative">
        <Input
          ref={ref}
          variant="outline"
          className={cn(
            "relative h-9 w-full justify-start rounded-[0.5rem] sm:pr-12"
          )}
          placeholder="Capture new task"
          {...props}
        />
        <button
          className="absolute right-2 text-muted-foreground"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
          type="submit"
        >
          {isLoading ? <Loader /> : <PlusCircle />}
        </button>
      </form>
    </div>
  )
}
