"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { statuses } from "@/constants/statuses"
import {
  ChevronDown,
  Filter,
  Globe,
  Home,
  LucideIcon,
  Sunrise,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { usePageContext } from "@/hooks/use-page-context"

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
  href: `/status/${status.slug}`,
  color: status.color,
  icon: status.icon,
}))

const timingNavItems = [
  {
    name: "Today",
    href: "/time/today",
    icon: Sunrise,
  },
  {
    name: "Weekly",
    href: "/time/week",
    icon: () => <div>07</div>,
  },
  {
    name: "Monthly",
    href: "/time/month",
    icon: () => <div>30</div>,
  },
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
  const pageContext = usePageContext()

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
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className={
              "flex px-4 items-center w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <Home className="h-4 w-4" />
            <span className="rounded-md text-lg font-semibold py-1">Home</span>
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-2 px-4">
              <Filter className="h-4 w-4" />
              <span className="rounded-md text-lg font-semibold py-1">
                Filters
              </span>
            </div>
            <div>
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <FilterTrigger>Time</FilterTrigger>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {timingNavItems.map((item) => (
                    <NavItem isSubItem key={item.name} item={item} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
              <Collapsible defaultOpen={pageContext?.type === "status"}>
                <CollapsibleTrigger className="w-full">
                  <FilterTrigger>Status</FilterTrigger>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {statusesNavItems.map((item) => (
                    <NavItem isSubItem key={item.name} item={item} />
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen={pageContext?.type === "project"}>
                <CollapsibleTrigger className="w-full">
                  <FilterTrigger>Project</FilterTrigger>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {projectMenu?.map((project) => (
                    <NavItem isSubItem key={project.name} item={project} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
              <Collapsible defaultOpen={pageContext?.type === "context"}>
                <CollapsibleTrigger className="w-full">
                  <FilterTrigger>Context</FilterTrigger>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {contextsMenu?.map((context) => (
                    <NavItem isSubItem key={context.id} item={context} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
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
    <Link
      className={cn(
        `gap-2 cursor-pointer hover:bg-slate-200
        dark:hover:bg-slate-800 group flex w-full items-center border border-transparent py-1 hover:underline text-muted-foreground`,
        isSubItem ? "text-sm text-muted-foreground pl-8" : "",
        isActive
          ? "text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-800 font-bold rounded-none"
          : ""
      )}
      href={item.href}
    >
      {item?.color && !item.icon ? (
        <div
          className="w-4 h-4 rounded-full"
          style={{ background: item.color }}
        ></div>
      ) : null}
      {item.icon ? (
        <item.icon
          className={"h-4 w-4"}
          style={
            item.color
              ? {
                  color: item.color,
                }
              : {}
          }
        />
      ) : null}
      <span>{item.name}</span>
    </Link>
  )
}

const FilterTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "flex px-6 items-center justify-between w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
      )}
    >
      <span className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
        {children}
      </span>
      <ChevronDown />
    </div>
  )
}
