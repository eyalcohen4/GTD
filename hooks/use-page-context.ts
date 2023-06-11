import { usePathname, useRouter } from "next/navigation"
import { statuses } from "@/constants/statuses"

type PageContext = {
  type: "project" | "context" | "status" | null
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
    case "status":
      const status = statuses.find((status) => status.slug === id)
      return { type, id: status?.value || "" }
    default:
      return { type: null, id: null }
  }
}
