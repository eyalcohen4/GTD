"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Icons } from "./icons"

const navItems = [
  {
    name: "Inbox",
    href: "/",
    color: "#007BFF",
  },
  {
    name: "Today",
    href: "/today",
    // icon: Icons.calendar,
  },
]

type Item = {
  href: string
  name: string
  icon?: LucideIcon
  color?: string
}

export const Nav = () => {
  return (
    <nav className="flex flex-col gap-4 w-full">
      {navItems.map((item) => (
        <NavItem key={item.name} item={item} />
      ))}
    </nav>
  )
}

export const NavItem = ({ item }: { item: Item }) => {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <div
      className={cn(
        "flex items-center w-full gap-2 text-lg px-4 py-2 rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
        isActive
          ? "text-primary-foreground font-bold dark:bg-slate-800 bg-slate-50"
          : "text-slate-950 dark:text-white"
      )}
    >
      {item?.color ? (
        <div
          className="w-4 h-4 rounded-full"
          style={{ background: item.color }}
        ></div>
      ) : null}
      {item.icon ? (
        <item.icon className="text-muted-foreground h-4 w-4" />
      ) : null}
      <span className="text-slate-950 dark:text-white">{item.name}</span>
    </div>
  )
}
