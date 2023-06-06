import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import { Context, ContextInput } from "@/types/context"
import { useCreateContext, useGetContexts } from "@/hooks/contexts"

type ContextContextValue = {
  contexts: Context[]
  loadingGetContexts: boolean
  loadingCreateContext: boolean
  createContext: (context: ContextInput) => void
}

const ContextContext = createContext<ContextContextValue>({
  contexts: [],
  loadingGetContexts: false,
  loadingCreateContext: false,
  createContext: (context: ContextInput) => {},
})

export const ContextsProvider = ({ children }: { children: ReactNode }) => {
  const { contexts, isLoading: isLoadingContexts } = useGetContexts()
  const {
    createContext: createContextMutation,
    isLoading: loadingCreateContext,
  } = useCreateContext()

  const createContext = async (context: ContextInput) => {
    await createContextMutation(context)
  }

  const value = useMemo(
    () => ({
      contexts,
      createContext,
      loadingGetContexts: isLoadingContexts,
      loadingCreateContext,
    }),
    [contexts, createContext]
  )

  return (
    <ContextContext.Provider value={value}>{children}</ContextContext.Provider>
  )
}

export const useContexts = () => {
  const context = useContext(ContextContext)
  if (context === undefined) {
    throw new Error("useContextContext must be used within a ContextProvider")
  }
  return context
}
