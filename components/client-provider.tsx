"use client"

import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ContextsProvider } from "./providers/contexts-provider"
import { ProjectsProvider } from "./providers/projects-provider"
import { TasksProvider } from "./providers/tasks-provider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
})

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextsProvider>
        <ProjectsProvider>
          <TasksProvider>{children}</TasksProvider>
        </ProjectsProvider>
      </ContextsProvider>
    </QueryClientProvider>
  )
}
