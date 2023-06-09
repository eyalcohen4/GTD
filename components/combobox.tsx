"use client"

import * as React from "react"
import { render } from "@headlessui/react/dist/utils/render"
import { Check, Loader, LucideIcon, PlusCircle, X } from "lucide-react"

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
  value,
  items,
  onChange,
  loading,
  multiple,
  name,
  type,
  matchContainerSize,
}: {
  value?: Option | Option[] | null
  name: string
  type: "project" | "context" | "status"
  items: Option[]
  loading?: boolean
  multiple?: boolean
  matchContainerSize?: boolean
  onChange: (option: Option | Option[] | null) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelectedItem] = React.useState<Option | null>(null)
  const [multipleSelected, setMultipleSelected] = React.useState<Option[]>([])
  const [search, setSearch] = React.useState("")
  const [renderCreate, setRenderCreate] = React.useState(false)

  React.useEffect(() => {
    if (multiple && Array.isArray(value)) {
      setMultipleSelected(value as Option[])
    } else {
      setSelectedItem(value as Option)
    }
  }, [value, multiple])

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

    console.log(value, item)
    if (!item) return

    const isSelected = multipleSelected.find(
      (item) => item.value === value || item.value === value.toUpperCase()
    )

    if (isSelected) {
      const filtered = multipleSelected.filter(
        (item) => item.value !== value && item.value !== value.toUpperCase()
      )
      setMultipleSelected(filtered)
      onChange(filtered)
    } else {
      setMultipleSelected([...multipleSelected, item])
      onChange([...multipleSelected, item])
    }

    setOpen(false)
  }

  const handleCreated = () => {
    setRenderCreate(false)
    setSearch("")
  }

  const handleCancel = () => {
    setRenderCreate(false)
  }

  // @ts-ignore
  const CreateComponent = CREATE_COMPONENTS[type] || null

  return (
    <div className="flex items-center space-x-4 text-muted-foreground">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full">
          <Trigger
            loading={loading}
            selected={selected}
            multipleSelected={multipleSelected}
            name={name}
            remove={(value) => handleMultipleSelect(value || "")}
          />
        </PopoverTrigger>
        <PopoverContent
          className="p-0 min-w-[200px] w-full"
          matchContainerSize={matchContainerSize}
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
                {renderCreate ? null : (
                  <div className="flex flex-col gap-4 px-4 pt-4">
                    <span>No result found.</span>
                    {CreateComponent ? (
                      <div className="relative select-none rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer flex items-center justify-between">
                        <div
                          className={cn(
                            "cursor-pointer flex items-center gap-2"
                          )}
                          onClick={handleCreate}
                        >
                          <PlusCircle />
                          Create {name}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                <ScrollArea className="min-h-[110px] scrollarea">
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
                            {item?.color && !item?.icon ? (
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
                              <Check className="h-4 w-4" />
                            ) : null}
                          </span>
                        </CommandItem>
                      ))}
                      {CreateComponent ? (
                        <CommandItem
                          key="Create"
                          className={cn(
                            "cursor-pointer flex items-center gap-2"
                          )}
                          onSelect={handleCreate}
                        >
                          <PlusCircle />
                          Create {name}
                        </CommandItem>
                      ) : null}
                    </>
                  )}
                </ScrollArea>
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
  remove,
  name,
}: {
  loading?: boolean
  selected?: Option | null
  multipleSelected?: Option[]
  name: string
  remove?: (value?: string) => void
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="min-w-[200px] w-full justify-start"
    >
      {loading ? <Loader /> : null}
      {multipleSelected ? (
        <div className="flex items-center gap-2 overflow-scroll max-w-full">
          {multipleSelected?.map((item, index) => (
            <div
              className="flex items-center gap-2 rounded"
              key={item.label}
              style={{
                color: `${item.color}`,
                padding: "1px 4px",
              }}
            >
              {item?.icon ? (
                <item.icon className="mr-2 h-4 w-4 shrink-0 text-slate-950 dark:text-white" />
              ) : null}
              <span className="">{item.label}</span>
              <div
                className="cursor-pointer"
                role="button"
                onClick={() => remove && remove(item.value)}
              >
                <X className="text-slate-950 dark:text-white text-xs h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {selected ? (
        <>
          {selected?.color && !selected?.icon ? (
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
