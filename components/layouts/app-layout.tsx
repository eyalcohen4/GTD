import { ReactNode } from "react"

import { AppCommand } from "../app-command"
import { Nav } from "../nav"
import { ProfilePicture } from "../profile-picture"
import { ThemeToggle } from "../theme-toggle"

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen">
      <Header />
      <div className="md:grid md:grid-cols-[200px_1fr] h-[calc(100vh-81px)] w-full">
        <aside className="h-full border-r md:block hidden">
          <div className="flex flex-col items-center gap-4 mt-8">
            <Nav />
          </div>
        </aside>
        <div className="h-full w-full">
          <section className="h-full w-full mt-8">{children}</section>
        </div>
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <div className="h-[80px] border-b flex justify-between items-center px-4">
      <div>
        <ProfilePicture />
      </div>
      <div>
        <AppCommand />
      </div>
      <div>
        <ThemeToggle />
      </div>
    </div>
  )
}
