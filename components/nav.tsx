"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { statuses } from "@/constants/statuses"
import { ChevronDown, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useGetContexts } from "@/hooks/contexts"
import { useGetProjects } from "@/hooks/projects"

import { Icons } from "./icons"
import { useContexts } from "./providers/contexts-provider"
import { useProjects } from "./providers/projects-provider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { ScrollArea } from "./ui/scroll-area"

const statusesNavItems = statuses.map((status) => ({
  name: status.label,
  href: `/status/${status.label}`,
  color: status.color,
  icon: status.icon,
}))

const navItems = [
  {
    name: "Today",
    href: "/today",
    icon: Icons.calendar,
  },
  ...statusesNavItems,
]

type Item = {
  href: string
  name: string
  icon?: LucideIcon
  color?: string
}

export const Nav = () => {
  const { contexts } = useContexts()
  const { projects } = useProjects()

  const projectMenu = React.useMemo(
    () =>
      projects?.map((project) => ({
        id: project.id,
        href: `/project/${project.id}`,
        name: project.title,
        color: project.color,
      })),
    [projects]
  )

  const contextsMenu = React.useMemo(
    () =>
      contexts?.map((context) => ({
        id: context.id,
        href: `/context/${context.id}`,
        name: context.title,
        color: context.color,
      })),
    [contexts]
  )

  return (
    <nav className="flex flex-col gap-4 w-full">
      <ScrollArea>
        {navItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
        <div className="flex flex-col gap-2">
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <div
                className={cn(
                  "flex items-center justify-between w-full gap-2 px-4 py-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                <span>Projects</span>
                <ChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {projectMenu?.map((project) => (
                <NavItem isSubItem key={project.name} item={project} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="flex flex-col gap-2">
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <div
                className={cn(
                  "flex items-center justify-between w-full gap-2 px-4 py-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                <span>Contexts</span>
                <ChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {contextsMenu?.map((context) => (
                <NavItem isSubItem key={context.id} item={context} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </nav>
  )
}

export const NavItem = ({
  item,
  isSubItem,
}: {
  item: Item
  isSubItem?: boolean
}) => {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <div
      className={cn(
        "flex items-center w-full text-sm gap-2 px-4 py-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800",
        isActive
          ? "text-primary-foreground font-bold dark:bg-slate-800 bg-slate-200"
          : "text-slate-950 dark:text-white",
        isSubItem ? "pl-8 text-sm" : ""
      )}
    >
      {item?.color && !item.icon ? (
        <div
          className="w-4 h-4 rounded-full"
          style={{ background: item.color }}
        ></div>
      ) : null}
      {item.icon ? (
        <item.icon className="text-slate-950 dark:text-white h-5 w-5" />
      ) : null}
      <span className="text-slate-950 dark:text-white">{item.name}</span>
    </div>
  )
}
