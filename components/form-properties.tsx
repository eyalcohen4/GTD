import { ReactNode } from "react"

export const FormProperty = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center justify-start gap-4">{children}</div>
}

export const FormPropertyLabel = ({
  label,
  icon,
}: {
  label: string
  icon?: ReactNode
}) => {
  return (
    <div className="flex gap-2 w-[200px] items-center text-lg">
      <span>{icon}</span>
      <p>{label}</p>
    </div>
  )
}

export const FormPropertyValue = ({ children }: { children: ReactNode }) => {
  return <div className="w-full">{children}</div>
}
