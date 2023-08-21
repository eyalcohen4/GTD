import { ReactNode } from "react"
import Link from "next/link"
import { Box, Flower, Flower2, Home, Menu } from "lucide-react"

import { AppCommand } from "../app-command"
import { Nav } from "../nav"
import { ProfilePicture } from "../profile-picture"
import { ThemeToggle } from "../theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen">
      {/* <Header /> */}
      <div className="md:grid md:grid-cols-[265px_1fr] h-[calc(100vh-81px)] w-full">
        <aside className="h-full border-r md:block hidden">
          <div className="mt-4 px-4 flex  h-[60px] items-center justify-between">
            <p className="text-xl font-bold">Current</p>
            <div className="flex items-center gap-4">
              <ProfilePicture />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <Nav />
          </div>
        </aside>
        <div className="w-full overflow-auto h-screen">
          <Header />
          <section className="h-full w-full mt-8">{children}</section>
        </div>
        <footer className="md:hidden h-12 w-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 dark:text-white shadow-lg backdrop-blur-lg fixed flex items-center  bottom-2 right-2 justify-end">
          <Sheet>
            <SheetTrigger className="w-full flex h-full justify-center items-center">
              <Menu />
            </SheetTrigger>
            <SheetContent className="flex h-full justify-end flex-col">
              <Nav />
            </SheetContent>
          </Sheet>
        </footer>
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <div className="h-[80px] top-0 z-50 bg-background sticky border-b flex justify-between items-center px-4">
      <div className="w-full">
        <AppCommand />
      </div>
      <ThemeToggle />
    </div>
  )
}
