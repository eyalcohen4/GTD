import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <h1>Eyal Cohen</h1>
        <div className="flex flex-1 items-center justify-center space-x-4">
          <p>Goal: 100k NIS</p>
        </div>
      </div>
    </header>
  )
}
