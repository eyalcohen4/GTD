import {
  BookmarkIcon,
  CalendarIcon,
  FastForward,
  FastForwardIcon,
  HourglassIcon,
  InboxIcon,
} from "lucide-react"

export const statuses = [
  {
    value: "INBOX",
    label: "Inbox",
    color: "#007BFF",
    icon: InboxIcon,
  },
  {
    value: "NEXT_ACTION",
    label: "Next Action",
    color: "#28A745",
    icon: FastForwardIcon,
  },
  {
    value: "WAITING_FOR",
    label: "Waiting For",
    color: "#FFC107",
    icon: HourglassIcon,
  },
  {
    value: "SOMEDAY_MAYBE",
    label: "Someday / Maybe",
    color: "#FD7E14",
    icon: (props) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
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
  },
  {
    value: "CALENDAR",
    label: "Calendar",
    color: "#DC3545",
    icon: CalendarIcon,
  },
  {
    value: "REFERENCE",
    label: "Reference",
    color: "#6F42C1",
    icon: BookmarkIcon,
  },
  // {
  //   value: "REVIEW",
  //   label: "Review",
  //   color: "#6C757D",
  // },
]
