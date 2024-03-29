import { useState } from "react"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { useCreateContext } from "@/hooks/contexts"

import { ColorPicker } from "./color-picker"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export const CreateContext = ({
  onCreated,
  onCancel,
}: {
  onCreated?: () => void
  onCancel: () => void
}) => {
  const session = useSession()
  const [color, setColor] = useState("#000000")
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  const { createContext, isLoading } = useCreateContext()

  const handleColorChange = (color: string) => {
    setColor(color)
  }

  const handleCreate = async () => {
    if (!title) {
      setError("Please enter a name")
    }

    await createContext({
      title,
      color,
      userId: session?.data?.user.id,
    })

    onCreated && onCreated()
  }

  return (
    <div className="flex items-center flex-col gap-4">
      <div className="flex gap-2">
        <ColorPicker color={color} onChange={handleColorChange} />
        <Input
          placeholder="New project"
          className={cn(`h-8 w-full`, {
            "border-red-500": error,
          })}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <p className="text-red-500">{error}</p>
      <div className="flex gap-2 items-center justify-between">
        <Button
          className="h-8 w-full bg-transparent dark:text-white text-slate-950"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button className="h-8 w-full" onClick={handleCreate}>
          {isLoading ? <Loader /> : "Create"}
        </Button>
      </div>
    </div>
  )
}
