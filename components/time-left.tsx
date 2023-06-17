import dayjs from "dayjs"

import { cn } from "@/lib/utils"

export const TimeLeft = ({ date }: { date: string }) => {
  const difference = dayjs(date).diff(dayjs(), "day")
  const diffCopy =
    difference > 0
      ? `${difference + 1} days left`
      : `${Math.abs(difference - 1)} days overdue`

  return (
    <span className={cn(difference > 0 ? "text-green-500" : "text-red-500")}>
      {diffCopy}
    </span>
  )
}
