import { useState } from "react"

import { Button } from "@/components/ui/button"

import "remirror/styles/all.css"
import { useSession } from "next-auth/react"

import { BoardInput } from "@/types/board"
import { useCreateBoard } from "@/hooks/boards"

import { DialogFooter } from "./ui/dialog"

export const BoardForm = ({ onCreated }: { onCreated: () => void }) => {
  const { data } = useSession()
  const create = useCreateBoard()
  const [board, setBoard] = useState<BoardInput>({
    title: "",
    userId: data?.user?.id,
  })

  const handleCreate = async () => {
    await create.mutate(board)
    onCreated()
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-4">
          <textarea
            className="w-full border-0 h-8 bg-transparent border-transparent text-2xl text-slate-900 dark:text-slate-100 font-medium"
            placeholder={"Board Title"}
            value={board?.title || ""}
            onChange={(e) => {
              setBoard({ ...board, title: e.target.value })
            }}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleCreate}>Create</Button>
      </DialogFooter>
    </div>
  )
}
