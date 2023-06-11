import { usePathname, useRouter } from "next/navigation"

type PageContext = {
  type: "project" | "context" | null
  id: string | null
}

export function usePageContext(): PageContext {
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter((segment) => segment)

  if (pathSegments.length < 2) {
    return { type: null, id: null }
  }

  const [type, id] = pathSegments

  switch (type) {
    case "project":
    case "context":
      return { type, id }
    default:
      return { type: null, id: null }
  }
}
