import * as React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components"
import dayjs from "dayjs"

import { Project } from "@/types/project"
import { TaskPreview } from "@/types/task"

import { TaskListItem } from "../task-list-item"

interface EmailTemplateProps {
  firstName: string
  overdue: TaskPreview[]
  today: TaskPreview[]
  projects: Array<
    Project & {
      progress: {
        all: number
        completed: number
        inbox: number
        waitingFor: number
        nextAction: number
        somedayMaybe: number
      }
    }
  >
  inbox: Array<TaskPreview>
  completed: Array<TaskPreview>
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  completed,
  overdue,
  today,
  projects,
  inbox,
}) => (
  <Html>
    <Head />
    <Preview>Remember To Be Current</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{dayjs().format("dddd, MMMM DD")}</Heading>
        <Img
          src="https://staycurrent.app/icon.png"
          alt="Remember To Be Current"
        />
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: "#51545e",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const container = {
  margin: "auto",
  padding: "96px 20px 64px",
}

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
}

const text = {
  color: "#aaaaaa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 40px",
}
