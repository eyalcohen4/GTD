"use client"

import { useState } from "react"

import { toast } from "@/hooks/use-toast"

import { BoardForm } from "./board-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

export const CreateBoard = () => {
  const [open, setOpen] = useState(false)

  const handleCreated = () => {
    setOpen(false)
    toast({
      title: "Board created",
      description: "Your new board has been created",
      variant: "success",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <span className="text-sm font-semibold">New Board</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <BoardForm onCreated={handleCreated} />
      </DialogContent>
    </Dialog>
  )
}
