"use client"

import { useState } from "react"

import { toast } from "@/hooks/use-toast"

import { ProjectForm } from "./project-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

export const CreateProject = () => {
  const [open, setOpen] = useState(false)

  const handleCreated = () => {
    setOpen(false)
    toast({
      title: "Project created",
      description: "Your project has been created",
      variant: "success",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <span className="text-sm font-semibold">New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ProjectForm onCreated={handleCreated} />
      </DialogContent>
    </Dialog>
  )
}
