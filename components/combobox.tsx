"use client"

import * as React from "react"
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Option = {
  color?: string
  value: string
  label: string
  icon?: LucideIcon
}

export function ComboboxPopover({
  items,
  cta,
}: {
  items: Option[]
  cta: string
}) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelectedStatus] = React.useState<Option | null>(null)

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            {selected ? (
              <>
                {selected.icon ? (
                  <selected.icon className="mr-2 h-4 w-4 shrink-0" />
                ) : null}
                {selected.label}
              </>
            ) : (
              <>{cta}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="center">
          <Command>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    className="cursor-pointer"
                    onSelect={(value) => {
                      setSelectedStatus(
                        items.find((item) => item.value === value) || null
                      )
                      setOpen(false)
                    }}
                  >
                    {item.icon ? (
                      <item.icon
                        className={cn(
                          "mr-2 h-4 w-4",
                          item.value === selected?.value
                            ? "opacity-100"
                            : "opacity-40"
                        )}
                      />
                    ) : null}
                    {item.color ? (
                      <div className="flex items-center justify-center w-4 h-4 rounded-full mr-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{  ackground: item.color }}
                        ></div>
                      </div>
                    ) : null}
                    <span>{item.value}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
