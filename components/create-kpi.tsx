"use client"

import { useState } from "react"

import { toast } from "@/hooks/use-toast"

import { KpiForm } from "./kpi-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

export const CreateKpi = () => {
  const [open, setOpen] = useState(false)

  const handleCreated = () => {
    setOpen(false)
    toast({
      title: "KPI created",
      description: "Your KPI has been created",
      variant: "success",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <span className="text-sm font-semibold">New KPI</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <KpiForm onCreated={handleCreated} />
      </DialogContent>
    </Dialog>
  )
}
