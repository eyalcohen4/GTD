import { ReactNode } from "react"

import { AppCommand } from "../app-command"
import { ThemeToggle } from "../theme-toggle"
import { Command } from "../ui/command"

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen">
      <Header />
      <div className="grid grid-cols-[200px_1fr] h-[calc(100vh-81px)]">
        <aside className="h-full border-r"></aside>
        <div className="h-full">{children}</div>
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <div className="h-[80px] border-b flex justify-between items-center px-4">
      <div>Name/Stuff</div>
      <div>
        <AppCommand />
      </div>
      <div>
        <ThemeToggle />
      </div>
    </div>
  )
}
