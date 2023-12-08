import "@/styles/globals.css"
import { Metadata } from "next"
import { HighlightInit } from "@highlight-run/next/client"
import { Analytics } from "@vercel/analytics/react"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { getSession, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import ClientProvider from "@/components/client-provider"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { UserProvider } from "@/components/user-proivder"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/logo.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
  task: any
}

export default function RootLayout({ children, task }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            GeistSans.className
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserProvider>
              <ClientProvider>
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">{children}</div>
                  {task}
                  <Toaster />
                </div>
                <TailwindIndicator />
              </ClientProvider>
            </UserProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  )
}
