import "@/styles/globals.css"
import { Metadata } from "next"
import { HighlightInit } from "@highlight-run/next/highlight-init"
import { Analytics } from "@vercel/analytics/react"
import { getSession, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import ClientProvider from "@/components/client-provider"
import { SiteHeader } from "@/components/site-header"
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
  task: any
}

export default function RootLayout({ children, task }: RootLayoutProps) {
  return (
    <>
      <HighlightInit
        projectId={"odz6x4ep"}
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }}
      />
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
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
