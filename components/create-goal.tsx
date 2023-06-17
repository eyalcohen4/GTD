"use client"

import { useState } from "react"

import { toast } from "@/hooks/use-toast"

import { GoalForm } from "./goal-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

export const CreateGoal = () => {
  const [open, setOpen] = useState(false)

  const handleCreated = () => {
    setOpen(false)
    toast({
      title: "Goal created",
      description: "Your goal has been created",
      variant: "success",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <span className="text-sm font-semibold">New Goal</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <GoalForm onCreated={handleCreated} />
      </DialogContent>
    </Dialog>
  )
}
