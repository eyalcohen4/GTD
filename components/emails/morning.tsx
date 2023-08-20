import * as React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
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
      <Img
        src="https://staycurrent.app/logo.png"
        alt="Remember To Be Current"
      />
      <Container style={container}>
        <Section>
          <Heading style={h1}>{dayjs().format("dddd, MMMM DD")}</Heading>
          <Text style={text}>Good Morning {firstName} ☀️</Text>
          <Text style={text}>
            Here is your morning report so you can be current today.
          </Text>
        </Section>
        <Section>
          <Text>Tasks you wanted to complete today</Text>
          {today.length > 0 ? (
            today.map((task) => (
              <Row>
                <Link href={`https://staycurrent.app/task/${task.id}`}>
                  <Body>{task.title}</Body>
                </Link>
              </Row>
            ))
          ) : (
            <Text style={text}>You have no tasks due today.</Text>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: "#e2e8f0",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const container = {
  backgroundColor: "#f9fafb",
  margin: "auto",
  padding: "32px",
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
