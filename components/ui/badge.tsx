import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const Badge = ({
  variant,
  children,
  className,
}: {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger"
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "border rounded-md h-full flex items-center gap-2 px-2 py-1 text-xs",
        className
      )}
    >
      {children}
    </div>
  )
}
