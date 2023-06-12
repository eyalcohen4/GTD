import {
  Archive,
  Bookmark,
  Calendar,
  Clock1,
  FastForward,
  Hourglass,
  Inbox,
  LucideProps,
} from "lucide-react"

export type StatusConfig = {
  value: string
  label: string
  description?: string
  slug: string
  color?: string
  icon?: (props: LucideProps) => JSX.Element
  order: number
}

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
    icon: (props: LucideProps) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-monitor-pause"
        {...props}
      >
        <path d="M10 13V7" />
        <path d="M14 13V7" />
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <path d="M12 17v4" />
        <path d="M8 21h8" />
      </svg>
    ),
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
