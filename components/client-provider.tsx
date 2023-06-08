"use client"

import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { ContextsProvider } from "./providers/contexts-provider"
import { ProjectsProvider } from "./providers/projects-provider"
import { TasksProvider } from "./providers/tasks-provider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
})

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ContextsProvider>
        <ProjectsProvider>
          <TasksProvider>{children}</TasksProvider>
        </ProjectsProvider>
      </ContextsProvider>
    </QueryClientProvider>
  )
}
