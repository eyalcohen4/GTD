"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { StatusConfig, goalsStatuses, statuses } from "@/constants/statuses"
import {
  AlignJustify,
  BarChart,
  ChevronDown,
  Filter,
  FolderOpenIcon,
  Globe,
  GridIcon,
  Home,
  Layers,
  LineChart,
  LucideIcon,
  Sunrise,
  TargetIcon,
  TrophyIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { usePageContext } from "@/hooks/use-page-context"

import { Icons } from "./icons"
import { ProfilePicture } from "./profile-picture"
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
  suffixIcon?: LucideIcon
  icon?: LucideIcon
  color?: string
}

export const Nav = () => {
  const { contexts } = useContexts()
  const { projects } = useProjects()
  const pageContext = usePageContext()

  const groupedProjectsByStatus: Record<
    string,
    Array<Item>
  > = React.useMemo(() => {
    return projects?.reduce((acc, project) => {
      const status = project.status || "No Status"
      // @ts-ignore
      if (!acc[status]) acc[status] = []
      // @ts-ignore
      acc[status].push({
        id: project.id,
        href: `/project/${project.id}`,
        name: project.title,
        color: project.color,
      })
      return acc
    }, {})
  }, [projects])

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
        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/"
            className={
              "flex w-full cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <Home className="h-4 w-4" />
            <span className="rounded-md py-1">Home</span>
          </Link>
          <Link
            href="/projects"
            className={
              "flex w-full cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <GridIcon className="h-4 w-4" />
            <span className="rounded-md py-1">Projects</span>
          </Link>

          <Link
            href="/goals"
            className={
              "flex w-full cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <TrophyIcon className="h-4 w-4" />
            <span className="rounded-md py-1">Goals</span>
          </Link>
          <Link
            href="/kpis"
            className={
              "flex w-full cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <BarChart className="h-4 w-4" />
            <span className="rounded-md py-1">KPIs</span>
          </Link>
          <Link
            href="/views"
            className={
              "flex w-full cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <AlignJustify className="h-4 w-4" />
            <span className="rounded-md py-1">Views</span>
          </Link>
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
        "flex pl-8 pr-4 items-center justify-between w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
      )}
    >
      <span className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
        {children}
      </span>
      <ChevronDown />
    </div>
  )
}

const StatusGroup = ({ status }: { status: string }) => {
  const instance = goalsStatuses.find((s) => s.value === status)

  if (status === "No Status") {
    return (
      <div className="flex items-center gap-2 px-4 dark:bg-gray-800 bg-gray-100">
        <div className={`h-2 w-2 rounded-full bg-gray-400`} />
        <span className="font-semibold py-1">{status}</span>
      </div>
    )
  }

  if (!instance) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-4 dark:bg-gray-800 bg-gray-100">
      <div className={`h-2 w-2 rounded-full bg-${instance?.color}`} />
      {instance.icon ? (
        <instance.icon
          className={"h-4 w-4"}
          style={
            instance.color
              ? {
                  color: instance.color,
                }
              : {}
          }
        />
      ) : null}
      <span className="font-semibold py-1">{instance.label}</span>
    </div>
  )
}
