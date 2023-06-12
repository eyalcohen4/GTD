import * as React from "react"
import { Column } from "@tanstack/react-table"
import { Check, LucideIcon, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/seperator"

import { Option } from "./combobox"

interface FilterProps {
  title?: string
  options: Array<Option>
  selectedOptions: Array<Option>
  onChange: (value: Array<Option>) => void
}

export function Filter({
  title,
  options,
  selectedOptions,
  onChange,
}: FilterProps) {
  const handleSelect = (selected: string) => {
    const getUpdated = (prevOptions: Option[]) => {
      const option = options.find(
        (i) => i.value === selected || i.value === selected.toUpperCase()
      )

      if (!option) return prevOptions

      const isOptionSelected = prevOptions.find(
        (i) => i.value === selected || i.value === selected.toUpperCase()
      )

      if (isOptionSelected) {
        const newOptions = prevOptions.filter(
          (option) => option.value !== selected
        )
        onChange(newOptions)
        return newOptions
      } else {
        const newOptions = [...prevOptions, option]
        onChange(newOptions)
        return newOptions
      }
    }

    onChange(getUpdated(selectedOptions))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedOptions?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden dark:text-white"
              >
                {selectedOptions.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedOptions.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal dark:text-white"
                  >
                    {selectedOptions.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      selectedOptions
                        .map(({ value }) => value)
                        .includes(option.value)
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        style={{
                          color: option?.color || "",
                        }}
                        className="rounded-sm px-1 font-normal dark:text-white"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selectedOptions
                  .map(({ value }) => value)
                  .includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}

                    <span
                      style={{
                        color: option?.color,
                      }}
                    >
                      {option.label}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedOptions.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
