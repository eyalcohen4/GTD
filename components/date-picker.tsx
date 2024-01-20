"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
  value,
  placeholder,
  onChange,
  variant,
}: {
  placeholder?: string
  value: Date | undefined
  onChange: (date?: Date) => void
  variant?: ButtonProps["variant"]
}) {
  const [date, setDate] = React.useState<Date | null>(value || null)

  const handleSelect = (date?: Date) => {
    setDate(date || null)
    onChange(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant || "outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP")
          ) : (
            <span>{placeholder || "Pick a Date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
