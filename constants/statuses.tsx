import {
  Archive,
  Bookmark,
  Calendar,
  Check,
  Circle,
  Clock1,
  FastForward,
  Hourglass,
  Inbox,
  LucideProps,
  Pause,
  PlayCircle,
  XCircle,
} from "lucide-react"

import { SomedayIcon } from "@/components/someday-icon"

export type StatusConfig = {
  value: string
  label: string
  description?: string
  slug: string
  color?: string
  icon?: (props: LucideProps) => JSX.Element
  order: number
}

export const goalsStatuses: Array<StatusConfig> = [
  {
    value: "NOT_STARTED",
    label: "Not Started",
    description: "Here you can find everything you captured",
    slug: "not-started",
    color: "#7C83FD",
    icon: Circle,
    order: 1,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    slug: "in-progress",
    color: "#FFB703",
    icon: PlayCircle,
    order: 2,
  },
  {
    value: "COMPLETED",
    label: "Completed",
    slug: "completed",
    color: "#009F5D",
    icon: Check,
    order: 3,
  },

  {
    value: "ON_HOLD",
    label: "On Hold",
    slug: "on-hold",
    color: "#FF6B69",
    icon: Pause,
    order: 4,
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    slug: "cancelled",
    color: "#FF0000",
    icon: XCircle,
    order: 5,
  },
]

export const statuses: Array<StatusConfig> = [
  {
    value: "INBOX",
    label: "Inbox",
    description: "Here you can find everything you captured",
    slug: "inbox",
    color: "#007BFF",
    icon: Inbox,
    order: 1,
  },
  {
    value: "NEXT_ACTION",
    label: "Next Action",
    description: "Here you can find all your next actions",
    slug: "next-action",
    color: "#28A745",
    icon: FastForward,
    order: 2,
  },
  {
    value: "WAITING_FOR",
    label: "Waiting For",
    description: "Here you can find everything you are waiting for",
    slug: "waiting-for",
    color: "#FFC107",
    icon: Hourglass,
    order: 3,
  },
  {
    value: "SOMEDAY_MAYBE",
    label: "Someday / Maybe",
    description: "Here you can find everything that is on hold",
    slug: "someday-maybe",
    color: "#FD7E14",
    icon: SomedayIcon,
    order: 4,
  },
  {
    value: "CALENDAR",
    label: "Calendar",
    description: "Here you can find everything that is scheduled",
    slug: "calendar",
    color: "#DC3545",
    icon: Calendar,
    order: 5,
  },
  {
    value: "REFERENCE",
    label: "Reference",
    description: "Here you can find all your reference material",
    slug: "reference",
    color: "#6F42C1",
    icon: Bookmark,
    order: 6,
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: Clock1,
    slug: "review",
    order: 7,
  },
  {
    value: "ARCHIVE",
    label: "Archive",
    icon: Archive,
    slug: "archive",
    order: 8,
  },
]
