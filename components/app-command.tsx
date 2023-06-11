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
  console.log(pageContext)

  const session = useSession()
  const { toast } = useToast()

  console.log(pageContext)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        ref.current?.focus()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = ref.current?.value
    if (!value) return

    await createTask({
      title: value,
      userId: session.data?.user?.id,
      status: "INBOX",
    })
    toast({
      variant: "success",
      title: "Task Created",
    })
  }

  return (
    <div className="relative">
      <form onSubmit={handleCreate}>
        <Input
          ref={ref}
          variant="outline"
          className={cn(
            "relative h-9 w-full justify-start rounded-[0.5rem] text-sm sm:pr-12 md:w-40 lg:w-[500px]"
          )}
          placeholder="Create new task"
          {...props}
        />
        <div
          className="absolute right-2 text-muted-foreground"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {isLoading ? <Loader /> : <PlusCircle />}
        </div>
      </form>
    </div>
  )
}
