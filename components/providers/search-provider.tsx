import React, { ReactNode, createContext, useContext, useMemo } from "react"

const SearchContext = createContext<{
  isOpen: boolean
  toggle: () => void
}>({
  isOpen: false,
  toggle: () => {},
})

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const value = useMemo(
    () => ({
      isOpen,
      toggle: (isOpen?: boolean) =>
        setIsOpen((prev) => (isOpen ? isOpen : !prev)),
    }),
    [isOpen]
  )

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider")
  }
  return context
}
