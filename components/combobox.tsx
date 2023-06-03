"use client"

import * as React from "react"
import { render } from "@headlessui/react/dist/utils/render"
import {
  ArrowUpCircle,
  CheckCircle2,
  CheckIcon,
  Circle,
  HelpCircle,
  LoaderIcon,
  LucideIcon,
  PlusCircle,
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

import { CreateContext } from "./create-context"
import { CreateProject } from "./create-project"
import { ScrollArea } from "./ui/scroll-area"

export type Option = {
  color?: string
  value: string
  label: string
  icon?: LucideIcon
}

const CREATE_COMPONENTS = {
  project: CreateProject,
  context: CreateContext,
}

export function ComboboxPopover({
  items,
  onChange,
  loading,
  multiple,
  name,
  type,
}: {
  name: string
  type: "project" | "context" | "status"
  items: Option[]
  createType?: string
  loading?: boolean
  multiple?: boolean
  onChange: (option: Option | null) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelectedItem] = React.useState<Option | null>(null)
  const [multipleSelected, setMultipleSelected] = React.useState<Option[]>([])
  const [search, setSearch] = React.useState("")
  const [renderCreate, setRenderCreate] = React.useState(false)

  const handleCreate = () => {
    setRenderCreate(true)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleSelect = (value: string) => {
    const item =
      items.find(
        (item) => item.value === value || item.value === value.toUpperCase()
      ) || null
    setSelectedItem(item)
    onChange(item)

    setOpen(false)
  }

  const handleMultipleSelect = (value: string) => {
    const item =
      items.find(
        (item) => item.value === value || item.value === value.toUpperCase()
      ) || null

    if (!item) return

    const isSelected = multipleSelected.find(
      (item) => item.value === value || item.value === value.toUpperCase()
    )
    console.log(isSelected)

    if (isSelected) {
      const filtered = multipleSelected.filter(
        (item) => item.value !== value && item.value !== value.toUpperCase()
      )
      setMultipleSelected(filtered)
    } else {
      setMultipleSelected([...multipleSelected, item])
    }

    onChange(item)
    setOpen(false)
  }

  const handleCreated = () => {
    setRenderCreate(false)
  }

  const handleCancel = () => {
    setRenderCreate(false)
  }

  // @ts-ignore
  const CreateComponent = CREATE_COMPONENTS[type] || null

  return (
    <div className="flex items-center space-x-4 text-muted-foreground">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Trigger
            loading={loading}
            selected={selected}
            multipleSelected={multipleSelected}
            name={name}
          />
        </PopoverTrigger>
        <PopoverContent
          className="p-0 min-w-[200px] w-auto"
          side="bottom"
          align="center"
        >
          <Command>
            <CommandInput
              placeholder="Search"
              onValueChange={handleSearchChange}
            />
            <CommandList>
              {renderCreate ? (
                <div className="p-4">
                  <CreateComponent
                    onCreated={handleCreated}
                    onCancel={handleCancel}
                  />
                </div>
              ) : null}
              <CommandEmpty>
                {renderCreate ? null : <span>No result found.</span>}
              </CommandEmpty>
              <CommandGroup>
                {renderCreate ? null : (
                  <>
                    {items?.map((item) => (
                      <CommandItem
                        key={item.label}
                        className={cn(
                          "cursor-pointer flex items-center justify-between"
                        )}
                        value={item.value}
                        onSelect={
                          multiple ? handleMultipleSelect : handleSelect
                        }
                      >
                        <div className="flex items-center">
                          {item?.icon ? (
                            <item.icon className={cn("mr-2 h-4 w-4")} />
                          ) : null}
                          {item?.color ? (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ background: item.color }}
                              ></div>
                            </div>
                          ) : null}
                          <span
                            className={
                              item.value === selected?.value ||
                              multipleSelected?.find(
                                (selected) =>
                                  selected.value === item.value ||
                                  selected.value === item.value.toUpperCase()
                              )
                                ? "font-bold"
                                : ""
                            }
                          >
                            {item.label}
                          </span>
                        </div>
                        <span>
                          {item.value === selected?.value ||
                          multipleSelected?.find(
                            (selected) =>
                              selected.value === item.value ||
                              selected.value === item.value.toUpperCase()
                          ) ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : null}
                        </span>
                      </CommandItem>
                    ))}
                    <CommandItem
                      key="Create"
                      className={cn("cursor-pointer flex items-center gap-2")}
                      onSelect={handleCreate}
                    >
                      <PlusCircle />
                      Create {name}
                    </CommandItem>
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const EmptyState = ({
  search,
  createComponent,
  onCreate,
}: {
  search: string
  createComponent?: React.ReactElement
  onCreate?: (name: string) => void
}) => {
  const [renderCreateComponent, setRenderCreateComponent] =
    React.useState(false)

  const handleCreate = () => {
    if (createComponent) {
      setRenderCreateComponent(true)
      return
    }

    onCreate && onCreate(search)
  }

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      {renderCreateComponent ? (
        <div className="flex items-center p-4 gap-2">{createComponent}</div>
      ) : null}
      {(onCreate || createComponent) && !renderCreateComponent ? (
        <div
          className="flex items-center gap-2 justify-start"
          role="button"
          onClick={handleCreate}
        >
          <PlusCircle />
          Create {search}
        </div>
      ) : null}
      {!onCreate && !createComponent ? <span>No results found.</span> : null}
    </div>
  )
}

const Trigger = ({
  loading,
  selected,
  multipleSelected,
  name,
}: {
  loading?: boolean
  selected?: Option | null
  multipleSelected?: Option[]
  name: string
}) => {
  return (
    <Button variant="outline" size="sm" className="w-[200px] justify-start">
      {loading ? <LoaderIcon /> : null}
      {multipleSelected ? (
        <div className="flex items-center gap-1">
          {multipleSelected?.map((item, index) => (
            <>
              {item?.color ? (
                <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: item.color }}
                  ></div>
                </div>
              ) : null}
              {item?.icon ? (
                <item.icon className="mr-2 h-4 w-4 shrink-0 text-slate-950 dark:text-white" />
              ) : null}
              <span className="text-slate-950 dark:text-white">
                {item.label}
                {index !== multipleSelected.length - 1 && ","}
              </span>
            </>
          ))}
        </div>
      ) : null}
      {selected ? (
        <>
          {selected?.color ? (
            <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: selected.color }}
              ></div>
            </div>
          ) : null}
          {selected.icon ? (
            <selected.icon className="mr-2 h-4 w-4 shrink-0 text-slate-950 dark:text-white" />
          ) : null}
          <span className="text-slate-950 dark:text-white">
            {selected.label}
          </span>
        </>
      ) : null}
      {!selected && !multipleSelected?.length ? <>Select {name} </> : null}
    </Button>
  )
}
