"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LoaderIcon, PlusCircle } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { useCreateTask } from "@/hooks/tasks"

import { TaskDialog } from "./task-dialog"
import { Input } from "./ui/input"

export function AppCommand({ ...props }: any) {
  const router = useRouter()
  const ref = React.useRef<HTMLInputElement>(null)
  const { createTask, isLoading } = useCreateTask()
  const session = useSession()

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
    })
    router.refresh()
    // setTimeout(async () => {
    //   await fetch("/api/revalidate")
    // }, 2000)
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
          {isLoading ? <LoaderIcon /> : <PlusCircle />}
        </div>
      </form>
    </div>
  )
}
