"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { File, Laptop, Moon, Plus, PlusCircle, SunMedium } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useCreateTask } from "@/hooks/tasks"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import { Dialog, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

const commands = [
  {
    name: "Add to Inbox",
    description: "Add a new task to your inbox",
  },
]
export function AppCommand({ ...props }: any) {
  const ref = React.useRef<HTMLInputElement>(null)
  const { createTask, isLoading, data } = useCreateTask()
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
          <PlusCircle />
        </div>
      </form>
    </div>
  )
}
